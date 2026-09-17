"use strict";

const form = document.querySelector("#registration-form");
const formView = document.querySelector("#form-view");
const summaryView = document.querySelector("#summary-view");
const summaryList = document.querySelector("#summary-list");
const formMessage = document.querySelector("#form-message");
const editButton = document.querySelector("#edit-button");

const fields = {
    login: document.querySelector("#login"),
    password: document.querySelector("#password"),
    passwordConfirmation: document.querySelector("#password-confirmation"),
    lastName: document.querySelector("#last-name"),
    firstName: document.querySelector("#first-name"),
    address: document.querySelector("#address"),
    email: document.querySelector("#email"),
    phone: document.querySelector("#phone"),
    birthDate: document.querySelector("#birth-date")
};

const errorElements = {
    login: document.querySelector("#login-error"),
    password: document.querySelector("#password-error"),
    passwordConfirmation: document.querySelector("#password-confirmation-error"),
    lastName: document.querySelector("#last-name-error"),
    firstName: document.querySelector("#first-name-error"),
    address: document.querySelector("#address-error"),
    email: document.querySelector("#email-error"),
    phone: document.querySelector("#phone-error"),
    birthDate: document.querySelector("#birth-date-error")
};

const requiredMessages = {
    login: "Veuillez saisir un login.",
    password: "Veuillez saisir un mot de passe.",
    passwordConfirmation: "Veuillez confirmer votre mot de passe.",
    lastName: "Veuillez saisir votre nom.",
    firstName: "Veuillez saisir votre prénom.",
    address: "Veuillez saisir votre adresse.",
    email: "Veuillez saisir votre adresse email.",
    phone: "Veuillez saisir votre numéro de téléphone.",
    birthDate: "Veuillez saisir votre date de naissance."
};

const summaryLabels = {
    login: "Login",
    lastName: "Nom",
    firstName: "Prénom",
    address: "Adresse",
    email: "Email",
    phone: "Téléphone",
    birthDate: "Date de naissance"
};

function setFieldError(fieldName, message) {
    const field = fields[fieldName];
    const errorElement = errorElements[fieldName];

    errorElement.textContent = message;

    if (message) {
        field.setAttribute("aria-invalid", "true");
        field.setAttribute("aria-describedby", errorElement.id);
    } else {
        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
    }
}

function validateField(fieldName) {
    const field = fields[fieldName];
    const value = field.value.trim();
    let message = "";

    if (!value) {
        message = requiredMessages[fieldName];
    } else if (fieldName === "email" && !field.validity.valid) {
        message = "Veuillez saisir une adresse email valide (exemple@domaine.fr).";
    } else if (
        fieldName === "passwordConfirmation" &&
        field.value !== fields.password.value
    ) {
        message = "Les deux mots de passe ne correspondent pas.";
    }

    setFieldError(fieldName, message);
    return message === "";
}

function clearAllErrors() {
    Object.keys(fields).forEach((fieldName) => setFieldError(fieldName, ""));
    formMessage.hidden = true;
    formMessage.textContent = "";
}

function formatBirthDate(value) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
}

function addSummaryItem(label, value, isWide = false) {
    const item = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");

    item.className = isWide ? "summary-item summary-item-wide" : "summary-item";
    term.textContent = label;
    description.textContent = value;
    item.append(term, description);
    summaryList.append(item);
}

function showSummary() {
    const values = {
        login: fields.login.value.trim(),
        lastName: fields.lastName.value.trim(),
        firstName: fields.firstName.value.trim(),
        address: fields.address.value.trim(),
        email: fields.email.value.trim(),
        phone: fields.phone.value.trim(),
        birthDate: formatBirthDate(fields.birthDate.value)
    };

    summaryList.replaceChildren();
    document.querySelector("#summary-first-name").textContent = values.firstName;

    Object.entries(values).forEach(([fieldName, value]) => {
        addSummaryItem(summaryLabels[fieldName], value, fieldName === "address");
    });

    formView.hidden = true;
    summaryView.hidden = false;
    document.querySelector("#summary-title").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAllErrors();

    const invalidFields = Object.keys(fields).filter((fieldName) => !validateField(fieldName));

    if (invalidFields.length > 0) {
        formMessage.textContent = "Le formulaire contient une ou plusieurs erreurs. Merci de vérifier les champs indiqués.";
        formMessage.hidden = false;
        fields[invalidFields[0]].focus();
        return;
    }

    showSummary();
});

Object.entries(fields).forEach(([fieldName, field]) => {
    field.addEventListener("blur", () => validateField(fieldName));

    field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") {
            validateField(fieldName);
        }

        if (
            fieldName === "password" &&
            fields.passwordConfirmation.value &&
            fields.passwordConfirmation.getAttribute("aria-invalid") === "true"
        ) {
            validateField("passwordConfirmation");
        }
    });
});

editButton.addEventListener("click", () => {
    summaryView.hidden = true;
    formView.hidden = false;
    clearAllErrors();
    fields.login.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
});
