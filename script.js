const darkBtn = document.getElementById('dark-btn');
const currentMode = localStorage.getItem('mode');

if (currentMode) {
    document.documentElement.setAttribute('data-mode', currentMode);
    
    if(currentMode === 'dark') {
        darkBtn.innerHTML = '<ion-icon name="moon"></ion-icon> Light Mode'
    }
}

darkBtn.addEventListener('click', () => {
    const currentMode = document.documentElement.getAttribute('data-mode');

    if (currentMode === 'dark') {
       document.documentElement.removeAttribute('data-mode');
       darkBtn.innerHTML = '<ion-icon name="moon"></ion-icon> Dark Mode';

       localStorage.setItem('mode', 'light');
    } else {
        document.documentElement.setAttribute('data-mode', 'dark');
        darkBtn.innerHTML = '<ion-icon name="moon-outline"></ion-icon> Light Mode'

        localStorage.setItem('mode', 'dark');
    }
});

const countryContainer = document.getElementById('countries-container');
const inputSearch = document.getElementById('search-input');
const filterRegion = document.getElementBy('filter-input');
let everyCountry = []

inputSearch.addEventListener('input', countryResults);
filterRegion.addEventListener('change', countryResults);

function getInputSearch() {
    return inputSearch.value.toLowerCase().trim();
}

function getRegionFilter() {
    return filterRegion.value
}


