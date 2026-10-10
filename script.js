document.addEventListener("DOMContentLoaded", () => {
    const WHATSAPP_NUMBER = "5511984777871";

    const formatCurrency = (value) => new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Math.max(0, Number(value) || 0));

    function parseCurrency(value) {
        if (typeof value !== "string") value = String(value ?? "");
        const cleaned = value.trim().replace(/R\$/gi, "").replace(/\s/g, "");
        if (!cleaned) return 0;

        const normalized = cleaned.includes(",")
            ? cleaned.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")
            : cleaned.replace(/[^\d.-]/g, "");

        return Math.max(0, Number(normalized) || 0);
    }

    function getValue(id) {
        const field = document.getElementById(id);
        return field ? parseCurrency(field.value) : 0;
    }

    function formatInputCurrency(input) {
        if (!input) return;

        const digits = input.value.replace(/\D/g, "");
        if (!digits) {
            input.value = "";
            return;
        }

        input.value = formatCurrency(Number(digits));
    }

    function prepareCurrencyInput(input) {
        if (!input) return;

        input.type = "text";
        input.inputMode = "numeric";
        input.autocomplete = "off";

        if (input.value.trim()) formatInputCurrency(input);

        input.addEventListener("input", () => formatInputCurrency(input));
    }

    function formatPhone(input) {
        if (!input) return;

        const digits = input.value.replace(/\D/g, "").slice(0, 11);

        if (digits.length <= 2) {
            input.value = digits ? `(${digits}` : "";
        } else if (digits.length <= 6) {
            input.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        } else if (digits.length <= 10) {
            input.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        } else {
            input.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        }
    }

    const phoneInput = document.getElementById("clientPhone");

    if (phoneInput) {
        phoneInput.type = "tel";
        phoneInput.inputMode = "numeric";
        phoneInput.maxLength = 15;
        phoneInput.addEventListener("input", () => formatPhone(phoneInput));
    }

    [
        "income",
        "entry",
        "fgts",
        "propertyValue",
        "condo",
        "calcProperty",
        "calcEntry",
        "calcFgts"
    ].forEach((id) => {
        prepareCurrencyInput(document.getElementById(id));
    });

    function openWhatsApp(message) {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    }

    const header = document.querySelector(".header");

    function updateHeader() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 30);
        }
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    const menuButton = document.getElementById("menuButton");
    const nav = document.getElementById("nav");

    function closeMenu() {
        if (!menuButton || !nav) return;

        nav.classList.remove("active");
        menuButton.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    }

    function toggleMenu() {
        if (!menuButton || !nav) return;

        const opened = nav.classList.toggle("active");

        menuButton.classList.toggle("active", opened);
        menuButton.setAttribute("aria-expanded", String(opened));
        document.body.classList.toggle("menu-open", opened);
    }

    if (menuButton && nav) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.addEventListener("click", toggleMenu);

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) closeMenu();
        });
    }

    const steps = [...document.querySelectorAll(".form-step")];
    const progressBar = document.getElementById("progressBar");
    const estimatedValue = document.getElementById("estimatedValue");
    const qualificationResult = document.getElementById("qualificationResult");
    const qualificationFinish = document.getElementById("qualificationFinish");
    const fgtsValue = document.getElementById("fgtsValue");
    const fgtsInput = document.getElementById("fgts");

    const quiz = {
        income: 0,
        entry: 0,
        fgts: 0,
        fgtsStatus: "",
        firstHome: "",
        estimatedFinancing: 0,
        estimatedProperty: 0
    };

    function showStep(stepNumber) {
        steps.forEach((step) => {
            step.classList.toggle(
                "active",
                Number(step.dataset.step) === Number(stepNumber)
            );
        });

        if (progressBar && steps.length) {
            progressBar.style.width = `${(Number(stepNumber) / steps.length) * 100}%`;
        }
    }

    function validateMoneyField(input, message) {
        if (!input || getValue(input.id) <= 0) {
            if (input) {
                input.focus();
                input.setCustomValidity(message);
                input.reportValidity();
                input.setCustomValidity("");
            }

            return false;
        }

        return true;
    }

    document.querySelectorAll(".form-next").forEach((button) => {
        button.addEventListener("click", () => {
            const currentStep = Number(
                button.closest(".form-step")?.dataset.step || 1
            );

            const nextStep = Number(button.dataset.next);

            if (currentStep === 1) {
                const income = document.getElementById("income");

                if (!validateMoneyField(income, "Informe a renda familiar mensal.")) {
                    return;
                }

                quiz.income = getValue("income");
            }

            if (currentStep === 2) {
                const entry = document.getElementById("entry");

                if (!validateMoneyField(entry, "Informe o valor aproximado da entrada.")) {
                    return;
                }

                quiz.entry = getValue("entry");
            }

            if (currentStep === 3) {
                if (!quiz.fgtsStatus) {
                    alert("Selecione uma opção sobre o FGTS para continuar.");
                    return;
                }

                quiz.fgts = quiz.fgtsStatus === "sim" ? getValue("fgts") : 0;
            }

            showStep(nextStep);
        });
    });

    document.querySelectorAll("[data-fgts]").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-fgts]").forEach((item) => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");
            quiz.fgtsStatus = button.dataset.fgts;

            if (quiz.fgtsStatus === "sim") {
                fgtsValue?.classList.add("show");
                fgtsInput?.focus();
            } else {
                quiz.fgts = 0;

                if (fgtsInput) fgtsInput.value = "";

                fgtsValue?.classList.remove("show");
            }
        });
    });

    document.querySelectorAll("[data-first]").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-first]").forEach((item) => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");
            quiz.firstHome = button.dataset.first;
            quiz.fgts = quiz.fgtsStatus === "sim" ? getValue("fgts") : 0;
            quiz.estimatedFinancing = Math.round(quiz.income * 27);
            quiz.estimatedProperty = quiz.estimatedFinancing + quiz.entry + quiz.fgts;

            if (estimatedValue) {
                estimatedValue.textContent = formatCurrency(quiz.estimatedProperty);
            }

            qualificationResult?.classList.add("show");
            qualificationFinish?.classList.add("show");
        });
    });

    if (qualificationFinish) {
        qualificationFinish.addEventListener("click", () => {
            quiz.fgts = quiz.fgtsStatus === "sim" ? getValue("fgts") : 0;

            const fgtsText = quiz.fgtsStatus === "sim"
                ? formatCurrency(quiz.fgts)
                : quiz.fgtsStatus === "naosei"
                    ? "Não sei"
                    : "Não";

            const firstHomeText = quiz.firstHome === "sim"
                ? "Sim"
                : quiz.firstHome === "nao"
                    ? "Não"
                    : "Não informado";

            const message = [
                "Olá, Diego! Tudo bem?",
                "Fiz uma pré-análise pelo seu site e gostaria de conversar sobre minhas possibilidades de compra.",
                "",
                "*Perfil de compra*",
                `Renda familiar: ${formatCurrency(quiz.income)}`,
                `Entrada disponível: ${formatCurrency(quiz.entry)}`,
                `FGTS: ${fgtsText}`,
                `Primeiro imóvel: ${firstHomeText}`,
                `Estimativa inicial: ${formatCurrency(quiz.estimatedProperty)}`,
                "",
                "Gostaria de entender melhor as opções para o meu perfil.",
                "Enviado pelo site Diego Santana Imóveis."
            ].join("\n");

            openWhatsApp(message);
        });
    }

    const propertyForm = document.getElementById("propertyForm");

    if (propertyForm) {
        propertyForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const propertyValue = getValue("propertyValue");
            const region = document.getElementById("region")?.value.trim() || "Não informado";
            const propertyType = document.getElementById("propertyType")?.value || "Não informado";
            const bedrooms = document.getElementById("bedrooms")?.value || "Não informado";
            const parking = document.getElementById("parking")?.value || "Não informado";
            const condo = getValue("condo");
            const preferences = document.getElementById("preferences")?.value.trim() || "Não informado";
            const clientName = document.getElementById("clientName")?.value.trim() || "";
            const clientPhone = document.getElementById("clientPhone")?.value.trim() || "";

            const message = [
                "Olá, Diego! Tudo bem?",
                `Meu nome é ${clientName} e estou procurando um imóvel. Preenchi meu perfil pelo seu site.`,
                "",
                "*Perfil de busca*",
                `Valor máximo: ${formatCurrency(propertyValue)}`,
                `Região/bairro: ${region}`,
                `Tipo de imóvel: ${propertyType}`,
                `Quartos: ${bedrooms}`,
                `Vaga de garagem: ${parking}`,
                `Condomínio máximo: ${condo ? formatCurrency(condo) : "Não informado"}`,
                `Preferências: ${preferences}`,
                `Meu WhatsApp: ${clientPhone}`,
                "",
                "Pode me ajudar a encontrar opções dentro desse perfil?",
                "Enviado pelo site Diego Santana Imóveis."
            ].join("\n");

            openWhatsApp(message);
        });
    }

    const calcProperty = document.getElementById("calcProperty");
    const calcEntry = document.getElementById("calcEntry");
    const calcFgts = document.getElementById("calcFgts");
    const financingValue = document.getElementById("financingResult");
    const resultProperty = document.getElementById("resultProperty");
    const resultResources = document.getElementById("resultResources");
    const calculatorWhatsApp = document.getElementById("calcWhatsapp");

    function calculateFinancing() {
        const property = getValue("calcProperty");
        const entry = getValue("calcEntry");
        const fgts = getValue("calcFgts");
        const financing = Math.max(0, property - entry - fgts);
        const resources = entry + fgts;

        if (financingValue) {
            financingValue.textContent = formatCurrency(financing);
        }

        if (resultProperty) {
            resultProperty.textContent = formatCurrency(property);
        }

        if (resultResources) {
            resultResources.textContent = formatCurrency(resources);
        }

        return { property, entry, fgts, financing, resources };
    }

    [calcProperty, calcEntry, calcFgts].forEach((input) => {
        if (input) input.addEventListener("input", calculateFinancing);
    });

    calculateFinancing();

    if (calculatorWhatsApp) {
        calculatorWhatsApp.addEventListener("click", () => {
            const result = calculateFinancing();

            const message = [
                "Olá, Diego! Tudo bem?",
                "Fiz uma simulação pelo seu site e gostaria de conversar sobre este cenário.",
                "",
                "*Simulação do imóvel*",
                `Valor do imóvel: ${formatCurrency(result.property)}`,
                `Entrada: ${formatCurrency(result.entry)}`,
                `FGTS: ${formatCurrency(result.fgts)}`,
                `Recursos informados: ${formatCurrency(result.resources)}`,
                `Valor aproximado a financiar: ${formatCurrency(result.financing)}`,
                "",
                "Gostaria de entender melhor as condições e possibilidades.",
                "Enviado pelo site Diego Santana Imóveis."
            ].join("\n");

            openWhatsApp(message);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            const headerHeight = header?.offsetHeight || 80;
            const targetPosition =
                target.getBoundingClientRect().top + window.scrollY - headerHeight - 15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            closeMenu();
        });
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
        document.documentElement.style.scrollBehavior = "auto";
    }

    document.querySelectorAll("#calcProperty, #calcEntry, #calcFgts").forEach((input) => {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") event.preventDefault();
        });
    });

    showStep(1);
});