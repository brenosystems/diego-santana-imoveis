document.addEventListener("DOMContentLoaded", () => {

    const WHATSAPP_NUMBER = "5511984777871";


    /* =========================
       FORMATAÇÃO DE VALORES
    ========================= */

    function formatCurrency(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(
            Math.max(0, Number(value) || 0)
        );
    }


    function getValue(id) {
        const element = document.getElementById(id);

        if (!element) return 0;

        const value = element.value
            .replace(/\s/g, "")
            .replace(/R\$/g, "")
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "");

        return Math.max(
            0,
            Number(value) || 0
        );
    }


    function formatInputCurrency(input) {
        if (!input) return;

        let value = input.value.replace(/\D/g, "");

        if (!value) {
            input.value = "";
            return;
        }

        value = Number(value) / 100;

        input.value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }


    function prepareCurrencyInput(input) {
        if (!input) return;

        input.type = "text";
        input.inputMode = "numeric";

        input.addEventListener("input", () => {
            formatInputCurrency(input);
        });
    }


    /* =========================
       TELEFONE
    ========================= */

    function formatPhone(input) {
        if (!input) return;

        let value = input.value.replace(/\D/g, "");

        value = value.substring(0, 11);

        if (value.length <= 2) {
            input.value = value ? `(${value}` : "";
            return;
        }

        if (value.length <= 6) {
            input.value =
                `(${value.substring(0, 2)}) ${value.substring(2)}`;
            return;
        }

        if (value.length <= 10) {
            input.value =
                `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
            return;
        }

        input.value =
            `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    }


    function preparePhoneInput(input) {
        if (!input) return;

        input.type = "tel";
        input.inputMode = "numeric";
        input.maxLength = 15;

        input.addEventListener("input", () => {
            formatPhone(input);
        });
    }


    /* =========================
       WHATSAPP
    ========================= */

    function openWhatsApp(message) {
        const url =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    }


    /* =========================
       CAMPOS EM REAIS
    ========================= */

    [
        "income",
        "entry",
        "fgts",
        "propertyValue",
        "condo",
        "calcProperty",
        "calcEntry",
        "calcFgts"
    ].forEach(id => {
        prepareCurrencyInput(
            document.getElementById(id)
        );
    });


    /* =========================
       CAMPO DE TELEFONE
    ========================= */

    preparePhoneInput(
        document.getElementById("clientPhone")
    );


    /* =========================
       HEADER
    ========================= */

    const header =
        document.querySelector(".header");


    function updateHeader() {
        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );
    }


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =========================
       MENU MOBILE
    ========================= */

    const menuButton =
        document.getElementById("menuButton");

    const nav =
        document.getElementById("nav");


    function closeMenu() {
        if (!menuButton || !nav) return;

        nav.classList.remove("active");
        menuButton.classList.remove("active");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "menu-open"
        );
    }


    function toggleMenu() {
        if (!menuButton || !nav) return;

        const isOpen =
            nav.classList.toggle("active");

        menuButton.classList.toggle(
            "active",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );
    }


    if (menuButton && nav) {

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.addEventListener(
            "click",
            toggleMenu
        );


        nav.querySelectorAll("a").forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {
                    closeMenu();
                }

            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 900
                ) {
                    closeMenu();
                }

            }
        );

    }


    /* =========================
       ANIMAÇÕES AO ENTRAR
       NA TELA
    ========================= */

    const animatedElements =
        document.querySelectorAll(
            ".service-card, " +
            ".section-heading, " +
            ".qualification-text, " +
            ".qualification-card, " +
            ".property-form, " +
            ".calculator-intro, " +
            ".calculator-card, " +
            ".content-card, " +
            ".about-content, " +
            ".about-image, " +
            ".contact-content, " +
            ".contact-card"
        );


    if (
        "IntersectionObserver" in window &&
        animatedElements.length
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        animatedElements.forEach(
            element => {

                element.classList.add(
                    "reveal"
                );

                observer.observe(
                    element
                );

            }
        );

    }


    /* =========================
       PRÉ-ANÁLISE
    ========================= */

    const quiz = {

        income: 0,

        entry: 0,

        fgts: 0,

        fgtsStatus: "",

        firstHome: "",

        estimatedFinancing: 0,

        estimatedProperty: 0

    };


    const steps =
        [
            ...document.querySelectorAll(
                ".form-step"
            )
        ];


    const progressBar =
        document.getElementById(
            "progressBar"
        );


    const estimatedValue =
        document.getElementById(
            "estimatedValue"
        );


    const qualificationResult =
        document.getElementById(
            "qualificationResult"
        );


    const qualificationFinish =
        document.getElementById(
            "qualificationFinish"
        );


    const fgtsValue =
        document.getElementById(
            "fgtsValue"
        );


    const fgtsInput =
        document.getElementById(
            "fgts"
        );


    function showStep(stepNumber) {

        steps.forEach(step => {

            step.classList.toggle(
                "active",
                Number(step.dataset.step) ===
                Number(stepNumber)
            );

        });


        if (
            progressBar &&
            steps.length
        ) {

            progressBar.style.width =
                `${(
                    Number(stepNumber) /
                    steps.length
                ) * 100}%`;

        }

    }


    function validateMoneyField(
        input,
        message
    ) {

        if (
            !input ||
            getValue(input.id) <= 0
        ) {

            if (input) {

                input.focus();

                input.setCustomValidity(
                    message
                );

                input.reportValidity();

                input.setCustomValidity("");

            }

            return false;

        }

        return true;
    }


    /* =========================
       PRÓXIMA PERGUNTA
    ========================= */

    document
        .querySelectorAll(".form-next")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const currentStep =
                        Number(
                            button
                                .closest(".form-step")
                                ?.dataset.step || 1
                        );


                    const nextStep =
                        Number(
                            button.dataset.next
                        );


                    if (currentStep === 1) {

                        const incomeInput =
                            document.getElementById(
                                "income"
                            );


                        if (
                            !validateMoneyField(
                                incomeInput,
                                "Informe a renda familiar mensal."
                            )
                        ) {
                            return;
                        }


                        quiz.income =
                            getValue("income");
                    }


                    if (currentStep === 2) {

                        const entryInput =
                            document.getElementById(
                                "entry"
                            );


                        if (
                            !validateMoneyField(
                                entryInput,
                                "Informe o valor aproximado da entrada."
                            )
                        ) {
                            return;
                        }


                        quiz.entry =
                            getValue("entry");
                    }


                    showStep(
                        nextStep
                    );

                }
            );

        });


    /* =========================
       FGTS
    ========================= */

    document
        .querySelectorAll("[data-fgts]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "[data-fgts]"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "selected"
                            );

                        });


                    button.classList.add(
                        "selected"
                    );


                    quiz.fgtsStatus =
                        button.dataset.fgts;


                    if (
                        quiz.fgtsStatus === "sim"
                    ) {

                        if (fgtsValue) {

                            fgtsValue.classList.add(
                                "visible"
                            );

                        }


                        if (fgtsInput) {

                            fgtsInput.focus();

                        }

                    } else {

                        quiz.fgts = 0;


                        if (fgtsInput) {
                            fgtsInput.value = "";
                        }


                        if (fgtsValue) {

                            fgtsValue.classList.remove(
                                "visible"
                            );

                        }

                    }

                }
            );

        });


    /* =========================
       PRIMEIRO IMÓVEL
    ========================= */

    document
        .querySelectorAll("[data-first]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "[data-first]"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "selected"
                            );

                        });


                    button.classList.add(
                        "selected"
                    );


                    quiz.firstHome =
                        button.dataset.first;


                    quiz.fgts =
                        quiz.fgtsStatus === "sim"
                            ? getValue("fgts")
                            : 0;


                    quiz.estimatedFinancing =
                        Math.round(
                            quiz.income * 27
                        );


                    const resources =
                        quiz.entry +
                        quiz.fgts;


                    quiz.estimatedProperty =
                        quiz.estimatedFinancing +
                        resources;


                    if (estimatedValue) {

                        estimatedValue.textContent =
                            formatCurrency(
                                quiz.estimatedProperty
                            );

                    }


                    if (qualificationResult) {

                        qualificationResult.classList.add(
                            "show"
                        );

                    }


                    if (qualificationFinish) {

                        qualificationFinish.classList.add(
                            "show"
                        );

                    }

                }
            );

        });


    /* =========================
       ENVIAR PRÉ-ANÁLISE
    ========================= */

    if (qualificationFinish) {

        qualificationFinish.addEventListener(
            "click",
            () => {

                quiz.fgts =
                    quiz.fgtsStatus === "sim"
                        ? getValue("fgts")
                        : 0;


                const fgtsText =
                    quiz.fgtsStatus === "sim"

                        ? formatCurrency(
                            quiz.fgts
                        )

                        : quiz.fgtsStatus === "naosei"

                            ? "Não sei"

                            : "Não";


                const firstHomeText =
                    quiz.firstHome === "sim"

                        ? "Sim"

                        : quiz.firstHome === "nao"

                            ? "Não"

                            : "Não informado";


                const message = [

                    "Olá, Diego! Fiz a pré-análise pelo seu site e gostaria de conversar sobre meu cenário.",

                    "",

                    `💰 Renda familiar: ${
                        formatCurrency(
                            quiz.income
                        )
                    }`,

                    `💵 Entrada disponível: ${
                        formatCurrency(
                            quiz.entry
                        )
                    }`,

                    `🏦 FGTS: ${fgtsText}`,

                    `🏠 Primeiro imóvel: ${
                        firstHomeText
                    }`,

                    `📊 Estimativa inicial: ${
                        formatCurrency(
                            quiz.estimatedProperty
                        )
                    }`,

                    "",

                    "Gostaria de entender melhor minhas possibilidades."

                ].join("\n");


                openWhatsApp(
                    message
                );

            }
        );

    }


    /* =========================
       ENCONTRAR MEU IMÓVEL
    ========================= */

    const propertyForm =
        document.getElementById(
            "propertyForm"
        );


    if (propertyForm) {

        propertyForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const propertyValue =
                    getValue(
                        "propertyValue"
                    );


                const region =
                    document
                        .getElementById("region")
                        ?.value
                        .trim()
                    ||
                    "Não informado";


                const propertyType =
                    document
                        .getElementById("propertyType")
                        ?.value
                    ||
                    "Não informado";


                const bedrooms =
                    document
                        .getElementById("bedrooms")
                        ?.value
                    ||
                    "Não informado";


                const parking =
                    document
                        .getElementById("parking")
                        ?.value
                    ||
                    "Não informado";


                const condo =
                    getValue("condo");


                const preferences =
                    document
                        .getElementById("preferences")
                        ?.value
                        .trim()
                    ||
                    "Não informado";


                const clientName =
                    document
                        .getElementById("clientName")
                        ?.value
                        .trim()
                    ||
                    "";


                const clientPhone =
                    document
                        .getElementById("clientPhone")
                        ?.value
                        .trim()
                    ||
                    "";


                const message = [

                    `Olá, Diego! Meu nome é ${clientName}.`,

                    "",

                    "Estou procurando um imóvel e preenchi meu perfil pelo site:",

                    "",

                    `💰 Valor máximo: ${
                        formatCurrency(
                            propertyValue
                        )
                    }`,

                    `📍 Região/bairro: ${
                        region
                    }`,

                    `🏠 Tipo: ${
                        propertyType
                    }`,

                    `🛏️ Quartos: ${
                        bedrooms
                    }`,

                    `🚗 Vaga de garagem: ${
                        parking
                    }`,

                    `🏢 Condomínio máximo: ${
                        condo
                            ? formatCurrency(
                                condo
                            )
                            : "Não informado"
                    }`,

                    `📋 Preferências: ${
                        preferences
                    }`,

                    "",

                    `📱 Meu WhatsApp: ${
                        clientPhone
                    }`,

                    "",

                    "Pode me ajudar a encontrar opções dentro desse perfil?"

                ].join("\n");


                openWhatsApp(
                    message
                );

            }
        );

    }


    /* =========================
       CALCULADORA
    ========================= */

    const calcProperty =
        document.getElementById(
            "calcProperty"
        );


    const calcEntry =
        document.getElementById(
            "calcEntry"
        );


    const calcFgts =
        document.getElementById(
            "calcFgts"
        );


    const financingValue =
        document.getElementById(
            "financingValue"
        );


    const entryValue =
        document.getElementById(
            "entryValue"
        );


    const fgtsValueResult =
        document.getElementById(
            "fgtsValueResult"
        );


    const totalResources =
        document.getElementById(
            "totalResources"
        );


    const calculatorWhatsApp =
        document.getElementById(
            "calculatorWhatsApp"
        );


    function calculateFinancing() {

        const property =
            getValue("calcProperty");


        const entry =
            getValue("calcEntry");


        const fgts =
            getValue("calcFgts");


        const financing =
            Math.max(
                0,
                property - entry - fgts
            );


        const resources =
            entry + fgts;


        if (financingValue) {

            financingValue.textContent =
                formatCurrency(
                    financing
                );

        }


        if (entryValue) {

            entryValue.textContent =
                formatCurrency(
                    entry
                );

        }


        if (fgtsValueResult) {

            fgtsValueResult.textContent =
                formatCurrency(
                    fgts
                );

        }


        if (totalResources) {

            totalResources.textContent =
                formatCurrency(
                    resources
                );

        }


        return {
            property,
            entry,
            fgts,
            financing,
            resources
        };

    }


    [
        calcProperty,
        calcEntry,
        calcFgts
    ].forEach(input => {

        if (!input) return;

        input.addEventListener(
            "input",
            calculateFinancing
        );

    });


    if (calculatorWhatsApp) {

        calculatorWhatsApp.addEventListener(
            "click",
            () => {

                const result =
                    calculateFinancing();


                const message = [

                    "Olá, Diego! Fiz uma simulação pelo seu site e gostaria de conversar.",

                    "",

                    `🏠 Valor do imóvel: ${
                        formatCurrency(
                            result.property
                        )
                    }`,

                    `💵 Entrada: ${
                        formatCurrency(
                            result.entry
                        )
                    }`,

                    `🏦 FGTS: ${
                        formatCurrency(
                            result.fgts
                        )
                    }`,

                    `💰 Valor aproximado a financiar: ${
                        formatCurrency(
                            result.financing
                        )
                    }`,

                    "",

                    "Gostaria de entender melhor as possibilidades."

                ].join("\n");


                openWhatsApp(
                    message
                );

            }
        );

    }


    /* =========================
       NAVEGAÇÃO SUAVE
    ========================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) return;


                    event.preventDefault();


                    const headerHeight =
                        header
                            ?.offsetHeight || 80;


                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight -
                        15;


                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });


                    closeMenu();

                }
            );

        });


    /* =========================
       BOTÃO VOLTAR AO TOPO
    ========================= */

    const backToTop =
        document.querySelector(
            ".back-to-top"
        );


    if (backToTop) {

        window.addEventListener(
            "scroll",
            () => {

                backToTop.classList.toggle(
                    "show",
                    window.scrollY > 700
                );

            },
            { passive: true }
        );

    }


    /* =========================
       REDUÇÃO DE MOVIMENTO
    ========================= */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (reducedMotion.matches) {

        document.documentElement.style
            .scrollBehavior = "auto";

    }


    /* =========================
       PREVENIR SUBMISSÃO
       POR ENTER EM CAMPOS
       DE CÁLCULO
    ========================= */

    document
        .querySelectorAll(
            "#calcProperty, #calcEntry, #calcFgts"
        )
        .forEach(input => {

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                    }

                }
            );

        });


});