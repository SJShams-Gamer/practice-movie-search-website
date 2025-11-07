const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movieResults = document.getElementById('movieResults');
const modal = document.getElementById('movieModal');
const closeBtn = document.querySelector('.close');
const movieDetails = document.getElementById('movieDetails');

const API_KEY = "53bdf9b4"; // 🔑 Replace with your OMDb API key

searchBtn.addEventListener('click', searchMovies);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchMovies();
});

async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) {
    movieResults.innerHTML = "<p>Please enter a movie name.</p>";
    return;
  }

  movieResults.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      movieResults.innerHTML = `<p>No results found for "${query}".</p>`;
    }
  } catch (error) {
    movieResults.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
    console.error(error);
  }
}

function displayMovies(movies) {
  movieResults.innerHTML = movies.map(movie => `
    <div class="movie" onclick="getMovieDetails('${movie.imdbID}')">
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    </div>
  `).join('');
}

async function getMovieDetails(id) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
    const movie = await response.json();

    movieDetails.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400"}" alt="${movie.Title}">
      <h2>${movie.Title} (${movie.Year})</h2>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>IMDb Rating:</strong> ⭐ ${movie.imdbRating}</p>
    `;

    modal.style.display = "flex";
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

closeBtn.addEventListener('click', () => {
  modal.style.display = "none";
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
