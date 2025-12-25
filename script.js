document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resultsContainer = document.getElementById('results-container');
  
  // API Key for OMDB API (you might want to get your own key)
  const API_KEY = 'e9ec4e76'; // Replace with your actual API key
  
  searchBtn.addEventListener('click', searchMovies);
  searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          searchMovies();
      }
  });
  
  function searchMovies() {
      const searchTerm = searchInput.value.trim();
      
      if (searchTerm === '') {
          showError('Please enter a movie title');
          return;
      }
      
      resultsContainer.innerHTML = '<div class="loading">Loading movies...</div>';
      
      fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`)
          .then(response => response.json())
          .then(data => {
              if (data.Response === 'True') {
                  displayMovies(data.Search);
              } else {
                  showError(data.Error || 'No movies found');
              }
          })
          .catch(error => {
              showError('An error occurred while fetching data');
              console.error('Error:', error);
          });
  }
  
  function displayMovies(movies) {
      resultsContainer.innerHTML = '';
      
      if (!movies || movies.length === 0) {
          showError('No movies found');
          return;
      }
      
      movies.forEach(movie => {
          const movieCard = document.createElement('div');
          movieCard.className = 'movie-card';
          
          let posterImg = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
          
          movieCard.innerHTML = `
              <img src="${posterImg}" alt="${movie.Title}" class="movie-poster">
              <div class="movie-info">
                  <h3 class="movie-title">${movie.Title}</h3>
                  <p class="movie-year">${movie.Year}</p>
                  <span class="movie-type">${movie.Type}</span>
              </div>
          `;
          
          // Add click event to show more details
          movieCard.addEventListener('click', () => showMovieDetails(movie.imdbID));
          
          resultsContainer.appendChild(movieCard);
      });
  }
  
  function showMovieDetails(imdbID) {
      fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
          .then(response => response.json())
          .then(movie => {
              // Create modal for movie details
              const modal = document.createElement('div');
              modal.className = 'modal';
              modal.innerHTML = `
                  <div class="modal-content">
                      <span class="close-btn">&times;</span>
                      <div class="modal-body">
                          <div class="modal-poster">
                              <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${movie.Title}">
                          </div>
                          <div class="modal-info">
                              <h2>${movie.Title} (${movie.Year})</h2>
                              <p><strong>Rated:</strong> ${movie.Rated}</p>
                              <p><strong>Released:</strong> ${movie.Released}</p>
                              <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                              <p><strong>Genre:</strong> ${movie.Genre}</p>
                              <p><strong>Director:</strong> ${movie.Director}</p>
                              <p><strong>Actors:</strong> ${movie.Actors}</p>
                              <p><strong>Plot:</strong> ${movie.Plot}</p>
                              <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
                          </div>
                      </div>
                  </div>
              `;
              
              document.body.appendChild(modal);
              
              // Close modal when clicking X
              modal.querySelector('.close-btn').addEventListener('click', () => {
                  document.body.removeChild(modal);
              });
              
              // Close modal when clicking outside
              modal.addEventListener('click', (e) => {
                  if (e.target === modal) {
                      document.body.removeChild(modal);
                  }
              });
          })
          .catch(error => {
              console.error('Error fetching movie details:', error);
          });
  }
  
  function showError(message) {
      resultsContainer.innerHTML = `<div class="error">${message}</div>`;
  }
});