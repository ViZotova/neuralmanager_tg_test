// JavaScript для работы селекта

document.addEventListener('DOMContentLoaded', function () {

    let selectsNumber = document.querySelectorAll(".filters__select-container").length;

    for (let i = 1; i <= selectsNumber; i++) {

        const selectContainer = document.querySelector(`.filters__select-container[data-select-id="${i}"]`);
        const selectHeader = document.querySelector(`.filters__select-container[data-select-id="${i}"] .select-header`);
        const dropdown = document.querySelector(`.filters__select-container[data-select-id="${i}"] .select-dropdown`);
        const options = document.querySelectorAll(`.filters__select-container[data-select-id="${i}"] .option-item`);
        const searchInput = document.querySelector(`.filters__select-container[data-select-id="${i}"] .search-input`);
        const selectedValue = document.querySelector(`.filters__select-container[data-select-id="${i}"] .selected-value`);

        // Открытие/закрытие dropdown
        selectHeader.addEventListener('click', function (e) {
            selectHeader.classList.toggle('open');
            selectContainer.classList.toggle('open');
            if (selectContainer.classList.contains('open')) {
                searchInput.focus();
            }
        });

        // Выбор опции
        options.forEach(option => {
            option.addEventListener('click', function () {

                selectHeader.classList.remove("__not_chosen");

                const value = this.textContent.trim();
                selectedValue.textContent = value;

                // Убираем выделение у всех опций
                options.forEach(opt => opt.classList.remove('selected'));
                // Добавляем выделение выбранной опции
                this.classList.add('selected');

                selectContainer.classList.remove('open');
                selectHeader.classList.remove('open');
            });
        });

        // Поиск по опциям
        searchInput.addEventListener('input', function () {
            const searchText = this.value.toLowerCase();

            options.forEach(option => {
                const optionText = option.textContent.toLowerCase();
                if (optionText.includes(searchText)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
        });

        // Закрытие dropdown при клике вне его
        document.addEventListener('click', function (e) {
            if (!selectContainer.contains(e.target)) {
                selectContainer.classList.remove('open');
                selectHeader.classList.remove('open');
            }
        });
    }

});
