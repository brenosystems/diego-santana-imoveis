
document.addEventListener("DOMContentLoaded", () => {
    const WHATSAPP_NUMBER = "5511984777871";

    /* FORMATAÇÃO DE MOEDA */

    function formatCurrency(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Math.max(0, Number(value) || 0));
    }

    function parseCurrency(value) {
        let text = String(value ?? "")
            .trim()
            .replace(/R\$/gi, "")
            .replace(/\s/g, "")
            .replace(/[^\d,.-]/g, "")
            .replace(/-/g, "");

        if (!text) return 0;

        if (text.includes(",")) {
            const commaIndex = text.lastIndexOf(",");

            const integerPart = text
                .slice(0, commaIndex)
                .replace(/[.,]/g, "");

            const decimalPart = text
                .slice(commaIndex + 1)
                .replace(/\D/g, "")
                .slice(0, 2);

            text = `${integerPart || "0"}${
                decimalPart ? "." + decimalPart : ""
            }`;
        } else {
            const parts = text.split(".");

            if (parts.length > 2) {
                text = text.replace(/\./g, "");
            } else if (parts.length === 2) {
                const [integerPart, decimalPart] = parts;

                if (
                    decimalPart.length === 3 &&
                    integerPart.length >= 1 &&
                    integerPart.length <= 3
                ) {
                    text = integerPart + decimalPart;
                } else if (
                    decimalPart.length > 0 &&
                    decimalPart.length <= 2
                ) {
                    text = `${integerPart || "0"}.${decimalPart}`;
                }
            }
        }

        const number = Number(text);

        return Number.isFinite(number)
            ? Math.max(0, number)
            : 0;
    }

    function getValue(id) {
        const input = document.getElementById(id);
        return input ? parseCurrency(input.value) : 0;
    }

    function formatEditableValue(value) {
        return Number(value).toLocaleString("pt-BR", {
            useGrouping: true,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    function prepareCurrencyInput(input) {
        if (!input) return;

        input.type = "text";
        input.inputMode = "decimal";
        input.autocomplete = "off";

        input.addEventListener("focus", () => {
            if (!input.value.trim()) return;

            input.value = formatEditableValue(
                parseCurrency(input.value)
            );

            const position = input.value.length;
            input.setSelectionRange(position, position);
        });

        input.addEventListener("input", () => {
            const original = input.value;
            const cursor = input.selectionStart ?? original.length;
            const prefix = original.slice(0, cursor);

            const digitsBeforeCursor =
                (prefix.match(/\d/g) || []).length;

            const cursorAfterComma = prefix.includes(",");

            const decimalDigitsBeforeCursor = cursorAfterComma
                ? (
                    prefix
                        .slice(prefix.lastIndexOf(",") + 1)
                        .match(/\d/g) || []
                ).length
                : 0;

            const cleaned = original.replace(/[^\d,]/g, "");
            const hasComma = cleaned.includes(",");
            const commaIndex = cleaned.indexOf(",");

            let integerDigits;
            let decimalDigits = "";

            if (hasComma) {
                integerDigits = cleaned
                    .slice(0, commaIndex)
                    .replace(/\D/g, "");

                decimalDigits = cleaned
                    .slice(commaIndex + 1)
                    .replace(/\D/g, "")
                    .slice(0, 2);
            } else {
                integerDigits = cleaned.replace(/\D/g, "");
            }

            integerDigits = integerDigits.replace(/^0+(?=\d)/, "");

            const formattedInteger = integerDigits.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                "."
            );

            let formatted = formattedInteger;

            if (hasComma) {
                formatted += `,${decimalDigits}`;
            }

            input.value = formatted;

            let newCursor = 0;

            if (cursorAfterComma && hasComma) {
                const newCommaIndex = formatted.indexOf(",");
                const decimalPosition = Math.min(
                    decimalDigitsBeforeCursor,
                    decimalDigits.length
                );

                newCursor = newCommaIndex + 1 + decimalPosition;
            } else {
                let digitsFound = 0;

                while (
                    newCursor < formatted.length &&
                    digitsFound < digitsBeforeCursor
                ) {
                    if (/\d/.test(formatted[newCursor])) {
                        digitsFound++;
                    }

                    newCursor++;
                }
            }

            newCursor = Math.min(newCursor, formatted.length);
            input.setSelectionRange(newCursor, newCursor);
        });

        input.addEventListener("blur", () => {
            if (!input.value.trim()) {
                input.value = "";
                return;
            }

            input.value = formatCurrency(
                parseCurrency(input.value)
            );
        });
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
    ].forEach(id => {
        prepareCurrencyInput(document.getElementById(id));
    });

    /* TELEFONE */

    function formatPhone(input) {
        if (!input) return;

        const digits = input.value
            .replace(/\D/g, "")
            .slice(0, 11);

        if (digits.length <= 2) {
            input.value = digits ? `(${digits}` : "";
        } else if (digits.length <= 6) {
            input.value =
                `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        } else if (digits.length <= 10) {
            input.value =
                `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        } else {
            input.value =
                `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        }
    }

    const phoneInput = document.getElementById("clientPhone");

    if (phoneInput) {
        phoneInput.type = "tel";
        phoneInput.inputMode = "numeric";
        phoneInput.maxLength = 15;

        phoneInput.addEventListener("input", () => {
            formatPhone(phoneInput);
        });
    }

    /* WHATSAPP */

    function openWhatsApp(message) {
        const url =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    }

    /* CABEÇALHO */

    const header = document.querySelector(".header");

    function updateHeader() {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 30);
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();

    /* MENU MOBILE */

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

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) closeMenu();
        });
    }

    /* PRÉ-ANÁLISE */

    const steps = [
        ...document.querySelectorAll(".form-step")
    ];

    const progressBar = document.getElementById("progressBar");
    const estimatedValue = document.getElementById("estimatedValue");
    const qualificationResult =
        document.getElementById("qualificationResult");
    const qualificationFinish =
        document.getElementById("qualificationFinish");
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
        steps.forEach(step => {
            step.classList.toggle(
                "active",
                Number(step.dataset.step) === Number(stepNumber)
            );
        });

        if (progressBar && steps.length) {
            progressBar.style.width =
                `${(Number(stepNumber) / steps.length) * 100}%`;
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

    document.querySelectorAll(".form-next").forEach(button => {
        button.addEventListener("click", () => {
            const currentStep = Number(
                button.closest(".form-step")?.dataset.step || 1
            );

            const nextStep = Number(button.dataset.next);

            if (currentStep === 1) {
                const incomeInput = document.getElementById("income");

                if (!validateMoneyField(
                    incomeInput,
                    "Informe a renda familiar mensal."
                )) {
                    return;
                }

                quiz.income = getValue("income");
            }

            if (currentStep === 2) {
                const entryInput = document.getElementById("entry");

                if (!validateMoneyField(
                    entryInput,
                    "Informe o valor aproximado da entrada."
                )) {
                    return;
                }

                quiz.entry = getValue("entry");
            }

            if (currentStep === 3) {
                if (!quiz.fgtsStatus) {
                    alert("Selecione uma opção sobre o FGTS para continuar.");
                    return;
                }

                quiz.fgts = quiz.fgtsStatus === "sim"
                    ? getValue("fgts")
                    : 0;

                if (quiz.fgtsStatus === "sim" && quiz.fgts <= 0) {
                    if (fgtsInput) {
                        fgtsInput.focus();
                        fgtsInput.setCustomValidity(
                            "Informe o valor aproximado do FGTS."
                        );
                        fgtsInput.reportValidity();
                        fgtsInput.setCustomValidity("");
                    }

                    return;
                }
            }

            showStep(nextStep);
        });
    });

    /* ESCOLHA DO FGTS */

    document.querySelectorAll("[data-fgts]").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-fgts]").forEach(item => {
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

    /* PRIMEIRO IMÓVEL */

    document.querySelectorAll("[data-first]").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-first]").forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");
            quiz.firstHome = button.dataset.first;

            quiz.fgts = quiz.fgtsStatus === "sim"
                ? getValue("fgts")
                : 0;

            quiz.estimatedFinancing = Math.round(quiz.income * 27);

            quiz.estimatedProperty =
                quiz.estimatedFinancing +
                quiz.entry +
                quiz.fgts;

            if (estimatedValue) {
                estimatedValue.textContent =
                    formatCurrency(quiz.estimatedProperty);
            }

            qualificationResult?.classList.add("show");
            qualificationFinish?.classList.add("show");
        });
    });

    /* ENVIAR PRÉ-ANÁLISE */

    if (qualificationFinish) {
        qualificationFinish.addEventListener("click", () => {
            quiz.fgts = quiz.fgtsStatus === "sim"
                ? getValue("fgts")
                : 0;

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

    /* BUSCA DE IMÓVEIS */

    const propertyForm = document.getElementById("propertyForm");

    if (propertyForm) {
        propertyForm.addEventListener("submit", event => {
            event.preventDefault();

            const propertyValue = getValue("propertyValue");

            const region =
                document.getElementById("region")?.value.trim() ||
                "Não informado";

            const propertyType =
                document.getElementById("propertyType")?.value ||
                "Não informado";

            const bedrooms =
                document.getElementById("bedrooms")?.value ||
                "Não informado";

            const parking =
                document.getElementById("parking")?.value ||
                "Não informado";

            const condo = getValue("condo");

            const preferences =
                document.getElementById("preferences")?.value.trim() ||
                "Não informado";

            const clientName =
                document.getElementById("clientName")?.value.trim() ||
                "";

            const clientPhone =
                document.getElementById("clientPhone")?.value.trim() ||
                "";

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

    /* CALCULADORA DE FINANCIAMENTO */

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

        const resources = entry + fgts;
        const financing = Math.max(0, property - resources);

        if (financingValue) {
            financingValue.textContent = formatCurrency(financing);
        }

        if (resultProperty) {
            resultProperty.textContent = formatCurrency(property);
        }

        if (resultResources) {
            resultResources.textContent = formatCurrency(resources);
        }

        return {
            property,
            entry,
            fgts,
            financing,
            resources
        };
    }

    function resetCalculator() {
        [calcProperty, calcEntry, calcFgts].forEach(input => {
            if (input) input.value = "";
        });

        calculateFinancing();
    }

    [calcProperty, calcEntry, calcFgts].forEach(input => {
        if (!input) return;

        input.value = "";
        input.addEventListener("input", calculateFinancing);
    });

    calculateFinancing();

    window.addEventListener("pageshow", resetCalculator);

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

    /* ANUNCIAR IMÓVEL E COMPARTILHAR ARQUIVOS */

    const listingForm = document.getElementById("listingForm");
    const listingFilesInput = document.getElementById("listingFiles");
    const listingFileList = document.getElementById("listingFileList");
    const listingError = document.getElementById("listingError");
    const listingPhone = document.getElementById("listingPhone");
    const listingPrice = document.getElementById("listingPrice");

    const MAX_LISTING_FILES = 8;
    const MAX_LISTING_FILE_SIZE = 20 * 1024 * 1024;

    function showListingError(message = "") {
        if (!listingError) return;

        listingError.textContent = message;
        listingError.hidden = !message;
    }

    function validateListingFiles(files) {
        if (files.length > MAX_LISTING_FILES) {
            return `Selecione no máximo ${MAX_LISTING_FILES} arquivos.`;
        }

        for (const file of files) {
            if (
                !file.type.startsWith("image/") &&
                !file.type.startsWith("video/")
            ) {
                return `O arquivo "${file.name}" não parece ser uma imagem ou vídeo válido.`;
            }

            if (file.size > MAX_LISTING_FILE_SIZE) {
                return `O arquivo "${file.name}" ultrapassa o limite de 20 MB. Escolha um arquivo menor.`;
            }
        }

        return "";
    }

    function renderListingFiles() {
        if (!listingFilesInput || !listingFileList) return;

        const files = Array.from(listingFilesInput.files || []);
        const error = validateListingFiles(files);

        showListingError(error);
        listingFileList.replaceChildren();

        files.forEach(file => {
            const item = document.createElement("li");

            const sizeMb = (file.size / (1024 * 1024)).toLocaleString(
                "pt-BR",
                { maximumFractionDigits: 1 }
            );

            item.textContent = `${file.name} — ${sizeMb} MB`;
            listingFileList.appendChild(item);
        });
    }

    if (listingFilesInput) {
        listingFilesInput.addEventListener("change", renderListingFiles);
    }

    if (listingPhone) {
        listingPhone.type = "tel";
        listingPhone.inputMode = "numeric";
        listingPhone.maxLength = 15;

        listingPhone.addEventListener("input", () => {
            formatPhone(listingPhone);
        });
    }

    if (listingPrice) {
        listingPrice.addEventListener("blur", () => {
            if (!listingPrice.value.trim()) return;

            listingPrice.value = formatCurrency(
                parseCurrency(listingPrice.value)
            );
        });
    }

    if (listingForm) {
        listingForm.addEventListener("submit", async event => {
            event.preventDefault();
            showListingError("");

            const files = Array.from(listingFilesInput?.files || []);
            const fileError = validateListingFiles(files);

            if (fileError) {
                showListingError(fileError);
                listingFilesInput?.focus();
                return;
            }

            const name =
                document.getElementById("listingName")?.value.trim() ||
                "Não informado";

            const phone =
                listingPhone?.value.trim() ||
                "Não informado";

            const goal =
                document.getElementById("listingGoal")?.value ||
                "Não informado";

            const type =
                document.getElementById("listingType")?.value ||
                "Não informado";

            const location =
                document.getElementById("listingLocation")?.value.trim() ||
                "Não informado";

            const price =
                listingPrice?.value.trim() ||
                "Não informado";

            const details =
                document.getElementById("listingDetails")?.value.trim() ||
                "Não informado";

            /*
             * A mensagem contém apenas os dados preenchidos no formulário.
             * Os nomes dos arquivos não são adicionados ao texto do WhatsApp.
             */
            const message = [
                "Olá, Diego! Tudo bem?",
                "Gostaria de conversar sobre a divulgação de um imóvel.",
                "",
                "*INFORMAÇÕES DO IMÓVEL*",
                `Nome: ${name}`,
                `Meu WhatsApp: ${phone}`,
                `Objetivo: ${goal}`,
                `Tipo de imóvel: ${type}`,
                `Bairro/região: ${location}`,
                `Valor pretendido: ${price}`,
                `Detalhes: ${details}`,
                "",
                "Enviado pelo site Diego Santana Imóveis."
            ].join("\n");

            if (files.length > 0) {
                const supportsFileShare =
                    typeof navigator.share === "function" &&
                    typeof navigator.canShare === "function" &&
                    navigator.canShare({ files });

                if (supportsFileShare) {
                    try {
                        await navigator.share({
                            title: "Anunciar imóvel — Diego Santana Imóveis",
                            text: message,
                            files
                        });

                        return;
                    } catch (error) {
                        if (error && error.name === "AbortError") {
                            return;
                        }

                        console.warn(
                            "O compartilhamento de arquivos não foi concluído:",
                            error
                        );
                    }
                }

                /*
                 * Um link wa.me não consegue anexar arquivos automaticamente.
                 * Se o navegador não oferecer compartilhamento nativo,
                 * abre-se o WhatsApp com a mensagem e orienta-se o usuário
                 * a anexar os arquivos manualmente.
                 */
                showListingError(
                    "Este navegador não permite enviar os arquivos selecionados diretamente. O WhatsApp será aberto com a mensagem; anexe as fotos e os vídeos manualmente antes de enviar."
                );
            }

            openWhatsApp(message);
        });
    }

    /* NAVEGAÇÃO SUAVE */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const headerHeight = header?.offsetHeight || 80;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            closeMenu();
        });
    });

    /* ACESSIBILIDADE */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) {
        document.documentElement.style.scrollBehavior = "auto";
    }

    document.querySelectorAll(
        "#calcProperty, #calcEntry, #calcFgts"
    ).forEach(input => {
        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        });
    });

    showStep(1);
});
