import { api_Key } from './secret.js';

const darkBtn = document.getElementById('dark-btn');
const currentMode = localStorage.getItem('mode');

if (currentMode) {
  document.documentElement.setAttribute('data-mode', currentMode);

  if (currentMode === 'dark') {
    darkBtn.innerHTML = '<ion-icon name="moon"></ion-icon> Light Mode';
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
    darkBtn.innerHTML = '<ion-icon name="moon-outline"></ion-icon> Light Mode';

    localStorage.setItem('mode', 'dark');
  }
});

const countryContainer = document.getElementById('countries-container');
const inputSearch = document.getElementById('search-input');
const filterRegion = document.getElementById('filter-input');
let everyCountry = [];

inputSearch.addEventListener('input', updateCountry);
filterRegion.addEventListener('change', updateCountry);

function getInputSearch() {
  return inputSearch.value.toLowerCase().trim();
}

function getRegionFilter() {
  return filterRegion.value;
}

function searchResults(countryInfo, searchQuery) {
  return countryInfo.filter((item) =>
    item.name.toLowerCase().includes(searchQuery),
  );
}

function filterResults(countryInfo, filterOption) {
  return countryInfo.filter((item) =>
    item.region.toLowerCase().includes(filterOption.toLowerCase().trim()),
  );
}

function updateCountry() {
  const search = getInputSearch();
  const selection = getRegionFilter();
  const filteredResults = filterResults(everyCountry, selection);
  const searchedResults = searchResults(filteredResults, search);

  showCountries(searchedResults);
}

const fetchCountries = async () => {
  const url = 'https://api.restcountries.com/countries/v5'; // swap in the URL from your working curl
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${api_Key}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    everyCountry = data;
    showCountries(data);
  } catch (error) {
    console.error('Error fetching country data:', error);
  }

};
 //fetchCountries();

function showCountries(countriesData) {
  countryContainer.innerHTML = '';

  countriesData.forEach(country => {
    const countryItem = document.createElement('button');
    countryItem.classList.add('country-item');

    countryItem.innerHTML = `
        <img src='${country.flags.png}'>
        <div class='country-info'>
            <h2 class='country-name'>${country.name}</h2>
            <p><strong>Population</strong>: ${country.population.toLocaleString()}</p>
            <p><strong>Region</strong>: ${country.region}</p>
            <p><strong>Capital</strong>: ${country.capital}</p>
        </div>
        `;

        countryContainer.appendChild(countryItem);

  });
}
