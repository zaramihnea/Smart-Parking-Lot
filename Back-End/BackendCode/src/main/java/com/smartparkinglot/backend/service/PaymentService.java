package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.DTO.PaymentDetailsDTO;
import com.smartparkinglot.backend.DTO.RefundRequest;
import com.smartparkinglot.backend.DTO.TransactionDTO;
import com.smartparkinglot.backend.DTO.PaymentResponseDTO;
import com.smartparkinglot.backend.configuration.StripeConfig;
import com.smartparkinglot.backend.customexceptions.PaymentException;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.repository.ParkingSpotRepository;
import com.stripe.Stripe;
import com.stripe.exception.InvalidRequestException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.param.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PaymentService {

    private final StripeConfig stripeConfig;
    private final Logger log = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private EmailService emailService;

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;

    @Autowired
    private UserService userService;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeConfig.getApiKey();
    }

    public PaymentService(StripeConfig stripeConfig) {
        this.stripeConfig = stripeConfig;
    }

    public PaymentResponseDTO createPaymentIntent(PaymentDetailsDTO paymentDetailsDTO) {
        try {
            Stripe.apiKey = stripeConfig.getApiKey();

            validatePaymentDetails(paymentDetailsDTO);
            Customer customer = getOrCreateCustomer(paymentDetailsDTO.getEmail());
            PaymentIntent paymentIntent = createStripePaymentIntent(customer, paymentDetailsDTO.getAmount());

            log.info("Payment intent created: {}", paymentIntent.getId());
            return new PaymentResponseDTO(paymentIntent.getClientSecret(), paymentIntent.getId());
        } catch (StripeException e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            throw new PaymentException("Error processing payment.");
        }
    }

    private void validatePaymentDetails(PaymentDetailsDTO paymentDetailsDTO) {
        if (paymentDetailsDTO.getEmail() == null || paymentDetailsDTO.getEmail().isEmpty()) {
            throw new PaymentException("User email is required.");
        }
        if (paymentDetailsDTO.getAmount() < 2) {
            throw new PaymentException("Amount must be greater than 2.");
        }
        // Add more validation as needed
    }

    private Customer getOrCreateCustomer(String email) throws StripeException {
        CustomerListParams params = CustomerListParams.builder()
                .setEmail(email)
                .build();
        List<Customer> customers = Customer.list(params).getData();
        if (customers.isEmpty()) {
            CustomerCreateParams createParams = CustomerCreateParams.builder()
                    .setEmail(email)
                    .build();
            return Customer.create(createParams);
        }
        return customers.get(0);
    }

    private PaymentIntent createStripePaymentIntent(Customer customer, Double amount) throws StripeException {
        PaymentIntentCreateParams paymentParams = PaymentIntentCreateParams.builder()
                .setAmount((long)(amount*100))
                .setCustomer(customer.getId())
                .setCurrency("ron")
                .setReceiptEmail(customer.getEmail())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods
                                .builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        return PaymentIntent.create(paymentParams);
    }

    private String getAdminStripeAccountIdByParkingSpotId(Long parkingSpotId) {
        ParkingSpot parkingSpot = parkingSpotRepository.findById(parkingSpotId)
                .orElseThrow(() -> new PaymentException("Parking spot not found"));
        String admin = new ParkingSpotService(parkingSpotRepository).getAdminStripeIdByParkingSpotId(parkingSpotId);
        if (admin == null) {
            throw new PaymentException("Admin or Stripe account ID not found for this parking lot");
        }

        log.info("Admin Stripe Account ID: {}", admin);
        return admin;
    }

    public String handlePaymentResult(String paymentIntentId) {

        try {
            Stripe.apiKey = stripeConfig.getApiKey();
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            String chargeId = paymentIntent.getLatestCharge();
            Charge charge = Charge.retrieve(chargeId);
            String paymentStatus = paymentIntent.getStatus();

            String customerEmail = getCustomerEmail(paymentIntentId);
            Long amount = paymentIntent.getAmount();
            Double amountToAdd = amount / 100.0;
            logPaymentResult(paymentIntentId, paymentStatus, customerEmail, amountToAdd);

            return switch (paymentStatus) {
                case "succeeded" -> {
                    log.info("Payment successful");
                    emailService.sendConfirmationEmail(customerEmail);

                    CustomerListParams customerListParams = CustomerListParams.builder()
                            .setEmail(customerEmail)
                            .build();

                    List<Customer> customers = Customer.list(customerListParams).getData();
                    if (customers.isEmpty()) {
                        throw new RuntimeException("No customer found with email: " + customerEmail);
                    } else {
                        Customer customer = customers.get(0);
                        CustomerBalanceTransactionCollectionCreateParams balanceParams =
                                CustomerBalanceTransactionCollectionCreateParams.builder()
                                        .setAmount(amount)
                                        .setCurrency("ron")
                                        .setDescription("Funds added " + amountToAdd)
                                        .build();
                        CustomerBalanceTransaction balanceTransaction =
                                customer.balanceTransactions().create(balanceParams);


                        Map<String, String> metadata = new HashMap<>();
                        metadata.put("balance_transaction_id", balanceTransaction.getId());

                        ChargeUpdateParams params = ChargeUpdateParams.builder()
                                .putAllMetadata(metadata)
                                .build();

                        charge.update(params);
                    }
                    yield "success";
                }
                case "processing" -> {
                    log.info("Payment is processing");
                    yield paymentStatus;
                }
                case "requires_action" -> {
                    log.info("Payment requires action");
                    yield paymentStatus;
                }
                case "canceled" -> {
                    log.info("Payment canceled");
                    yield paymentStatus;
                }
                case "requires_capture" -> {
                    log.info("Payment requires capture");
                    yield paymentStatus;
                }
                case "requires_confirmation" -> {
                    log.info("Payment requires confirmation");
                    yield paymentStatus;
                }
                case "requires_payment_method" -> {
                    log.info("Payment requires payment method");
                    yield paymentStatus;
                }
                default -> {
                    log.info("Payment status unknown: {}", paymentStatus);
                    yield paymentStatus;
                }
            };
        } catch (StripeException e) {
            log.error("Error retrieving PaymentIntent: {}", e.getMessage());
            return "payment-error";
        }
    }

    public String getCustomerEmail(String paymentIntentId) {
        try {
            Stripe.apiKey = stripeConfig.getApiKey();
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            Customer customer = Customer.retrieve(paymentIntent.getCustomer());
            return customer.getEmail();
        } catch (StripeException e) {
            log.error("Error retrieving customer email: {}", e.getMessage());
            throw new PaymentException("Error retrieving customer email.");
        }
    }

    public void logPaymentResult(String paymentIntentId, String paymentStatus, String customerEmail, Double amount) {
        log.info("Received Payment Intent ID: {}", paymentIntentId);
        log.info("Payment intent status: {}", paymentStatus);
        log.info("Customer email: {}", customerEmail);
        log.info("Payment Amount: {}", amount);
    }



    public Double retrieveCustomerBalance(String customerEmail) {
        Stripe.apiKey = stripeConfig.getApiKey();
        try {
            CustomerListParams params = CustomerListParams.builder()
                    .setEmail(customerEmail)
                    .build();

            List<Customer> customers = Customer.list(params).getData();
            if (customers.isEmpty()) {
                throw new RuntimeException("No customer found with email: " + customerEmail);
            } else {
                Customer customer = customers.get(0);
                return customer.getBalance() / 100.0;
            }
        } catch (StripeException e) {
            throw new RuntimeException("Error retrieving customer balance from Stripe", e);
        }
    }

    public List<TransactionDTO> getTransactionsHistory(String customerEmail) {
        Stripe.apiKey = stripeConfig.getApiKey();

        try {
            CustomerListParams customerListParams = CustomerListParams.builder()
                    .setEmail(customerEmail)
                    .build();

            List<Customer> customers = Customer.list(customerListParams).getData();
            if (customers.isEmpty()) {
                throw new RuntimeException("No customer found with email: " + customerEmail);
            } else {
                Customer customer = customers.get(0);
                CustomerBalanceTransactionsParams params =
                        CustomerBalanceTransactionsParams.builder().build();

                CustomerBalanceTransactionCollection balanceTransactionCollection = customer.balanceTransactions(params);
                List<CustomerBalanceTransaction> balanceTransactions =
                        balanceTransactionCollection.getData();

                ChargeListParams chargeParams = ChargeListParams.builder()
                        .setCustomer(customer.getId())
                        .build();
                ChargeCollection chargeCollection = Charge.list(chargeParams);
                List<Charge> charges = chargeCollection.getData();
                List<TransactionDTO> allTransactions = new ArrayList<>();

                for (CustomerBalanceTransaction transaction : balanceTransactions) {
                    TransactionDTO transactionDTO = new TransactionDTO();
                    transactionDTO.setId(transaction.getId());
                    transactionDTO.setObject(transaction.getObject());
                    transactionDTO.setAmount(transaction.getAmount()/100.0);
                    transactionDTO.setCurrency(transaction.getCurrency());
                    transactionDTO.setDescription(transaction.getType() + " transaction");
                    transactionDTO.setCreatedFromTimestamp(transaction.getCreated());
                    transactionDTO.setStatus("succeeded");
                    allTransactions.add(transactionDTO);
                }
                for (Charge charge : charges) {
                    TransactionDTO transactionDTO = new TransactionDTO();
                    transactionDTO.setId(charge.getId());
                    transactionDTO.setObject(charge.getObject());
                    transactionDTO.setAmount(charge.getAmount() / 100.0);
                    transactionDTO.setCurrency(charge.getCurrency());
                    if(charge.getDescription() == null) transactionDTO.setDescription("charge transaction");
                    else transactionDTO.setDescription(charge.getDescription());
                    transactionDTO.setCreatedFromTimestamp(charge.getCreated());
                    transactionDTO.setStatus(charge.getStatus());
                    allTransactions.add(transactionDTO);
                }


                allTransactions.sort(Comparator.comparing(TransactionDTO::getCreated).reversed());
                return allTransactions;
            }
        } catch (StripeException e) {
            throw new RuntimeException("Error retrieving customer transactions from Stripe", e);
        }
    }

    public String refundPayment(RefundRequest refundRequest) {
        TransactionDTO transactionDTO = refundRequest.getTransactionDTO();
        String userEmail = refundRequest.getEmail();

        if(transactionDTO.getObject().equals("charge"))
            return createCardPaymentRefund(transactionDTO.getId(), userEmail);
        else if (transactionDTO.getObject().equals("customer_balance_transaction"))
            return refundCustomerBalanceTransaction(transactionDTO.getId(), userEmail);

        return "error refunding";
    }

    public String createCardPaymentRefund(String chargeId, String userEmail) {
        Stripe.apiKey = stripeConfig.getApiKey();

        try {
            Charge charge;
            try {
                charge = Charge.retrieve(chargeId);
            } catch (InvalidRequestException e) {
                if (e.getStripeError().getCode().equals("resource_missing")) {
                    return "The charge with the specified ID does not exist.";
                } else {
                    throw e;
                }
            }

            if ("refunded".equals(charge.getDescription())) {
                return "This charge has already been refunded.";
            }

            String balanceTransactionId = charge.getMetadata().get("balance_transaction_id");
            if (balanceTransactionId == null || balanceTransactionId.trim().isEmpty()) {
                return "Invalid balance transaction ID.";
            }

            String response = refundCustomerBalanceTransaction(balanceTransactionId, userEmail);

            if("success".equals(response)){

                RefundCreateParams refundParams = RefundCreateParams.builder()
                        .setCharge(chargeId)
                        .build();
                Refund refund = Refund.create(refundParams);

                ChargeUpdateParams updateParams = ChargeUpdateParams.builder()
                        .setDescription("refunded")
                        .build();
                charge.update(updateParams);

                if (refund.getStatus().equals("succeeded"))
                    return "success";
                else return refund.getStatus();
            } else return "Error refunding the associated balance transaction: " + response;
        } catch (StripeException e) {
            throw new PaymentException(e.getMessage());
        }
    }

    public String refundCustomerBalanceTransaction(String transactionId, String userEmail) {
        Stripe.apiKey = stripeConfig.getApiKey();

        try {
            if (transactionId == null || transactionId.trim().isEmpty()) {
                return "Invalid transaction ID.";
            }
            CustomerListParams customerListParams = CustomerListParams.builder()
                    .setEmail(userEmail)
                    .build();

            List<Customer> customers = Customer.list(customerListParams).getData();
            if (customers.isEmpty()) {
                return "No customer found with email: " + userEmail;
            }

            Customer customer = customers.get(0);
            CustomerBalanceTransactionCollection balanceTransactions =
                    customer.balanceTransactions().list(CustomerBalanceTransactionCollectionListParams.builder().build());

            for (CustomerBalanceTransaction txn : balanceTransactions.getData()) {
                if (txn.getDescription() != null && txn.getDescription().contains("Refund for transaction: " + transactionId)) {
                    return "A refund has already been issued for this transaction.";
                }
            }


            CustomerBalanceTransaction transaction;
            try {
                transaction = customer.balanceTransactions().retrieve(transactionId);
                if(transaction.getDescription().contains("Refund for transaction:"))
                    return "This transaction is a refund.";
            } catch (InvalidRequestException e) {
                if (e.getStripeError().getCode().equals("resource_missing")) {
                    return "The balance transaction with the specified ID does not exist.";
                } else {
                    throw e;
                }
            }


            // Create the refund transaction
            CustomerBalanceTransactionCollectionCreateParams params =
                    CustomerBalanceTransactionCollectionCreateParams.builder()
                            .setAmount((long)(transaction.getAmount() * -1.0))
                            .setCurrency(transaction.getCurrency())
                            .setDescription("Refund for transaction: " + transactionId)
                            .build();

            CustomerBalanceTransaction refundTransaction = customer.balanceTransactions().create(params);
            return "success";

        } catch (StripeException e) {
            return "Error refunding customer balance transaction: " + e.getMessage();
        }
    }

    /*
    public String payForParkingSpot(PaymentDetailsDTO paymentDetailsDTO) {
        Stripe.apiKey = stripeConfig.getApiKey();

        try {
            String stripeAccountId = getAdminStripeAccountIdByParkingSpotId(paymentDetailsDTO.getParkingSpotId());
            if (stripeAccountId == null || stripeAccountId.isEmpty()) {
                return "The payment cannot be processed because the administrator has not set up a Stripe account.";
            }

            CustomerListParams customerListParams = CustomerListParams.builder()
                    .setEmail(paymentDetailsDTO.getEmail())
                    .build();

            List<Customer> customers = Customer.list(customerListParams).getData();
            if (customers.isEmpty()) {
                throw new RuntimeException("No customer found with email: " + paymentDetailsDTO.getEmail());
            } else {
                Customer customer = customers.get(0);
                Double currentBalance = customer.getBalance() / 100.0;

                if ((currentBalance - paymentDetailsDTO.getAmount()) < 0) {
                    return "insufficient-balance";
                } else {
                    CustomerBalanceTransactionCollectionCreateParams params =
                            CustomerBalanceTransactionCollectionCreateParams.builder()
                                    .setAmount((long) (paymentDetailsDTO.getAmount() * -100)) // Negative to decrease
                                    .setCurrency("ron")
                                    .setDescription("Payment for parking spot")
                                    .build();

                    CustomerBalanceTransaction transaction =
                            customer.balanceTransactions().create(params);
                    return "success";
                }
            }
        } catch (StripeException e) {
            throw new RuntimeException("Error creating customer balance transaction for parking spot", e);
        }
    }
    */

    public String payForParkingSpot(PaymentDetailsDTO paymentDetailsDTO) {
        Stripe.apiKey = stripeConfig.getApiKey();

        try {
            String stripeAccountId = getAdminStripeAccountIdByParkingSpotId(paymentDetailsDTO.getParkingSpotId());
            if (stripeAccountId == null || stripeAccountId.isEmpty()) {
                log.error("Admin Stripe account ID not found or empty for parking spot ID: {}", paymentDetailsDTO.getParkingSpotId());
                return "The payment cannot be processed because the administrator has not set up a Stripe account.";
            }

            CustomerListParams customerListParams = CustomerListParams.builder()
                    .setEmail(paymentDetailsDTO.getEmail())
                    .build();
            List<Customer> customers = Customer.list(customerListParams).getData();
            if (customers.isEmpty()) {
                log.error("No customer found with email: {}", paymentDetailsDTO.getEmail());
                return "No customer found with the provided email.";
            }
            Customer customer = customers.get(0);
            Double currentBalance = customer.getBalance() / 100.0;

            if ((currentBalance - paymentDetailsDTO.getAmount()) < 0) {
                log.warn("Insufficient balance for customer: {}", customer.getId());
                return "insufficient-balance";
            }

            CustomerBalanceTransactionCollectionCreateParams balanceParams =
                    CustomerBalanceTransactionCollectionCreateParams.builder()
                            .setAmount((long) (paymentDetailsDTO.getAmount() * -100)) // Negative to decrease
                            .setCurrency("ron")
                            .setDescription("Payment for parking spot")
                            .build();
            CustomerBalanceTransaction balanceTransaction =
                    customer.balanceTransactions().create(balanceParams);

            TransferCreateParams transferParams = TransferCreateParams.builder()
                    .setAmount((long) (paymentDetailsDTO.getAmount() * 100))
                    .setCurrency("ron")
                    .setDestination(stripeAccountId)
                    .build();
            Transfer transfer = Transfer.create(transferParams);
            log.info("Transfer created: {}", transfer.getId());

            return "success";
        } catch (StripeException ex) {
            throw new RuntimeException(ex);
        }
    }



    public ResponseEntity<?> createStripeAccount(CreateAccountRequest request) {
        User user = userService.getUserByEmail(request.getEmail());


        if(user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("User not found");

        }

        if (!user.getStripeAccountId().equals("")) {
            return ResponseEntity.ok(new CreateAccountLinkRequest(user.getStripeAccountId()));
        }
        else {
            try {
                AccountCreateParams accountParams = AccountCreateParams.builder()
                        .setType(AccountCreateParams.Type.EXPRESS)
                        .setEmail(request.getEmail())
                        .build();
                Account account = Account.create(accountParams);

                user.setStripeAccountId(account.getId());
                userService.saveUser(user);


                return ResponseEntity.ok(new CreateAccountLinkRequest(account.getId()));
            } catch (Exception e) {
                log.error("Failed to create account: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to create account");
            }
        }
    }

    public ResponseEntity<?> createStripeAccountLink(CreateAccountLinkRequest request) {
        try {
            AccountLinkCreateParams linkParams = AccountLinkCreateParams.builder()
                    .setAccount(request.getAccountId())
                    .setRefreshUrl("http://localhost:8081/user/create-stripe-account")
                    .setReturnUrl("http://localhost:8081/user/return?accountId=" + request.getAccountId())
                    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                    .build();
            AccountLink accountLink = AccountLink.create(linkParams);

            return ResponseEntity.ok(new CreateAccountLinkResponse(accountLink.getUrl()));
        } catch (Exception e) {
            log.error("Failed to create account link: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create account link");
        }
    }

    public ResponseEntity<?> handleStripeReturn(String accountId) {
        try {
            Account account = Account.retrieve(accountId);
            String email = account.getEmail();
            User user = userService.getUserByEmail(email);
            System.out.println("stripe account id in the return function: " + user.getStripeAccountId());

            if (!account.getChargesEnabled()) {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header("Location", "http://localhost:8081/user/create-stripe-account")
                        .build();
            } else {
                //Save the stripe account id in the user database
                userService.updateStripeAccountId(email, accountId);
                LoginLinkCreateOnAccountParams params =
                        LoginLinkCreateOnAccountParams.builder().build();
                LoginLink loginLink = LoginLink.createOnAccount(accountId, params);
                String dashboardUrl = loginLink.getUrl();
                log.info(userService.getUserInfoByEmail(email));
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header("Location", dashboardUrl)
                        .build();
            }
        } catch (Exception e) {
            log.error("Failed to retrieve account details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve account details");
        }
    }

    public static class CreateAccountRequest {
        private String email;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    public static class CreateAccountLinkRequest {
        private String accountId;

        public CreateAccountLinkRequest() {
        }

        public CreateAccountLinkRequest(String accountId) {
            this.accountId = accountId;
        }

        public String getAccountId() {
            return accountId;
        }

        public void setAccountId(String accountId) {
            this.accountId = accountId;
        }
    }

    public static class CreateAccountLinkResponse {
        private String url;

        public CreateAccountLinkResponse(String url) {
            this.url = url;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}