"use strict";

const WHATSAPP_NUMBER = "5511984777871";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

document.addEventListener("DOMContentLoaded", () => {
    initializeMenu();
    initializePhoneInputs();
    initializeCurrencyInputs();
    initializeListingForm();
    initializeWhatsAppLinks();
    initializeSmoothScrolling();
    initializeCalculators();
    initializeLeadForms();
});

/* =========================
   WHATSAPP
========================= */

function openWhatsApp(message = "") {
    const url = message
        ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
        : WHATSAPP_URL;

    window.location.href = url;
}

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

/* =========================
   MENU MOBILE
========================= */

function initializeMenu() {
    const menuButton = document.querySelector(
        "#menuToggle, #menu-toggle, .menu-toggle, .hamburger"
    );

    const navigation = document.querySelector(
        "#navMenu, #nav-menu, .nav-menu, .navigation"
    );

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

/* =========================
   FORMATAÇÃO DE TELEFONE
========================= */

function formatPhone(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) {
        return digits.length ? `(${digits}` : "";
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
    document.querySelectorAll(
        "#listingPhone, #phone, #telefone, input[type='tel']"
    ).forEach((input) => {
        input.addEventListener("input", () => {
            input.value = formatPhone(input.value);
        });
    });
}

/* =========================
   FORMATAÇÃO DE MOEDA
========================= */

function formatCurrency(value) {
    const digits = String(value).replace(/\D/g, "");

    if (!digits) return "";

    const number = Number(digits) / 100;

    return number.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function currencyToNumber(value) {
    if (typeof value === "number") return value;

    const normalized = String(value || "")
        .replace(/[R$\s]/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
        .replace(/[^\d.-]/g, "");

    const number = Number(normalized);

    return Number.isFinite(number) ? number : 0;
}

function initializeCurrencyInputs() {
    document.querySelectorAll(
        "[data-currency], #listingPrice, #propertyValue, #downPayment, #fgts, #valorImovel, #valorEntrada, #valorFGTS"
    ).forEach((input) => {
        if (input.dataset.currencyInitialized === "true") return;

        input.dataset.currencyInitialized = "true";
        input.setAttribute("inputmode", "numeric");

        input.addEventListener("input", () => {
            input.value = formatCurrency(input.value);
        });
    });
}

/* =========================
   ANUNCIAR IMÓVEL
========================= */

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

        const errorElement = document.getElementById("listingError");

        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = "none";
        }

        if (!name || !phone || !goal || !type || !location) {
            showListingError(
                "Preencha seu nome, telefone, finalidade, tipo de imóvel e localização."
            );
            return;
        }

        const digitsPhone = phone.replace(/\D/g, "");

        if (digitsPhone.length < 10 || digitsPhone.length > 11) {
            showListingError(
                "Informe um número de telefone válido com DDD."
            );
            return;
        }

        const normalizedGoal = normalizeGoal(goal);

        if (!normalizedGoal) {
            showListingError(
                "Selecione se deseja vender ou alugar o imóvel."
            );
            return;
        }

        const message = [
            "Olá, Diego! Gostaria de anunciar um imóvel pelo seu site.",
            "",
            `Nome: ${name}`,
            `Telefone: ${phone}`,
            `Finalidade: ${normalizedGoal}`,
            `Tipo de imóvel: ${type}`,
            `Localização: ${location}`,
            price ? `Valor pretendido: R$ ${price}` : "",
            details ? `Detalhes do imóvel: ${details}` : "",
            "",
            "Sobre as fotos e os vídeos:",
            "Enviarei os arquivos diretamente nesta conversa do WhatsApp, para facilitar o envio e respeitar os limites de tamanho dos arquivos.",
            "",
            "Aguardo seu contato. Obrigado!"
        ].filter(Boolean).join("\n");

        openWhatsApp(message);
    });
}

function getFieldValue(id) {
    const field = document.getElementById(id);

    return field ? field.value.trim() : "";
}

function normalizeGoal(value) {
    const goal = String(value)
        .trim()
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (goal.includes("vender") || goal === "venda") {
        return "Venda";
    }

    if (
        goal.includes("alugar") ||
        goal === "aluguel" ||
        goal === "locacao"
    ) {
        return "Aluguel";
    }

    return value.trim();
}

function showListingError(message) {
    const errorElement = document.getElementById("listingError");

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    } else {
        alert(message);
    }
}

/* =========================
   ROLAGEM SUAVE
========================= */

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

/* =========================
   CALCULADORA DE FINANCIAMENTO
========================= */

function initializeCalculators() {
    const simulatorForm = document.getElementById("simulatorForm");

    if (!simulatorForm) return;

    simulatorForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const propertyValue = currencyToNumber(
            getFieldValue("propertyValue") ||
            getFieldValue("valorImovel")
        );

        const downPayment = currencyToNumber(
            getFieldValue("downPayment") ||
            getFieldValue("valorEntrada")
        );

        const fgts = currencyToNumber(
            getFieldValue("fgts") ||
            getFieldValue("valorFGTS")
        );

        const resultElement =
            document.getElementById("simulationResult");

        if (!propertyValue || propertyValue <= 0) {
            alert("Informe um valor de imóvel válido.");
            return;
        }

        const amountToFinance = Math.max(
            0,
            propertyValue - downPayment - fgts
        );

        const formatBRL = (value) =>
            value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        if (resultElement) {
            resultElement.innerHTML = `
                <h3>Resultado da simulação</h3>
                <p><strong>Valor aproximado a financiar:</strong> ${formatBRL(amountToFinance)}</p>
                <p><strong>Valor do imóvel:</strong> ${formatBRL(propertyValue)}</p>
                <p><strong>Entrada + FGTS:</strong> ${formatBRL(downPayment + fgts)}</p>
                <small>
                    Esta é apenas uma estimativa matemática.
                    A aprovação e os valores reais dependem da análise
                    de crédito, instituição financeira, taxas, prazo
                    e condições de financiamento.
                </small>
            `;

            resultElement.style.display = "block";
        }
    });
}

/* =========================
   FORMULÁRIOS DE CONTATO
========================= */

function initializeLeadForms() {
    document.querySelectorAll("[data-lead-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const lines = [
                "Olá, Diego! Gostaria de mais informações sobre imóveis.",
                ""
            ];

            formData.forEach((value, key) => {
                if (String(value).trim()) {
                    lines.push(`${key}: ${String(value).trim()}`);
                }
            });

            openWhatsApp(lines.join("\n"));
        });
    });
}
