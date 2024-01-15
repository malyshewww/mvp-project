document.addEventListener("DOMContentLoaded", () => {
    const mobile = window.matchMedia("(max-width: 991.98px)");
    // Сортировка данных в таблице
    const table = document.getElementById("mainTable");
    let totalRecord = 0;
    if (table) {
        const th = table.querySelectorAll(".th");
        let tbody = table.querySelector(".table__body");
        let rows = [...tbody.querySelectorAll(".tr")];
        let lastIndex = table.querySelectorAll(".th").length - 1;
        th.forEach((header, index) => {
            header.addEventListener("click", function (event) {
                let columnIndex = index;
                if (columnIndex > 1 && columnIndex !== lastIndex) {
                    let sortDirection =
                        header.getAttribute("data-sort-direction") === "desc"
                            ? "asc"
                            : "desc";
                    th.forEach((el) => {
                        el.classList.add("no-active");
                        el.classList.remove("active");
                        el.removeAttribute("data-sort-direction");
                    });
                    header.classList.add("active");
                    header.classList.remove("no-active");
                    header.setAttribute("data-sort-direction", sortDirection);
                    rows.sort((a, b) => {
                        let aValue =
                            a.querySelectorAll(`.td`)[columnIndex].textContent;
                        let bValue =
                            b.querySelectorAll(`.td`)[columnIndex].textContent;
                        if (sortDirection === "asc") {
                            return aValue > bValue ? 1 : -1;
                        } else {
                            return bValue > aValue ? 1 : -1;
                        }
                    });
                    tbody.remove();
                    tbody = document.createElement("div");
                    tbody.className = "table__body";
                    rows.forEach((row) => tbody.appendChild(row));
                    table.appendChild(tbody);
                }
            });
        });
        totalRecord = rows.length;
    }
    // Чекбоксы в таблице
    if (table) {
        const checkboxAll = table.querySelector("input[name=check-all]");
        const tbody = table.querySelector(".table__body");
        const checkboxes = tbody.querySelectorAll("input[type='checkbox']");
        const buttonClear = document.querySelectorAll(".main-search__clear");
        const totalRecordBox = document.querySelector(".total-record");
        const modalResult = document.querySelector(".modal-result");
        const modalResultTotalRecord = modalResult?.querySelector(
            ".main-search__info--show .main-search__count"
        );
        if (totalRecordBox) {
            totalRecordBox.innerHTML = `${totalRecord} шт.`;
        }
        if (modalResultTotalRecord) {
            modalResultTotalRecord.innerHTML = `${totalRecord} шт.`;
        }
        let checkboxesChecked = [];
        [...buttonClear].forEach((btn) => {
            btn.style.display = "none";
        });
        tbody.addEventListener("change", (e) => {
            let checked = true;
            for (let i = checkboxes.length; i--; ) {
                if (!checkboxes[i].checked) {
                    checked = false;
                    break;
                }
            }
            checkboxAll.checked = checked ? true : false;
        });
        [...checkboxes].forEach((item, index) => {
            item.addEventListener("change", (e) => {
                item.checked
                    ? checkboxesChecked.push(index)
                    : checkboxesChecked.splice(
                          checkboxesChecked.indexOf(index),
                          1
                      );
                stateButtonClear(checkboxesChecked, buttonClear);
                calculateChangedRecords();
            });
        });
        checkboxAll.addEventListener("change", checkAll);
        function checkAll(event) {
            [...checkboxes].forEach((checkbox, index) => {
                checkbox.checked = event.target.checked ? true : false;
                if (checkboxesChecked.includes(index)) {
                    checkboxesChecked.splice(
                        checkboxesChecked.indexOf(index),
                        1
                    );
                }
                event.target.checked
                    ? checkboxesChecked.push(index)
                    : (checkboxesChecked = []);
                stateButtonClear(checkboxesChecked, buttonClear);
                calculateChangedRecords();
            });
        }
        if (buttonClear) {
            [...buttonClear].forEach((btn) => {
                btn.addEventListener("click", () => {
                    [...checkboxes].forEach((item) => {
                        item.checked = false;
                        checkboxAll.checked = false;
                        checkboxesChecked = [];
                    });
                    setTimeout(() => {
                        stateButtonClear(checkboxesChecked, buttonClear);
                        calculateChangedRecords();
                    }, 300);
                });
            });
        }
        function stateButtonClear(arr, btns) {
            arr.length > 0
                ? btns.forEach((btn) => (btn.style.display = "flex"))
                : btns.forEach((btn) => (btn.style.display = "none"));
        }
        function calculateChangedRecords() {
            const changedRecordBox = document.querySelector(".changed-record");
            const modalResult = document.querySelector(".modal-result");
            const modalResultTotalRecord = modalResult?.querySelector(
                ".main-search__info--changed .main-search__count"
            );
            if (changedRecordBox) {
                changedRecordBox.innerHTML = `${checkboxesChecked.length} шт.`;
            }
            if (modalResultTotalRecord) {
                modalResultTotalRecord.innerHTML = `${checkboxesChecked.length} шт.`;
            }
        }
        calculateChangedRecords();
    }

    const detailGroups = document.querySelectorAll(".detail-form__group");
    [...detailGroups].forEach((group) => {
        dateInputMask(group);
    });

    // Группа фильтров и условия

    // Удаление группы
    document.addEventListener("click", deleteCondition);

    // Добавление группы
    document.addEventListener("click", addCondition);

    // Переключение между И или ИЛИ в детальном поиске и блокирование чекбокса "Исключить"
    document.addEventListener("change", changeStateCheckbox);

    function changeStateCheckbox(event) {
        let target = event.target;
        if (
            target.closest('.detail-form__status-buttons input[type="radio"]')
        ) {
            let parent = target.closest(".detail-form__group");
            let checkboxReset = parent.querySelector(
                '.detail-form__actions input[type="checkbox"]'
            );
            if (checkboxReset) {
                target.value === "or"
                    ? checkboxReset.setAttribute("disabled", true)
                    : checkboxReset.removeAttribute("disabled");
            }
        }
    }

    const groupNewCondition = document.querySelector(
        ".detail-form__group--condition"
    );
    if (groupNewCondition) {
        groupNewCondition.classList.add("hidden");
        groupNewCondition.style.display = "none";
    }

    function addCondition(event) {
        let target = event.target;
        if (target.closest(".detail-form__bottom .detail-form__btn-add")) {
            if (groupNewCondition) {
                groupNewCondition.style.display = "block";
                groupNewCondition.classList.remove("hidden");
                let dropdownButton =
                    groupNewCondition.querySelector(".dropdown__button");
                setTimeout(() => {
                    dropdownButton.classList.add("active");
                }, 300);
            }
            let last = document.querySelector("[data-group]:last-child");
            let radiobuttons = last.querySelector(
                ".detail-form__status-buttons"
            );
            if (radiobuttons) {
                radiobuttons.style.display = "block";
            }
        }
    }
    function deleteCondition(event) {
        let target = event.target;
        if (target.closest(".detail-form__btn-delete")) {
            let parent = target.closest(".detail-form__group");
            if (parent.classList.contains("detail-form__group--condition")) {
                hidden = true;
                parent.style.display = "none";
                parent.classList.add("hidden");
            } else {
                parent.remove();
            }
            if (!groupNewCondition.classList.contains("hidden")) {
                let last = document.querySelector("[data-group]:last-child");
                let radiobuttons = last.querySelector(
                    ".detail-form__status-buttons"
                );
                if (radiobuttons) {
                    radiobuttons.style.display = "block";
                }
            } else {
                let last = document.querySelector("[data-group]:last-child");
                let radiobuttons = last.querySelector(
                    ".detail-form__status-buttons"
                );
                if (radiobuttons) {
                    radiobuttons.style.display = "none";
                }
            }
        }
    }
    // Маска для даты
    function dateInputMask(parent) {
        let detailDateWrapper = parent.querySelector(".detail-date");
        if (detailDateWrapper) {
            let inputDates = detailDateWrapper.querySelectorAll("input");
            [...inputDates].forEach((input) => {
                input.addEventListener("keypress", function (e) {
                    if (e.keyCode < 47 || e.keyCode > 57) {
                        e.preventDefault();
                    }
                    var len = input.value.length;
                    if (len !== 1 || len !== 3) {
                        if (e.keyCode == 47) {
                            e.preventDefault();
                        }
                    }
                    if (len === 2) {
                        input.value += ".";
                    }
                    if (len === 5) {
                        input.value += ".";
                    }
                });
            });
        }
    }
    // Формирование динамического изображения в таблице при наведении на логотипы банков
    function createImageTooltip() {
        if (!mobile.matches) {
            const picwrap = document.createElement("div");
            const bigpic = document.createElement("img");
            picwrap.appendChild(bigpic);
            picwrap.className = "td-image-tooltip";
            const collectImages = document.querySelectorAll(".td-image img");
            if (collectImages) {
                collectImages.forEach((item) => {
                    const imgParent = item.parentNode;
                    item.addEventListener("mouseover", (e) => {
                        imgParent.appendChild(picwrap);
                        bigpic.src = e.target.src;
                        picwrap.classList.add("show");
                    });
                    item.addEventListener("mouseout", (e) => {
                        picwrap.classList.remove("show");
                    });
                });
            }
        } else {
            return false;
        }
    }
    createImageTooltip();
    // Подключение кастомного скроллбара, инициализация
    let simplebar;
    Array.prototype.forEach.call(
        document.querySelectorAll(".main__table[data-simplebar]"),
        (el) => {
            simplebar = new SimpleBar(el, {
                autoHide: false,
            });
            let scrollElement = simplebar.getScrollElement();
            scrollElement.addEventListener("scroll", function (e) {
                var targetScrollLeft = e.target.scrollLeft;
                // console.log(targetScrollLeft);
                let scrollPos = e.target.scrollLeft + table.clientWidth;
                let scrollStart = e.target.scrollLeft;
                scrollStart > 0
                    ? el.classList.add("is-shadow")
                    : el.classList.remove("is-shadow");
                scrollPos == table.scrollWidth
                    ? el.classList.remove("is-scrolled")
                    : el.classList.add("is-scrolled");
            });
            window.addEventListener("load", () => {
                simplebar.recalculate();
            });
        }
    );
    const initSimpleBar = (selector) => {
        Array.prototype.forEach.call(
            document.querySelectorAll(selector),
            (el) => {
                new SimpleBar(el, {
                    autoHide: false,
                    clickOnTrack: true,
                });
            }
        );
    };
    initSimpleBar(".trademark [data-simplebar]");
    initSimpleBar("[data-dropdown-simplebar]");
    initSimpleBar("[data-modal-simplebar]");

    // Переключение между формами отчета
    const reportGroupForm = document.querySelector(".report-group--form");
    const reportGroupPlacing = document.querySelector(".report-group--placing");
    if (reportGroupForm || reportGroupPlacing) {
        const previewImages = document.querySelectorAll(
            ".report-preview__image"
        );
        let inputs = reportGroupForm.querySelectorAll("input");
        [...inputs].forEach((input) => {
            input.addEventListener("change", (e) => {
                let value = e.target.value;
                let currentPreview = document.querySelector(
                    `[data-preview="${value}"]`
                );
                value === "word"
                    ? reportGroupPlacing.setAttribute("hidden", true)
                    : reportGroupPlacing.removeAttribute("hidden");
                if (previewImages.length) {
                    [...previewImages].forEach((preview) =>
                        preview.classList.remove("is-show")
                    );
                }
                currentPreview.classList.add("is-show");
            });
        });
        let event = new Event("change");
        inputs[0].dispatchEvent(event);
    }

    // Кнопка назад
    const btnBack = document.querySelector(".btn-back");
    if (btnBack) {
        btnBack.addEventListener("click", (e) => {
            e.preventDefault();
            window.history.back();
        });
    }

    // Открытие / закрытие фильтров
    const filterButtonOpen = document.querySelectorAll("[data-filter-open]");
    const filterButtonClose = document.querySelector("[data-filter-close]");
    if (filterButtonOpen) {
        [...filterButtonOpen].forEach((btn) => {
            btn.addEventListener("click", openFilter);
        });
    }
    if (filterButtonClose) {
        filterButtonClose.addEventListener("click", closeFilter);
    }

    function openFilter() {
        document.body.classList.add("is-open");
        const aside = document.querySelector(".main__aside");
        const header = document.querySelector(".header");
        const headerHeight = header.getBoundingClientRect().height;
        if (window.scrollY > headerHeight) {
            window.scrollTo({
                top: aside.getBoundingClientRect().top + window.scrollY,
                behavior: "smooth",
            });
        }
    }
    function closeFilter() {
        document.body.classList.remove("is-open");
    }

    // Маска для телефона
    function maskPhone(elem = document) {
        let inputs = elem.querySelectorAll('input[type="tel"]');
        if (inputs.length) {
            //inputs = once("inputs",inputs);
            inputs.forEach((phone) => {
                let code = "+7",
                    find = /\+7/;
                code = "+7";
                find = /\+7/;
                phone.addEventListener("focus", function () {
                    phone.value =
                        code + " " + phone.value.replace(code + " ", "");
                });
                phone.addEventListener("input", function () {
                    let val = phone.value.replace(find, ""),
                        res = code + " ";
                    val = val.replace(/[^0-9]/g, "");
                    for (let i = 0; i < val.length; i++) {
                        res += i === 0 ? " (" : "";
                        res += i == 3 ? ") " : "";
                        res += i == 6 || i == 8 ? "-" : "";
                        if (i == 10) break;
                        res += val[i];
                    }
                    phone.value = res;
                });
                phone.addEventListener("blur", function () {
                    let val = phone.value.replace(find, "");
                    val = val.trim();
                    if (!val) phone.value = null;
                });
            });
        }
    }
    maskPhone();

    // Модальные окна
    let wrapper = document.querySelector(".wrapper");
    const modalButtons = wrapper?.querySelectorAll("[data-modal-button]");
    const modalClosebuttons = document.querySelectorAll("[data-modal-close]");
    const allModals = document.querySelectorAll("[data-modal]");
    function closeModal(currentModal) {
        currentModal.classList.remove("open-modal");
        body_lock_remove();
    }
    document.addEventListener("click", openModal);
    function openModal(event) {
        const target = event.target;
        if (target.closest("[data-modal-button]")) {
            event.preventDefault();
            const modalId = target.dataset.modalButton;
            const modal = document.getElementById(modalId);
            modal.classList.add("open-modal");
            body_lock();
        }
    }
    // Кнопки - Закрыть Модалку
    modalClosebuttons.forEach((item) => {
        item.addEventListener("click", () => {
            let currentModal = item.closest(".modal");
            closeModal(currentModal);
        });
    });
    // Закрытие модалок по фейду
    allModals.forEach((item) => {
        item.style.display = "block";
        item.addEventListener("click", (e) => {
            e.preventDefault();
            item.classList.remove("open-modal");
            body_lock_remove();
        });
        const modalContent = item.querySelector(".modal__content");
        modalContent.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });
    let delay = 500;
    let unlock = true;
    function body_lock(delay) {
        let body = document.querySelector("body");
        if (body.classList.contains("lock")) {
            body_lock_remove(delay);
        } else {
            body_lock_add(delay);
        }
    }
    function body_lock_remove(delay) {
        const body = document.querySelector("body");
        const lockPadding = document.querySelectorAll(".lock-padding");
        setTimeout(function () {
            if (lockPadding.length > 0) {
                for (let index = 0; index < lockPadding.length; index++) {
                    const el = lockPadding[index];
                    el.style.paddingRight = "0px";
                }
            }
            body.style.paddingRight = "0px";
            body.classList.remove("lock");
        }, delay);

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, delay);
    }
    function body_lock_add(delay) {
        const body = document.querySelector("body");
        const lockPaddingValue =
            window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";
        const lockPadding = document.querySelectorAll(".lock-padding");
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = lockPaddingValue;
            }
        }
        body.style.paddingRight = lockPaddingValue;
        body.classList.add("lock");

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, delay);
    }

    // Тестовая обработка формы и показ модального окна об успехе
    function formHandler(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                let modals = document.querySelectorAll("[data-modal]");
                [...modals].forEach((modal) =>
                    modal.classList.remove("open-modal")
                );
                const modalSuccess = document.getElementById("modal-success");
                modalSuccess.classList.add("open-modal");
                setTimeout(() => {
                    modalSuccess.classList.remove("open-modal");
                    body_lock_remove();
                }, 5000);
            });
        }
    }
    formHandler("formConsultation");

    window.addEventListener("scroll", () => {
        getScrollPosition();
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth < 991.98) {
            getScrollPosition();
        }
    });
    function getScrollPosition() {
        const table = document.querySelector(".table-wrapper");
        if (table) {
            const tableTop = table.getBoundingClientRect().top + window.scrollY;
            if (!document.body.classList.contains("menu-open")) {
                if (window.scrollY > tableTop) {
                    document.body.classList.add("is-sticky");
                } else {
                    document.body.classList.remove("is-sticky");
                }
            }
        }
    }

    // Нижний паддинг для футера
    function setFooterPadding() {
        const searchActions = document.querySelector(".main-search__actions");
        const footer = document.querySelector(".footer");
        const prolongationPage = document.querySelector(".prolongation");
        if (
            document.body.classList.contains("home") ||
            prolongationPage != null
        ) {
            const searchActionsHeight =
                searchActions.getBoundingClientRect().height;
            if (window.innerWidth > 991.98) return false;
            footer.style.paddingBottom = `${searchActionsHeight + 30}px`;
            if (document.body.classList.contains("_touch")) {
                footer.style.paddingBottom = `${searchActionsHeight + 30}px`;
            }
        }
    }
    setFooterPadding();

    /* Проверка мобильного браузера */
    let isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows()
            );
        },
    };
    /* Добавление класса _touch для HTML если браузер мобильный */
    function addTouchClass() {
        if (isMobile.any()) {
            document.documentElement.classList.add("_touch");
        } else {
            document.documentElement.classList.add("_pc");
        }
    }
    addTouchClass();

    // Открытие, закрытие меню
    function openHeaderMenu() {
        const burger = document.querySelector(".header-burger");
        const overlay = document.querySelector(".overlay");
        const headerMenu = document.querySelector(".header-menu");
        if (burger) {
            burger.addEventListener("click", () => {
                document.body.classList.toggle("menu-open");
                // body_lock_add();
                if (overlay.classList.contains("is-show")) {
                    overlay.classList.remove("is-show");
                }
            });
        }
        if (overlay) {
            overlay.addEventListener("click", () => {
                if (document.body.classList.contains("menu-open")) {
                    document.body.classList.remove("menu-open");
                    // body_lock_remove();
                }
            });
        }
    }
    openHeaderMenu();

    // Показ, скрытие выпадающего меню при клике на пользователя и язык в header
    function headerActions() {
        if (mobile.matches) {
            let overlay = document.querySelector(".overlay");
            const actions = document.querySelectorAll("[data-action]");
            [...actions].forEach((action) => {
                const actionTrigger = action.querySelector("[data-trigger]");
                const actionDropdown = action.querySelector("[data-dropdown]");
                actionDropdown.addEventListener("click", (e) => {
                    e.stopPropagation();
                });
                action.addEventListener("click", (e) => {
                    action.classList.toggle("is-active");
                    let activeActions = document.querySelectorAll(
                        "[data-action].is-active"
                    );
                    [...activeActions].length > 0
                        ? overlay.classList.add("is-show")
                        : overlay.classList.remove("is-show");
                });
                document.addEventListener("click", (event) => {
                    if (event.target !== actionTrigger) {
                        action.classList.remove("is-active");
                    }
                });
                overlay.addEventListener("click", () => {
                    action.classList.remove("is-active");
                    overlay.classList.remove("is-show");
                });
            });
        } else {
            return false;
        }
    }
    headerActions();
    window.addEventListener("resize", () => {
        headerActions();
    });

    // Кнопка наверх
    function scrollTop() {
        const buttonUp = document.querySelector(".button-up");
        if (buttonUp) {
            buttonUp.addEventListener("click", (e) => {
                e.preventDefault();
                window.scrollTo(0, 0);
                setTimeout(() => {
                    buttonUp.classList.add("hidden");
                }, 500);
            });
            const options = {
                rootMargin: "50px 0px 0px 0px",
                threshold: 0,
            };
            const observer = new IntersectionObserver(([entry]) => {
                const targetInfo = entry.boundingClientRect;
                const rootBoundsInfo = entry.rootBounds;
                if (
                    targetInfo.bottom > rootBoundsInfo.top ||
                    targetInfo.isIntersecting
                ) {
                    buttonUp.classList.add("hidden");
                } else {
                    buttonUp.classList.remove("hidden");
                }
            }, options);
            observer.observe(header);
        }
    }
    scrollTop();

    function headerObserver() {
        const header = document.querySelector(".header");
        const mainAside = document.querySelector(".main__aside");
        const options = {
            rootMargin: "0px 0px 0px 0px",
            threshold: 0,
        };
        const observer = new IntersectionObserver(([entry]) => {
            const targetInfo = entry.boundingClientRect;
            const rootBoundsInfo = entry.rootBounds;
            if (
                targetInfo.bottom > rootBoundsInfo.top ||
                targetInfo.isIntersecting
            ) {
                mainAside.classList.remove("fixed");
            } else {
                mainAside.classList.add("fixed");
            }
        }, options);
        observer.observe(header);
    }
    headerObserver();

    // Расчет ширины маски в таблице слева и справа
    function setMaskWidth() {
        const mainTable = document.querySelector(".main__table");
        if (mainTable) {
            const tableHeader = mainTable.querySelector(".table__header");
            const th = tableHeader.querySelectorAll(".th");
            const lastColumn = [...th].at(-1);
            const prevLastColumn = [...th].at(-2);
            const firstColumn = th[0];
            let leftMaskWidth = firstColumn.getBoundingClientRect().width;
            let prevLastColumnWidth =
                prevLastColumn.getBoundingClientRect().width;
            let lastColumnWidth = lastColumn.getBoundingClientRect().width;
            let rightMaskWidth = (
                prevLastColumnWidth + lastColumnWidth
            ).toFixed(0);
            mainTable.style.setProperty(
                "--mask-left-width",
                `${leftMaskWidth}px`
            );
            mainTable.style.setProperty(
                "--mask-right-width",
                `${rightMaskWidth}px`
            );
        }
    }
    setMaskWidth();

    // Dropdown menu (OLD)
    function initDropdown() {
        [...document.querySelectorAll(".dropdown")].forEach((drop) => {
            if (drop.classList.contains("dropdown-condition")) {
                const dropMenuBtn = drop.querySelector(".dropdown__button");
                const inputCondition = drop.querySelectorAll(
                    ".radiobutton-item input"
                );
                // Клик по кнопке. Открыть/Закрыть select
                dropMenuBtn.addEventListener("click", (e) => {
                    dropMenuBtn.classList.toggle("active");
                });
                if (inputCondition) {
                    [...inputCondition].forEach((input) => {
                        input.addEventListener("change", (e) => {
                            dropMenuBtn.classList.remove("active");
                        });
                    });
                }
                // Клик снаружи dropdown либо на другом dropdown Закрыть дропдаун
                document.addEventListener("click", (e) => {
                    if (e.target !== dropMenuBtn) {
                        dropMenuBtn.classList.remove("active");
                    }
                });
                // Нажатие на Tab или Escape. Закрыть дропдаун
                document.addEventListener("keydown", (e) => {
                    if (e.key === "Tab" || e.key === "Escape") {
                        dropMenuBtn.classList.remove("active");
                    }
                });
            }
        });
    }
    // initDropdown();

    // Dropdown menu (NEW)
    function deactivateAllDropdownTriggers() {
        const activeDropdownButtons = document.querySelectorAll(
            ".dropdown__button.active"
        );
        [...activeDropdownButtons].forEach((elem) => {
            elem.classList.remove("active");
        });
    }
    function handleDropdownClicks(event) {
        let target = event.target;
        let group;
        if (target.matches(".dropdown__button")) {
            if (target.classList.contains("active")) {
                target.classList.remove("active");
            } else {
                deactivateAllDropdownTriggers();
                target.classList.add("active");
            }
        } else {
            group = target.closest(".detail-form__group");
            if (group?.classList.contains("detail-form__group--status")) {
                if (target.matches(".dropdown__wrapper *")) {
                    event.stopPropagation();
                }
                if (!target.matches(".dropdown__wrapper *")) {
                    deactivateAllDropdownTriggers();
                }
            } else {
                if (target.matches(".dropdown__wrapper *")) {
                    deactivateAllDropdownTriggers();
                }
                if (!target.matches(".dropdown__wrapper *")) {
                    deactivateAllDropdownTriggers();
                }
            }
        }
        if (target.closest(".dropdown__list-item")) {
            let parent = target.closest(".dropdown");
            let dropdownInput = parent.querySelector(".dropdown-input");
            if (dropdownInput) {
                dropdownInput.value = target.textContent;
            }
        }
        if (target.closest(".report__field-delete")) {
            let parent = target.closest(".report__field");
            parent.remove();
        }
    }
    document.addEventListener("click", handleDropdownClicks, false);

    // Клонирование первого списка на странице с отчетами
    const reportPage = document.querySelector(".report");
    if (reportPage) {
        const reportList = reportPage.querySelector(".report__fields-box");
        reportPage.addEventListener("click", (event) => {
            if (event.target.closest("[data-button-report]")) {
                const reportFileds =
                    reportPage.querySelectorAll(".report__field");
                const clone = reportFileds[0].cloneNode(true);
                reportList.insertBefore(
                    clone,
                    reportFileds[reportFileds.length]
                );
            }
        });
    }
    // mouseover/mouseout on menu
    const languageHeader = document.querySelector(".language-header");
    if (languageHeader) {
        languageHeader.addEventListener("mouseenter", () => {
            languageHeader.classList.add("active");
        });
        languageHeader.addEventListener("mouseleave", () => {
            languageHeader.classList.remove("active");
        });
    }
    // setDataattribute for detail-form__group

    function detailGroupActions() {
        const groupArr = [];
        const currentDetailGroups = document.querySelectorAll("[data-group]");
        [...currentDetailGroups].forEach((group, index) => {
            groupArr.push(index);
        });
        let lastIndex = [...currentDetailGroups].length - 1;
        if (currentDetailGroups[lastIndex]) {
            removeRadioButtons(currentDetailGroups[lastIndex]);
        }
    }
    function removeRadioButtons(last) {
        const radiobuttons = last.querySelector(".detail-form__status-buttons");
        if (radiobuttons) {
            radiobuttons.style.display = "none";
        }
    }
    detailGroupActions();
});
