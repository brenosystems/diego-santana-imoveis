
"use strict";

/* =========================================
   CONFIGURAÇÕES
========================================= */

const WHATSAPP_NUMBER = "5511984777871";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const CURRENCY_OPTIONS = {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
};

/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeMenu();
    initializeSmoothScrolling();
    initializePhoneInputs();
    initializeCurrencyInputs();
    initializeQualification();
    initializePropertyForm();
    initializeListingForm();
    initializeCalculator();
    initializeWhatsAppLinks();
});

/* =========================================
   FUNÇÕES GERAIS
========================================= */

function openWhatsApp(message) {
    const url = message
        ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
        : WHATSAPP_URL;

    window.location.href = url;
}

function getFieldValue(id) {
    const field = document.getElementById(id);

    return field ? field.value.trim() : "";
}

function formatBRL(value) {
    return Number(value || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function currencyToNumber(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    const digits = String(value || "").replace(/\D/g, "");

    if (!digits) return 0;

    return Number(digits) / 100;
}

function showError(message) {
    alert(message);
}

function normalizeText(value) {
    return String(value || "")
        .trim()
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

/* =========================================
   MENU MOBILE
========================================= */

function initializeMenu() {
    const menuButton = document.getElementById("menuButton");
    const navigation = document.getElementById("nav");

    if (!menuButton || !navigation) return;

    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("active");

        menuButton.classList.toggle("active", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("active");
            menuButton.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}

/* =========================================
   ROLAGEM SUAVE
========================================= */

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}

/* =========================================
   FORMATAÇÃO DE TELEFONE
========================================= */

function formatPhone(value) {
    const digits = String(value).replace(/\D/g, "").slice(0, 11);

    if (!digits) return "";

    if (digits.length <= 2) {
        return `(${digits}`;
    }

    if (digits.length <= 6) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function initializePhoneInputs() {
    const phoneInputs = document.querySelectorAll(
        "#listingPhone, #clientPhone, input[type='tel']"
    );

    phoneInputs.forEach((input) => {
        input.addEventListener("input", () => {
            input.value = formatPhone(input.value);
        });
    });
}

/* =========================================
   FORMATAÇÃO DE MOEDA
========================================= */

function formatCurrencyInput(value) {
    const digits = String(value).replace(/\D/g, "");

    if (!digits) return "";

    const number = Number(digits) / 100;

    return number.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function initializeCurrencyInputs() {
    const currencyInputs = document.querySelectorAll(
        "#income, " +
        "#entry, " +
        "#fgts, " +
        "#propertyValue, " +
        "#condo, " +
        "#listingPrice, " +
        "#calcProperty, " +
        "#calcEntry, " +
        "#calcFgts"
    );

    currencyInputs.forEach((input) => {
        input.setAttribute("inputmode", "numeric");
        input.setAttribute("autocomplete", "off");

        input.addEventListener("input", () => {
            input.value = formatCurrencyInput(input.value);

            if (
                input.id === "calcProperty" ||
                input.id === "calcEntry" ||
                input.id === "calcFgts"
            ) {
                updateCalculator();
            }
        });
    });
}

/* =========================================
   1. PRÉ-ANÁLISE DE COMPRA
========================================= */

function initializeQualification() {
    const steps = document.querySelectorAll(".form-step");
    const nextButtons = document.querySelectorAll(".form-next");
    const progressBar = document.getElementById("progressBar");

    const fgtsButtons = document.querySelectorAll("[data-fgts]");
    const firstHomeButtons = document.querySelectorAll(".first-home");

    const fgtsContainer = document.getElementById("fgtsValue");
    const estimatedValue = document.getElementById("estimatedValue");

    const finishButton = document.getElementById("qualificationFinish");

    if (!steps.length) return;

    let currentStep = 1;
    let selectedFgts = "";
    let selectedFirstHome = "";

    function showStep(stepNumber) {
        currentStep = stepNumber;

        steps.forEach((step) => {
            step.classList.toggle(
                "active",
                Number(step.dataset.step) === stepNumber
            );
        });

        if (progressBar) {
            const progress = (stepNumber / steps.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    function validateStep(stepNumber) {
        if (stepNumber === 1) {
            const income = currencyToNumber(getFieldValue("income"));

            if (income <= 0) {
                showError("Informe sua renda familiar mensal.");
                return false;
            }
        }

        if (stepNumber === 2) {
            const entry = currencyToNumber(getFieldValue("entry"));

            if (entry < 0) {
                showError("Informe um valor válido para sua entrada.");
                return false;
            }
        }

        if (stepNumber === 3) {
            if (!selectedFgts) {
                showError("Selecione uma das opções sobre o FGTS.");
                return false;
            }

            if (selectedFgts === "sim") {
                const fgts = currencyToNumber(getFieldValue("fgts"));

                if (fgts < 0) {
                    showError("Informe um valor válido para o FGTS.");
                    return false;
                }
            }
        }

        return true;
    }

    nextButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (!validateStep(currentStep)) return;

            const nextStep = Number(button.dataset.next);

            if (nextStep >= 1 && nextStep <= steps.length) {
                showStep(nextStep);

                if (nextStep === 4) {
                    calculateQualification();
                }
            }
        });
    });

    fgtsButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedFgts = button.dataset.fgts;

            fgtsButtons.forEach((option) => {
                option.classList.toggle(
                    "selected",
                    option === button
                );
            });

            if (fgtsContainer) {
                fgtsContainer.classList.toggle(
                    "show",
                    selectedFgts === "sim"
                );
            }

            if (selectedFgts !== "sim") {
                const fgtsInput = document.getElementById("fgts");

                if (fgtsInput) {
                    fgtsInput.value = "";
                }
            }
        });
    });

    firstHomeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedFirstHome = button.dataset.first;

            firstHomeButtons.forEach((option) => {
                option.classList.toggle(
                    "selected",
                    option === button
                );
            });

            calculateQualification();
        });
    });

    function calculateQualification() {
        const income = currencyToNumber(getFieldValue("income"));
        const entry = currencyToNumber(getFieldValue("entry"));

        const fgts = selectedFgts === "sim"
            ? currencyToNumber(getFieldValue("fgts"))
            : 0;

        /*
         * Estimativa matemática inicial:
         * renda familiar x 27 + entrada + FGTS.
         *
         * Não representa aprovação de financiamento.
         */

        const estimate = Math.max(
            0,
            income * 27 + entry + fgts
        );

        if (estimatedValue) {
            estimatedValue.textContent = formatBRL(estimate);
        }

        return {
            income,
            entry,
            fgts,
            estimate
        };
    }

    if (finishButton) {
        finishButton.addEventListener("click", () => {
            if (!selectedFirstHome) {
                showError("Informe se este será seu primeiro imóvel.");
                return;
            }

            const result = calculateQualification();

            const firstHomeText = selectedFirstHome === "sim"
                ? "Sim"
                : "Não";

            const fgtsText = selectedFgts === "sim"
                ? formatBRL(result.fgts)
                : selectedFgts === "nao"
                    ? "Não possui"
                    : "Não sabe informar";

            const message = [
                "Olá, Diego! Fiz a pré-análise pelo seu site e gostaria de conversar sobre a compra de um imóvel.",
                "",
                `Renda familiar: ${formatBRL(result.income)}`,
                `Entrada disponível: ${formatBRL(result.entry)}`,
                `FGTS: ${fgtsText}`,
                `Primeiro imóvel: ${firstHomeText}`,
                "",
                `Estimativa inicial de compra: ${formatBRL(result.estimate)}`,
                "",
                "Gostaria de entender melhor minhas possibilidades."
            ].join("\n");

            openWhatsApp(message);
        });
    }

    showStep(1);
}

