export { getImages };
import axios from 'axios';

const API_KEY = '29584309-9c0a688f03f16b75df6cceeb7';

axios.defaults.baseURL = 'https://pixabay.com/api/';

async function getImages(search_query, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${search_query}&image_type=photo&orientation=horizontal&safeSearch=true&page=${page}&per_page=${perPage}`
  );
  return response;
}
