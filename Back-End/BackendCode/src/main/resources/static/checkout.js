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
        const paymentDetails = {
            userEmail: 'amihaesiisimona5@gmail.com',
            price: 1000
        };
        const response = await fetch('/', {
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
            return_url: `http://localhost:8081/after-payment-processing?payment_intent=${paymentIntentId}`,
        },
    });

    if (error) {
        showMessage(error.message);
        setLoading(false);
    } else {
        // If no error, send the payment status and payment intent ID to the backend
        const paymentIntentId = paymentIntent.id;
        const response = await fetch(`http://localhost:8081/after-payment-processing?payment_intent=${paymentIntentId}`);
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