/* =========================================
   2. BUSCA DE IMÓVEIS
========================================= */

function initializePropertyForm() {
    const form = document.getElementById("propertyForm");

    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = getFieldValue("clientName");
        const phone = getFieldValue("clientPhone");

        const propertyValue = getFieldValue("propertyValue");
        const region = getFieldValue("region");
        const propertyType = getFieldValue("propertyType");
        const bedrooms = getFieldValue("bedrooms");
        const parking = getFieldValue("parking");
        const condo = getFieldValue("condo");
        const preferences = getFieldValue("preferences");

        if (!name) {
            showError("Informe seu nome.");
            return;
        }

        const phoneDigits = phone.replace(/\D/g, "");

        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
            showError("Informe um WhatsApp válido com DDD.");
            return;
        }

        const message = [
            "Olá, Diego! Preenchi o formulário do seu site e estou procurando um imóvel.",
            "",
            `Nome: ${name}`,
            `WhatsApp: ${phone}`,
            "",
            "PERFIL DE BUSCA",
            `Valor máximo: ${propertyValue ? `R$ ${propertyValue}` : "Não informado"}`,
            `Região: ${region || "Não informada"}`,
            `Tipo de imóvel: ${propertyType || "Não informado"}`,
            `Quartos: ${bedrooms || "Não informado"}`,
            `Vaga de garagem: ${parking || "Não informado"}`,
            `Condomínio máximo: ${condo ? `R$ ${condo}` : "Não informado"}`,
            `Preferências: ${preferences || "Não informado"}`,
            "",
            "Gostaria de receber opções de imóveis de acordo com esse perfil."
        ].join("\n");

        openWhatsApp(message);
    });
}

/* =========================================
   3. ANUNCIAR IMÓVEL
========================================= */

