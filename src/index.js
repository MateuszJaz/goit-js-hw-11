import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener(
  'input',
  debounce(inputEventHandler, DEBOUNCE_DELAY)
);

function clearCountryInfo() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function inputEventHandler(event) {
  const countryToFind = event.target.value.trim();
  if (!countryToFind) {
    clearCountryInfo();
    return;
  }

  fetchCountries(countryToFind)
    .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearCountryInfo();
        return;
      } else if (country.length === 1) {
        clearCountryInfo(countryList.innerHTML);
        createCountryInfo(country);
      } else if (country.length >= 2 && country.length <= 10) {
        clearCountryInfo(countryInfo.innerHTML), createCountryList(country);
      }
    })

    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearCountryInfo();
      return error;
    });
}

function createCountryList(country) {
  const markup = country
    .map(({ name, flags }) => {
      return `<li class="countryItem"><img src="${flags.svg}" alt="${name.official}" width="40" height="20"> 
      ${name.official}</li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function createCountryInfo(country) {
  const markupInfo = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<img src="${flags.svg}" alt="${
        name.official
      }" width="100" height="80"><h1> ${name.official}</h1> 
      <p><span><b>Capital:</b></span> ${capital}</p>
      <p><span><b>Population:</b></span> ${population}</p>
      <p><span><b>Languages:</b></span> ${Object.values(languages)}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markupInfo;
}
