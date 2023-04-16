function toggleMenu(menuItem) {
    const inputElement = menuItem.querySelector('input[type="text"]');
    const searchResults = menuItem.querySelector('.search-results');
    const iconElement = menuItem.querySelector('i');
    const buttonElement = menuItem.querySelector('button');

    if (iconElement.classList.contains('fa-chevron-down')) {
        searchResults.style.display = 'grid';
        inputElement.style.display = 'block';
        buttonElement.style.display = 'none';
        iconElement.classList.replace('fa-chevron-down', 'fa-chevron-up');
        //Add rotate-chevron class to icon
        iconElement.classList.add('rotate-chevron');
        iconElement.classList.remove('no-rotate-chevron');

        searchResults.style.gridTemplateColumns = '1fr';
        searchResults.style.fontSize = '0.75rem';
        searchResults.style.justifyItems = 'center';
        searchResults.style.alignItems = 'center';
    } else {
        buttonElement.style.display = 'block';
        searchResults.style.display = 'none';
        inputElement.style.display = 'none';
        iconElement.classList.replace('fa-chevron-up', 'fa-chevron-down');
        //Remove rotate-chevron class to icon
        iconElement.classList.replace('rotate-chevron', 'no-rotate-chevron');
    }
}

function addMenuClickListener(menuId) {
    const menuElement = document.getElementById(menuId);
    const iconElement = menuElement.querySelector('i');

    menuElement.addEventListener('click', function (event) {
        if (iconElement.classList.contains('fa-chevron-up')) {
            event.stopPropagation(); 
        } else {
            toggleMenu(menuElement);
        }
    });

    iconElement.addEventListener('click', function (event) {
        toggleMenu(menuElement);
        event.stopPropagation();
    });

    const inputElement = menuElement.querySelector('input[type="text"]');
    inputElement.addEventListener('click', function (event) {
        event.stopPropagation();
    });
}

addMenuClickListener('menu-ingredients');
addMenuClickListener('menu-cooking-hardware');
addMenuClickListener('menu-tools');

export {addMenuClickListener};