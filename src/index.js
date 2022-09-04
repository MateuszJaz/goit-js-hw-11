import { getImages } from './getImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

// variables //
let search_query = '';
let page = 1;
const perPage = 40;
let lightbox = new SimpleLightbox('.gallery a');

// event listeners //
searchForm.addEventListener('submit', imageSearch);

//  functions  //

function clearResults() {
  gallery.innerHTML = '';
  page = 1;
}

function imageSearch(event) {
  event.preventDefault();
  search_query = event.currentTarget.searchQuery.value.trim();

  clearResults();
  if (search_query === '') {
    Notiflix.Notify.failure('Search field cannot be empty');
    return;
  }

  getImages(search_query, page, perPage)
    .then(({ data }) => {
      if (!data.total) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderGallery(data.hits);
        lightbox.refresh();

        Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
      }
    })
    .catch(error => console.log(error));
}

function getMoreImages() {
  page += 1;
  getImages(search_query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      lightbox.refresh();
      const allPages = Math.ceil(data.hits / perPage);

      if (page > allPages) {
        Notiflix.Notify.failure("You've reached the end of search results.");
      }
    })
    .catch(error => console.log(error));
}

// infinite scroll //

window.onscroll = infiniteScroll;

// This variable is used to remember if the function was executed.
var isExecuted = false;

function infiniteScroll() {
  // Inside the "if" statement the "isExecuted" variable is negated to allow initial code execution.
  if (
    window.scrollY > document.body.offsetHeight - window.outerHeight &&
    !isExecuted
  ) {
    // Set "isExecuted" to "true" to prevent further execution
    isExecuted = true;

    // Your code goes here
    getMoreImages();

    // After 1 second the "isExecuted" will be set to "false" to allow the code inside the "if" statement to be executed again
    setTimeout(() => {
      isExecuted = false;
    }, 1000);
  }
}

// html rendering  //

function renderGallery(data) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" loading="lazy" title=""/>
        <div class="info">
          <p class="info-item">
              <b>Likes</b>${likes}</p>
          <p class="info-item">
            <b>Views</b>${views}</p>
          <p class="info-item">
            <b>Comments</b>${comments}</p>
          <p class="info-item">
            <b>Downloads</b>${downloads}</p>
        </div>
        </a>
</div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
