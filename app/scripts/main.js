console.log("main init");
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
                    let aValue = a.querySelector(
                        `.td:nth-child(${columnIndex})`
                    ).textContent;
                    let bValue = b.querySelector(
                        `.td:nth-child(${columnIndex})`
                    ).textContent;
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
    const buttonClear = document.querySelector(".main-search__clear");
    const totalRecordBox = document.querySelector(".total-record");
    if (totalRecordBox) {
        totalRecordBox.innerHTML = `${totalRecord} шт.`;
    }
    let checkboxesChecked = [];
    buttonClear.style.display = "none";
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
        buttonClear.addEventListener("click", () => {
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
    }
    function stateButtonClear(arr, btn) {
        arr.length > 0
            ? (btn.style.display = "flex")
            : (btn.style.display = "none");
    }
    function calculateChangedRecords() {
        const changedRecordBox = document.querySelector(".changed-record");
        if (changedRecordBox) {
            changedRecordBox.innerHTML = `${checkboxesChecked.length} шт.`;
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
            parent.remove();
        });
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

// Dropdown menu
[...document.querySelectorAll(".dropdown")].forEach((drop) => {
    const dropMenuBtn = drop.querySelector(".dropdown__button");
    const dropMenuList = drop.querySelector(".dropdown__wrapper");
    const dropdownSearch = drop.querySelector(".dropdown__search");
    const dropdownInput = drop.querySelector(".dropdown-input");
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
// const tableCloned = document.querySelector(".table-clone");
// const selTable = tableCloned.querySelector(".table");
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
            let scrollPos = e.target.scrollLeft + table.clientWidth;
            let scrollStart = e.target.scrollLeft;
            scrollStart > 0
                ? el.classList.add("is-shadow")
                : el.classList.remove("is-shadow");
            scrollPos == table.scrollWidth
                ? el.classList.remove("is-scrolled")
                : el.classList.add("is-scrolled");
        });
    }
);
Array.prototype.forEach.call(
    document.querySelectorAll("[data-dropdown-simplebar]"),
    (el) => {
        new SimpleBar(el, {
            autoHide: true,
        });
    }
);

const reportGroupForm = document.querySelector(".report-group--form");
if (reportGroupForm) {
    const previewImages = document.querySelectorAll(".report-preview__image");
    let inputs = reportGroupForm.querySelectorAll("input");
    [...inputs].forEach((input) => {
        input.addEventListener("change", (e) => {
            let value = e.target.value;
            let currentPreview = document.querySelector(
                `[data-preview="${value}"]`
            );
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

const btnBack = document.querySelector(".btn-back");
if (btnBack) {
    btnBack.addEventListener("click", () => {
        window.history.back();
    });
}

// const targetElement = document.querySelector(".table-visible");
// const options = {
//     rootMargin: "0px",
//     threshold: [0, 0.5, 1],
// };
// const callback = ([entry]) => {
//     const targetInfo = entry.boundingClientRect;
//     const rootBoundsInfo = entry.rootBounds;
//     if (targetInfo.top < rootBoundsInfo.top || targetInfo.isIntersecting) {
//         tableCloned.classList.add("sticky");
//     } else {
//         tableCloned.classList.remove("sticky");
//     }
// };

// const observer = new IntersectionObserver(callback, options);
// observer.observe(targetElement);

// let tableHeader = table.querySelector(".table__header");
// let createTable = document.createElement("table");
// createTable.className = "table table-clone";
// let clone = tableHeader.cloneNode(true);
// clone.classList.add("clone-header");
// createTable.appendChild(clone);
// const mainTable = document.querySelector(".main__table");
// mainTable.appendChild(createTable);
// console.log(mainTable);

// let setThWidthCalledOnce;
// if ($(".table#mainTable")) {
//     setThWidthCalledOnce = false;
//     $("body").append('<table class="in-table br-all pd5 headscroll"></table>');
//     $("#mainTable .table__header").clone().appendTo(".table.headscroll");

//     // показываем и убираем
//     $(window).scroll(function (e) {
//         let tablepos = $("#mainTable").offset();
//         if (window.pageYOffset > tablepos.top) {
//             if (!setThWidthCalledOnce)
//                 // вызываем установку ширины столбцов только один раз
//                 setThWidth();
//             $(".headscroll").css("width", $("#mainTable").width() + "px");
//             $(".headscroll").css("left", tablepos.left + "px");
//             $(".headscroll .th").css(
//                 "line-height",
//                 $("#mainTable .th").css("line-height")
//             );
//         } else {
//             // скрываем прокручиваемую шапку
//             $(".headscroll").css("display", "none");
//         }

//         // устанавливаем одинаковую ширину столбцов
//         function setThWidth() {
//             $("#mainTable .th").each(function (i, el) {
//                 $(".headscroll .th")
//                     .eq(i)
//                     .css("width", $(el).width() + "px");
//             });
//             setThWidthCalledOnce = true;
//         }
//     });
// }
