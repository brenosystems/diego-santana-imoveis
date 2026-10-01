const header = document.getElementById("header");
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});


menuButton.addEventListener("click", () => {
    nav.classList.toggle("active");
});


document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
    });
});


const formSteps = document.querySelectorAll(".form-step");
const progressBar = document.getElementById("progressBar");

let currentStep = 1;
let fgtsOption = "nao";
let firstHomeOption = "sim";


function showStep(step) {

    formSteps.forEach(formStep => {
        formStep.classList.remove("active");
    });

    const selectedStep = document.querySelector(
        `.form-step[data-step="${step}"]`
    );

    if (selectedStep) {
        selectedStep.classList.add("active");
    }

    currentStep = step;

    progressBar.style.width = `${step * 25}%`;

    if (step === 4) {
        calculateQualification();
    }
}


document.querySelectorAll(".form-next").forEach(button => {

    button.addEventListener("click", () => {

        const nextStep = Number(button.dataset.next);

        if (currentStep === 1) {

            const income = Number(
                document.getElementById("income").value
            );

            if (!income || income <= 0) {
                alert("Informe sua renda mensal para continuar.");
                return;
            }
        }

        if (currentStep === 2) {

            const entry = Number(
                document.getElementById("entry").value
            );

            if (entry < 0) {
                alert("Informe um valor válido para a entrada.");
                return;
            }
        }

        showStep(nextStep);

    });

});


document.querySelectorAll("[data-fgts]").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll("[data-fgts]")
            .forEach(item => item.classList.remove("selected"));

        button.classList.add("selected");

        fgtsOption = button.dataset.fgts;

        const fgtsValue = document.getElementById("fgtsValue");

        if (fgtsOption === "sim") {
            fgtsValue.classList.add("show");
        } else {
            fgtsValue.classList.remove("show");
        }

    });

});


document.querySelectorAll("[data-first]").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll("[data-first]")
            .forEach(item => item.classList.remove("selected"));

        button.classList.add("selected");

        firstHomeOption = button.dataset.first;

        calculateQualification();

    });

});


function calculateQualification() {

    const income = Number(
        document.getElementById("income").value
    ) || 0;

    const entry = Number(
        document.getElementById("entry").value
    ) || 0;

    const fgts = fgtsOption === "sim"
        ? Number(document.getElementById("fgts").value) || 0
        : 0;

    const resources = entry + fgts;

    const estimatedFinancing = income * 60;

    const estimatedProperty =
        estimatedFinancing + resources;

    const minimumValue = 150000;

    const finalValue = Math.max(
        estimatedProperty,
        minimumValue
    );

    document.getElementById("estimatedValue").textContent =
        formatCurrency(finalValue);

}


function formatCurrency(value) {

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0
    }).format(value);

}


document
    .getElementById("qualificationFinish")
    .addEventListener("click", () => {

        const income = document.getElementById("income").value;
        const entry = document.getElementById("entry").value;
        const fgts = document.getElementById("fgts").value || "0";

        const estimated =
            document.getElementById("estimatedValue").textContent;

        const message =
            `Olá Diego! Fiz a pré-análise no seu site.%0A%0A` +
            `Renda familiar: R$ ${income}%0A` +
            `Entrada: R$ ${entry}%0A` +
            `FGTS: R$ ${fgts}%0A` +
            `Primeiro imóvel: ${firstHomeOption === "sim" ? "Sim" : "Não"}%0A` +
            `Estimativa inicial: ${estimated}%0A%0A` +
            `Gostaria de conversar sobre as opções.`;

        openWhatsApp(message);

    });


const propertyForm =
    document.getElementById("propertyForm");


propertyForm.addEventListener("submit", event => {

    event.preventDefault();

    const name =
        document.getElementById("clientName").value;

    const phone =
        document.getElementById("clientPhone").value;

    const value =
        document.getElementById("propertyValue").value;

    const region =
        document.getElementById("region").value;

    const type =
        document.getElementById("propertyType").value;

    const bedrooms =
        document.getElementById("bedrooms").value;

    const parking =
        document.getElementById("parking").value;

    const condo =
        document.getElementById("condo").value;

    const preferences =
        document.getElementById("preferences").value;


    const message =
        `Olá Diego! Meu nome é ${name}.%0A%0A` +
        `Gostaria de encontrar um imóvel.%0A%0A` +
        `WhatsApp: ${phone}%0A` +
        `Valor máximo: R$ ${value || "Não informado"}%0A` +
        `Região: ${region || "Não informada"}%0A` +
        `Tipo: ${type || "Não informado"}%0A` +
        `Quartos: ${bedrooms || "Não informado"}%0A` +
        `Vaga: ${parking || "Não informado"}%0A` +
        `Condomínio máximo: R$ ${condo || "Não informado"}%0A` +
        `Preferências: ${preferences || "Não informadas"}`;


    openWhatsApp(message);

});


function openWhatsApp(message) {

    const whatsappNumber = "5511999999999";

    const url =
        `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(url, "_blank");

}


const calcProperty =
    document.getElementById("calcProperty");

const calcEntry =
    document.getElementById("calcEntry");

const calcFgts =
    document.getElementById("calcFgts");


function updateCalculator() {

    const property =
        Number(calcProperty.value) || 0;

    const entry =
        Number(calcEntry.value) || 0;

    const fgts =
        Number(calcFgts.value) || 0;

    const resources =
        entry + fgts;

    const financing =
        Math.max(property - resources, 0);


    document.getElementById("financingResult").textContent =
        formatCurrency(financing);

    document.getElementById("resultProperty").textContent =
        formatCurrency(property);

    document.getElementById("resultResources").textContent =
        formatCurrency(resources);

}


[calcProperty, calcEntry, calcFgts].forEach(input => {

    input.addEventListener("input", updateCalculator);

});


updateCalculator();


document
    .getElementById("calcWhatsapp")
    .addEventListener("click", () => {

        const property =
            Number(calcProperty.value) || 0;

        const entry =
            Number(calcEntry.value) || 0;

        const fgts =
            Number(calcFgts.value) || 0;

        const financing =
            Math.max(property - entry - fgts, 0);


        const message =
            `Olá Diego! Fiz uma simulação no seu site.%0A%0A` +
            `Valor do imóvel: ${formatCurrency(property)}%0A` +
            `Entrada: ${formatCurrency(entry)}%0A` +
            `FGTS: ${formatCurrency(fgts)}%0A` +
            `Valor aproximado a financiar: ${formatCurrency(financing)}%0A%0A` +
            `Gostaria de entender melhor minhas possibilidades.`;

        openWhatsApp(message);

    });