let connectedAccountId = null;

const signUpButton = document.getElementById("sign-up-button");
signUpButton.onclick = async () => {
    document.getElementById("dev-callout").classList.remove("hidden");
    document.getElementById("creating-connected-account").classList.remove("hidden");
    document.getElementById("error").classList.add("hidden");
    document.getElementById("sign-up-button").classList.add("hidden");

    const email = document.getElementById("email-input").value;  // Get email from input

    if (!email) {
        document.getElementById("error").classList.remove("hidden");
        document.getElementById("error").innerText = "Please enter a valid email address.";
        document.getElementById("sign-up-button").classList.remove("hidden");
        document.getElementById("creating-connected-account").classList.add("hidden");
        document.getElementById("dev-callout").classList.add("hidden");
        return;
    }

    fetch("/user/create-stripe-account", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
        }),
    })
        .then((response) => response.json())
        .then((json) => {
            const { accountId, error } = json;

            if (error) {
                document.getElementById("error").classList.remove("hidden");
                document.getElementById("sign-up-button").classList.remove("hidden");
                document.getElementById("creating-connected-account").classList.add("hidden");
                document.getElementById("dev-callout").classList.add("hidden");
                return;
            }

            connectedAccountId = accountId;

            const connectedAccountIdElement = document.getElementById("connected-account-id");
            connectedAccountIdElement.innerHTML = `Your connected account ID is: <code class="bold">${connectedAccountId}</code>`;
            connectedAccountIdElement.classList.remove("hidden");

            document.getElementById("add-information-button").classList.remove("hidden");
            document.getElementById("creating-connected-account").classList.add("hidden");
            document.getElementById("title").classList.add("hidden");
            document.getElementById("add-information-title").classList.remove("hidden");
            document.getElementById("add-information-subtitle").classList.remove("hidden");
        });
};

const createAccountLinkAndRedirect = async () => {
    document.getElementById("adding-onboarding-information").classList.remove("hidden");
    document.getElementById("error").classList.add("hidden");
    document.getElementById("add-information-button").classList.add("hidden");

    fetch("/user/create-account-link", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            accountId: connectedAccountId,
        }),
    })
        .then((response) => response.json())
        .then((json) => {
            const { url, error } = json;

            if (error) {
                document.getElementById("error").classList.remove("hidden");
                document.getElementById("add-information-button").classList.remove("hidden");
                return;
            }

            document.getElementById("adding-onboarding-information").classList.add("hidden");
            window.location.href = url;
        });
};

const addInformationButton = document.getElementById("add-information-button");
addInformationButton.onclick = createAccountLinkAndRedirect;

// Handle the return from Stripe onboarding
if (window.location.search.includes("accountId")) {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');

    if (accountId) {
        document.getElementById("title").classList.add("hidden");
        document.getElementById("sign-up-button").classList.add("hidden");
        document.getElementById("details-submitted-title").classList.remove("hidden");
        document.getElementById("details-submitted-subtitle").classList.remove("hidden");
        document.getElementById("connected-account-id").innerHTML = `Your connected account ID is: <code class="bold">${accountId}</code>`;
        document.getElementById("connected-account-id").classList.remove("hidden");
    }
}
