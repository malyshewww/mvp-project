import "./modules/dynamic_adapt.js";
// import "./modules/jquery_floatingscroll.min.js";

// $(document).ready(function () {
//     $(".table-wrapper").floatingScroll();
// });
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

// const tableCloneTh = document.querySelector(".table-clone .th");
// [...tableCloneTh].forEach((header, index) => {

// });
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
                : checkboxesChecked.splice(checkboxesChecked.indexOf(index), 1);
            stateButtonClear(checkboxesChecked, buttonClear);
            calculateChangedRecords();
        });
    });
    checkboxAll.addEventListener("change", checkAll);
    function checkAll(event) {
        [...checkboxes].forEach((checkbox, index) => {
            checkbox.checked = event.target.checked ? true : false;
            if (checkboxesChecked.includes(index)) {
                checkboxesChecked.splice(checkboxesChecked.indexOf(index), 1);
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
    changeStateCheckbox(group);
    deleteCondition(group);
    dateInputMask(group);
});
// Переключение между И или ИЛИ в детальном поиске и блокирование чекбокса "Исключить"
function changeStateCheckbox(parent) {
    const radioButtons = parent.querySelectorAll('input[type="radio"]');
    const groupActions = parent.querySelector(".detail-form__actions");
    const checkboxReset = groupActions?.querySelector('input[type="checkbox"]');
    [...radioButtons].forEach((radioBtn) => {
        radioBtn.addEventListener("change", (event) => {
            let target = event.target;
            if (checkboxReset) {
                target.value === "or"
                    ? checkboxReset.setAttribute("disabled", true)
                    : checkboxReset.removeAttribute("disabled");
            }
        });
    });
}
// Удаление секции из системы фильтрации
function deleteCondition(parent) {
    const deleteButton = parent.querySelector(".detail-form__btn-delete");
    if (deleteButton) {
        deleteButton.addEventListener("click", () => {
            if (parent.classList.contains("detail-form__group--condition")) {
                const addButton = document.querySelector(
                    ".detail-form__bottom .detail-form__btn-add"
                );
                const statusButtons = document.querySelector('.detail-form__status-buttons');
                addButton.style.display = "block";
                parent.style.display = "none";
                statusButtons.setAttribute('hidden', true);
            } else {
                parent.remove();
            }
        });
    }
}

function addCondition() {
    const groupCondition = document.querySelector(
        ".detail-form__group--condition"
    );
    if (groupCondition) {
        groupCondition.style.display = "none";
    }
    const addButton = document.querySelector(
        ".detail-form__bottom .detail-form__btn-add"
    );
    const statusButtons = document.querySelector('.detail-form__status-buttons');
    if (addButton && groupCondition && statusButtons) {
        addButton.addEventListener("click", (event) => {
            event.target.style.display = "none";
            groupCondition.style.display = "block";
            let dropdown = groupCondition.querySelector('.dropdown');
            statusButtons.removeAttribute('hidden');
            setTimeout(() => {
                dropdown.classList.add('active');
            }, 300);
        });
    }
}
addCondition();

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

// Dropdown menu
function initDropdown() {
    [...document.querySelectorAll(".dropdown")].forEach((drop) => {
        const dropMenuBtn = drop.querySelector(".dropdown__button");
        const dropMenuList = drop.querySelector(".dropdown__wrapper");
        const dropdownSearch = drop.querySelector(".dropdown__search");
        const dropdownInput = drop.querySelector(".dropdown-input");
        const inputCondition = drop.querySelectorAll('.radiobutton-item input')
        // Клик по кнопке. Открыть/Закрыть select
        dropMenuBtn.addEventListener("click", (e) => {
            drop.classList.toggle("active");
        });
        dropMenuList.addEventListener("click", (e) => {
            e.stopPropagation();
            if (drop.classList.contains("dropdown-report")) {
                drop.classList.toggle("active");
                dropdownInput.value = e.target.textContent;
            }
        });
        if (inputCondition) {
            [...inputCondition].forEach(input => {
                input.addEventListener('change', (e) => {
                    drop.classList.remove("active");
                })
            })
        }
        // Клик снаружи dropdown либо на другом dropdown Закрыть дропдаун
        document.addEventListener("click", (e) => {
            if (e.target !== dropMenuBtn) {
                drop.classList.remove("active");
            }
        });
        // Нажатие на Tab или Escape. Закрыть дропдаун
        document.addEventListener("keydown", (e) => {
            if (e.key === "Tab" || e.key === "Escape") {
                drop.classList.remove("active");
            }
        });
    });
}
initDropdown();
// document.addEventListener('click', dropdownFunc)
// const dropDown = [...document.querySelectorAll(".dropdown")];
// function dropdownFunc(event) {
//     let target = event.target;
//     if (target.closest('.dropdown__button')) {
//         dropDown.forEach(drop => drop.classList.remove('active'));
//         let parent = target.parentNode;
//         parent.classList.toggle('active');
        
//     }
//     if (target.classList.contains('.dropdown.active') && !target.closest('.dropdown.active')) {
//         target.classList.remove('active');
//     }
// }

class ModalManager {
    constructor() {
        this.actions = {
            'open-modal': 'open',
            'close-modal': 'close'
        };
        this.onClick = this.onClick.bind(this);
        document.addEventListener('click', this.onClick, false);
    }
    onClick(e) {
        const target = e.target.closest('[data-action]');
        if (e.target.closest('.dropdown__wrapper') && !target) return;
        if (!!this.current && !target) this.close();
        if (!target) return;
        const name = target.getAttribute('data-name');
        if (!name) console.error('Missing required parameter "data-name"');
        const action = target.getAttribute('data-action');
        if (!this.actions[action]) return;
        this[this.actions[action]](name);
    }
    open(name) {
        const modal = document.querySelector(`.dropdown[data-name="${name}"]`);
        if (!modal) console.error(`Modal with name ${name} does not exist on the current page`);
        modal.classList.add('active');
        this.current = name;
    }
    close() {
        if (!this.current) return;
        const modal = document.querySelector(`.dropdown[data-name="${this.current}"]`);
        modal.classList.remove('active');
        this.current = null;
    }
}
new ModalManager();
// Формирование динамического изображения в таблице при наведении на логотипы банков
function createImageTooltip() {
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
}
createImageTooltip();

// Подключение кастомного скроллбара
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
    Array.prototype.forEach.call(document.querySelectorAll(selector), (el) => {
        new SimpleBar(el, {
            autoHide: false,
            clickOnTrack: true,
        });
    });
};
initSimpleBar(".trademark [data-simplebar]");
initSimpleBar("[data-dropdown-simplebar]");
initSimpleBar("[data-modal-simplebar]");

const reportGroupForm = document.querySelector(".report-group--form");
const reportGroupPlacing = document.querySelector(".report-group--placing");
if (reportGroupForm || reportGroupPlacing) {
    const previewImages = document.querySelectorAll(".report-preview__image");
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
const reportFields = document.querySelectorAll(".report__field");
if (reportFields.length) {
    [...reportFields].forEach((field) => {
        const buttonDelete = field.querySelector(".report__field-delete");
        if (buttonDelete) {
            buttonDelete.addEventListener("click", (e) => {
                let parent = e.target.parentNode;
                parent.remove();
            });
        }
    });
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

function getScrollbarWidth() {
    return window.innerWidth;
}

let scrollbarWidth = getScrollbarWidth();
let asideWidth = 76;
function calcTableWidth(asideWidth) {
    let mainTable = document.querySelector(".table-visible");
    let someWidth = 0;
    if (window.innerWidth > 1199.98) {
        someWidth = 60;
    } else if (window.innerWidth > 991.98) {
        someWidth = 30;
    }
    if (window.innerWidth > 991.98) {
        if (mainTable) {
            let mainTableWidth = parseInt(
                window.innerWidth - asideWidth - someWidth
            );
            setTimeout(() => {
                mainTable.style.width = `${mainTableWidth}px`;
            }, 400);
        }
    }
}

let prolongationTable = document.querySelector(".prolongation .main__table");
if (prolongationTable) {
    if (window.innerWidth >= 1920) {
        let scrollWidth = parseInt(
            window.innerWidth -
                document.querySelector(".wrapper").offsetWidth +
                document.querySelector(".table-wrapper").offsetWidth -
                30
        );
        prolongationTable.style.width = `${scrollWidth}px`;
    }
}

function openFilter() {
    document.body.classList.add("is-open");
    const aside = document.querySelector(".main__aside");
    window.scrollTo({
        top: aside.getBoundingClientRect().top + window.scrollY,
        behavior: "smooth",
    });
    asideWidth = 406;
    // calcTableWidth(asideWidth);
}
function closeFilter() {
    document.body.classList.remove("is-open");
    asideWidth = 76;
    // calcTableWidth(asideWidth);
}
calcTableWidth();

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
                phone.value = code + " " + phone.value.replace(code + " ", "");
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
    item.style.display = "none";
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
document.addEventListener("DOMContentLoaded", (event) => {
    allModals.forEach((item) => {
        item.style.display = "block";
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

function formHandler(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log(e.target);
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
        const tableHeight = table.getBoundingClientRect().height;
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
    if (searchActions && footer) {
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

function openHeaderMenu() {
    const burger = document.querySelector(".header-burger");
    const overlay = document.querySelector(".overlay");
    const headerMenu = document.querySelector(".header-menu");
    if (burger) {
        burger.addEventListener("click", () => {
            document.body.classList.toggle("menu-open");
            // body_lock_add();
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

function headerActions() {
    let overlay = document.querySelector(".overlay");
    const actions = document.querySelectorAll("[data-action]");
    [...actions].forEach((action) => {
        action.addEventListener("click", (event) => {
            // event.stopPropagation();
            // [...actions].forEach((item) => item.classList.remove("is-active"));
            action.classList.toggle("is-active");
            overlay.classList.add("is-show");
        });
        // document.addEventListener("click", (event) => {
        //     if (event.target == action || action.classList.contains('is-active')) {
        //         action.classList.remove("is-active");
        //         overlay.classList.remove("is-show");
        //     }
        // });
    });
    overlay.addEventListener('click', () => {
        [...actions].forEach((item) => item.classList.remove("is-active"));
        overlay.classList.remove('is-show');
    })
}
headerActions();

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

const reportPage = document.querySelector('.report');
if (reportPage) {
    const buttonReportAdd = reportPage.querySelector('[data-button-report]');
    const reportList = reportPage.querySelector('.report__fields-box');
    reportPage.addEventListener('click', (event) => {
        if (event.target.closest('[data-button-report]')) {
            const reportFileds = reportPage.querySelectorAll('.report__field');
            const clone = reportFileds[0].cloneNode(true);
            reportList.insertBefore(clone, reportFileds[reportFileds.length]);
        }
    })
}
