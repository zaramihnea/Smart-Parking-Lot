const stripe = Stripe("pk_test_51P2f1mFMoAFG0pvpxbY5z2isuPG1wWMlaDGP3Vx21ryOCVO8vNtjM0nKoM9ipyrfWHQa099Xr3Mpa4NJYC23ptyl00YVARcNGn");

let elements;

document
    .querySelector("#payment-form")
    .addEventListener("submit", handleSubmit);

// Initialize Stripe elements with the client secret from the paymentResponseDTO
function initialize(clientSecret) {
    const appearance = { theme: 'stripe' };
    elements = stripe.elements({ appearance, clientSecret });
    const paymentElementOptions = { layout: "tabs" };
    const paymentElement = elements.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");
}

async function fetchAndInitialize() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const amount = parseFloat(urlParams.get('amount'));

        if (!email || isNaN(amount)) {
            throw new Error("Missing or invalid email or amount in URL");
        }

        document.querySelector("#button-text").textContent = `Pay now (${amount.toFixed(2)} RON)`;

        const paymentDetails = {
            email: email,
            amount: amount
        };
        const response = await fetch('/user/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentDetails) // Convert the PaymentDetailsDTO object to a JSON string
        });
        const paymentResponseDTO = await response.json();
        if (paymentResponseDTO.clientSecret) {
            initialize(paymentResponseDTO.clientSecret);
        } else {
            console.error('Client secret not found');
        }
    } catch (error) {
        console.error('Error fetching payment intent:', error);
        showMessage('Error fetching payment intent. Please try again later.');
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetchAndInitialize();
});

// Handle the form submission and process the payment
async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let paymentIntentId;

    const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            //if payment was successful it redirects here
            return_url: `http://localhost:8081/user/after-payment-processing`,
        },
    });

    if (error) {
        showMessage(error.message);
        setLoading(false);
    } else {
        // If no error, send the payment status and payment intent ID to the backend
        const paymentIntentId = paymentIntent.id;
        const response = await fetch(`http://localhost:8081/user/after-payment-processing`);
        setLoading(false);
    }
}


// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
    }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}