function initializeListingForm() {
    const form = document.getElementById("listingForm");

    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = getFieldValue("listingName");
        const phone = getFieldValue("listingPhone");
        const goal = getFieldValue("listingGoal");
        const type = getFieldValue("listingType");
        const location = getFieldValue("listingLocation");
        const price = getFieldValue("listingPrice");
        const details = getFieldValue("listingDetails");

        if (!name || !phone || !goal || !type || !location) {
            showListingError(
                "Preencha seu nome, WhatsApp, finalidade, tipo de imóvel e localização."
            );
            return;
        }

        const phoneDigits = phone.replace(/\D/g, "");

        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
            showListingError(
                "Informe um número de WhatsApp válido com DDD."
            );
            return;
        }

        const normalizedGoal = normalizeGoal(goal);

        const message = [
            "Olá, Diego! Gostaria de anunciar um imóvel pelo seu site.",
            "",
            `Nome: ${name}`,
            `WhatsApp: ${phone}`,
            `Finalidade: ${normalizedGoal}`,
            `Tipo de imóvel: ${type}`,
            `Localização: ${location}`,
            price ? `Valor pretendido: R$ ${price}` : "",
            details ? `Detalhes do imóvel: ${details}` : "",
            "",
            "Vou anexar as fotos e os vídeos diretamente nesta conversa do WhatsApp.",
            "",
            "Aguardo seu contato. Obrigado!"
        ].filter(Boolean).join("\n");

        openWhatsApp(message);
    });
}

function normalizeGoal(value) {
    const goal = normalizeText(value);

    if (goal.includes("vender") && goal.includes("alugar")) {
        return "Vender ou alugar";
    }

    if (goal.includes("vender") || goal === "venda") {
        return "Vender";
    }

    if (goal.includes("alugar") || goal === "aluguel") {
        return "Alugar";
    }

    return value;
}

function showListingError(message) {
    const errorElement = document.getElementById("listingError");

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.hidden = false;
        errorElement.style.display = "block";

        errorElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    } else {
        showError(message);
    }
}

/* =========================================
   4. SIMULADOR DE FINANCIAMENTO
========================================= */

function initializeCalculator() {
    const propertyInput = document.getElementById("calcProperty");
    const entryInput = document.getElementById("calcEntry");
    const fgtsInput = document.getElementById("calcFgts");

    const whatsappButton = document.getElementById("calcWhatsapp");

    if (!propertyInput || !entryInput || !fgtsInput) return;

    function calculateValues() {
        const propertyValue = currencyToNumber(propertyInput.value);
        const entry = currencyToNumber(entryInput.value);
        const fgts = currencyToNumber(fgtsInput.value);

        const resources = entry + fgts;
        const amountToFinance = Math.max(0, propertyValue - resources);

        return {
            propertyValue,
            entry,
            fgts,
            resources,
            amountToFinance
        };
    }

    window.updateCalculator = function () {
        const result = calculateValues();

        const financingResult = document.getElementById("financingResult");
        const resultProperty = document.getElementById("resultProperty");
        const resultResources = document.getElementById("resultResources");

        if (financingResult) {
            financingResult.textContent = formatBRL(result.amountToFinance);
        }

        if (resultProperty) {
            resultProperty.textContent = formatBRL(result.propertyValue);
        }

        if (resultResources) {
            resultResources.textContent = formatBRL(result.resources);
        }

        return result;
    };

    if (whatsappButton) {
        whatsappButton.addEventListener("click", () => {
            const result = window.updateCalculator();

            if (result.propertyValue <= 0) {
                showError("Informe o valor do imóvel para fazer a simulação.");
                propertyInput.focus();
                return;
            }

            if (
                result.entry < 0 ||
                result.fgts < 0 ||
                result.resources > result.propertyValue
            ) {
                showError(
                    "Confira os valores informados. A entrada somada ao FGTS não pode ser maior que o valor do imóvel."
                );
                return;
            }

            const message = [
                "Olá, Diego! Fiz uma simulação pelo seu site e gostaria de conversar.",
                "",
                `Valor do imóvel: ${formatBRL(result.propertyValue)}`,
                `Entrada: ${formatBRL(result.entry)}`,
                `FGTS: ${formatBRL(result.fgts)}`,
                `Total de recursos: ${formatBRL(result.resources)}`,
                "",
                `Valor aproximado a financiar: ${formatBRL(result.amountToFinance)}`,
                "",
                "Gostaria de entender melhor as condições de financiamento."
            ].join("\n");

            openWhatsApp(message);
        });
    }

    window.updateCalculator();
}

/* =========================================
   LINKS DE WHATSAPP
========================================= */

function initializeWhatsAppLinks() {
    document.querySelectorAll("[data-whatsapp]").forEach((element) => {
        element.addEventListener("click", (event) => {
            event.preventDefault();

            const message =
                element.dataset.message ||
                "Olá, Diego! Encontrei seu site e gostaria de mais informações sobre imóveis.";

            openWhatsApp(message);
        });
    });
}
