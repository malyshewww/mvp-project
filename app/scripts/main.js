console.log("main init");
// Сортировка данных в таблице
const table = document.getElementById("mainTable");
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
}
// Чекбоксы в таблице
if (table) {
    const checkboxAll = table.querySelector("input[name=check-all]");
    const tbody = table.querySelector(".table__body");
    const checkboxes = tbody.querySelectorAll("input[type='checkbox']");
    tbody.addEventListener("change", (e) => {
        if (e.target.tagName.toLowerCase() == "input") {
            let checked = true;
            for (let i = checkboxes.length; i--; )
                if (!checkboxes[i].checked) {
                    checked = false;
                    break;
                }
            checkboxAll.checked = checked ? true : false;
        }
    });
    checkboxAll.addEventListener("change", checkAll);
    function checkAll(event) {
        let arr = [];
        [...checkboxes].forEach((checkbox, index) => {
            checkbox.checked = event.target.checked ? true : false;
            if (event.target.checked) {
                arr.push(index);
            } else {
                arr = [];
            }
        });
    }
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
    // Клик по кнопке. Открыть/Закрыть select
    dropMenuBtn.addEventListener("click", (e) => {
        drop.classList.toggle("active");
    });
    dropMenuList.addEventListener("click", (e) => {
        e.stopPropagation();
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
