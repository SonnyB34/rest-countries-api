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
let everyCountry = []

inputSearch.addEventListener('input', updateCountry);
filterRegion.addEventListener('change', updateCountry);

function getInputSearch() {
  return inputSearch.value.toLowerCase().trim();
}

function getRegionFilter() {
  return filterRegion.value;
}

function searchResults(countryInfo, term) {
 const t = term.toLowerCase().trim();
 return countryInfo.filter(c => c.names.common.toLowerCase().includes(t))
  
}

function filterResults(countryInfo, filterOption) {
 const region = filterOption.toLowerCase().trim();
 return countryInfo.filter(item => !region || item.region?.toLowerCase() === region)
}

function updateCountry() {
  const search = getInputSearch();
  const selection = getRegionFilter();
  const filteredResults = filterResults(everyCountry, selection);
  const searchedResults = searchResults(filteredResults, search);

  showCountries(searchedResults);
}


const fetchCountries = async () => {
 const url = 'https://api.restcountries.com/countries/v5';
 try {
  let offset = 0;
  let more = true;
  everyCountry = [];

  while (more) {
    const response = await fetch(`${url}?limit=100&offset=${offset}`, {
      headers: { Authorization: `Bearer ${api_Key}` },
    });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const json = await response.json();
  everyCountry.push(...json.data.objects);
  more = json.data.meta.more;
  offset += 100;
 }
 updateCountry();
} catch (error) {
  console.error('Error fetching country data:', error);
}
}
 //fetchCountries();

function showCountries(countries) {
  countryContainer.innerHTML = ''
  countries.forEach(country => {
    const countryItem = document.createElement('button');
    countryItem.classList.add('country-item');

    countryItem.innerHTML = `
        <img src='${country.flag.url_png}' alt='${country.names.common}'>
        <div class='country-info'>
            <h2 class='country-name'>${country.names.common}</h2>
            <p><strong>Population</strong>: ${country.population}</p>
            <p><strong>Region</strong>: ${country.region}</p>
            <p><strong>Capital</strong>: ${country.capitals?.[0]?.name ?? 'N/A'}</p>
        </div>
        `;

        countryContainer.appendChild(countryItem);

        countryItem.addEventListener('click', () => {
            countryContainer.style.display = 'none';
            document.getElementById('country-info'),classList.add('show');
            showCountryInfo(country)
        })
  });
}

function showCountryInfo(selectedCountry) {
    const countryInfoContainer = document.getElementById('country-info');

    countryInfoContainer.innerHTML = `
        <button id='backbtn' class='backbtn'><ion-icon name="arrow-back-outline"></ion-icon>Back</button>

        <div class='country-information'>
          <div class='country-flag'>        
            <img src='${selectedCountry.flag.png}'>
          </div>

          <div class='country-details'>
            <h1>${selectedCountry.name}</h1>

            <ul>
              <li><strong>Native Name:</strong> ${selectedCountry.nativeName}</li>
              <li><strong>Population:</strong> ${selectedCountry.population.toLocaleString()}</li>
              <li><strong>Region:</strong> ${selectedCountry.region}</li>
              <li><strong>Sub Region:</strong> ${selectedCountry.subregion}</li>
              <li><strong>Capital:</strong> ${selectedCountry.capital}</li>
              <li><strong>Top Level Domain:</strong> ${selectedCountry.topLevelDomain[0]}</li> 
              <li><strong>Currency:</strong> ${selectedCountry.currencies[0].name}</li>
              <li><strong>Languages:</strong> ${selectedCountry.languages.map(language => language.name).join(' ')}</li>          
            </ul>

            ${selectedCountry.borders && selectedCountry.borders.length > 0 ?
              `
              <div class='country-borders'><strong>Border Countries:</strong> ${selectedCountry.borders.map(country => `<span>${country}</span>`).join(' ')}</div>
              `:
              `
              <div><strong>Border Countries</strong> None</div>
              `
            }
          </div>
        </div>
      `
      const backBtn = countryInfoContainer.querySelector('#backbtn')
      backBtn.addEventListener('click', () => {
        countryInfoContainer.innerHTML = '';
        countryInfoContainer.classList.remove('show')
        countryContainer.style.display = 'grid'
      })
}

fetchCountries()
