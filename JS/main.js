// Initialize Bootstrap tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

// All book categories
const allCategories = [
  { name: "Fiksi", subject: "fiction" },
  { name: "Non-Fiksi", subject: "nonfiction" },
  { name: "Biografi", subject: "biography" },
  { name: "Sains", subject: "science" },
  { name: "Sejarah", subject: "history" },
  { name: "Teknologi", subject: "technology" },
  { name: "Kesehatan", subject: "health" },
  { name: "Pendidikan", subject: "education" },
  { name: "Romantis", subject: "romance" },
  { name: "Misteri", subject: "mystery" },
  { name: "Horor", subject: "horror" },
  { name: "Fantasi", subject: "fantasy" },
  { name: "Sci-Fi", subject: "science_fiction" },
  { name: "Thriller", subject: "thriller" },
  { name: "Komedi", subject: "humor" },
  { name: "Drama", subject: "drama" },
  { name: "Puisi", subject: "poetry" },
  { name: "Seni", subject: "art" },
  { name: "Musik", subject: "music" },
  { name: "Film", subject: "film" },
  { name: "Fotografi", subject: "photography" },
  { name: "Arsitektur", subject: "architecture" },
  { name: "Masakan", subject: "cooking" },
  { name: "Olahraga", subject: "sports" },
  { name: "Travel", subject: "travel" },
  { name: "Agama", subject: "religion" },
  { name: "Filsafat", subject: "philosophy" },
  { name: "Psikologi", subject: "psychology" },
  { name: "Ekonomi", subject: "economics" },
  { name: "Bisnis", subject: "business" },
  { name: "Hukum", subject: "law" },
  { name: "Politik", subject: "politics" },
  { name: "Militer", subject: "military" },
  { name: "Komputer", subject: "computers" },
  { name: "Programming", subject: "programming" },
  { name: "Matematika", subject: "mathematics" },
  { name: "Fisika", subject: "physics" },
  { name: "Kimia", subject: "chemistry" },
  { name: "Biologi", subject: "biology" },
  { name: "Kedokteran", subject: "medical" },
  { name: "Anak-anak", subject: "children" },
  { name: "Remaja", subject: "young_adult" },
  { name: "Komik", subject: "comics" },
  { name: "Manga", subject: "manga" },
  { name: "Graphic Novel", subject: "graphic_novels" },
  { name: "Klasik", subject: "classic" },
  { name: "Sastra", subject: "literature" },
  { name: "Kritik Sastra", subject: "literary_criticism" },
  { name: "Bahasa", subject: "language" },
  { name: "Kamus", subject: "dictionaries" }
];

// State variable for categories display
let showingAllCategories = false;

// Display categories on the main page
function displayCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = '';

  const categoriesToShow = showingAllCategories ? allCategories : allCategories.slice(0, 8);

  categoriesToShow.forEach(category => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-3 mb-3';
    col.innerHTML = `
      <button class="btn btn-sm w-100 h-100 fw-semibold fs-5 category-btn"
              onclick="loadBooksByCategory('${category.subject}', '${category.name}')">
        ${category.name}
      </button>
    `;
    container.appendChild(col);
  });
}

// Display all categories in the modal
function displayAllCategories() {
  const container = document.getElementById('all-categories-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Group categories into chunks of 4 for better layout
  const chunkSize = 4;
  for (let i = 0; i < allCategories.length; i += chunkSize) {
    const chunk = allCategories.slice(i, i + chunkSize);
    
    const row = document.createElement('div');
    row.className = 'row mb-3';
    
    chunk.forEach(category => {
      const col = document.createElement('div');
      col.className = 'col-md-3';
      col.innerHTML = `
        <button class="btn btn-sm w-100 h-100 fw-semibold fs-5 category-btn"
                onclick="loadBooksByCategory('${category.subject}', '${category.name}')">
          ${category.name}
        </button>
      `;
      row.appendChild(col);
    });
    
    container.appendChild(row);
  }
}

// Toggle between showing all categories and limited categories
function toggleCategories() {
  const toggleBtn = document.getElementById('toggle-category-btn');
  const btnText = toggleBtn.querySelector('.btn-text');
  const spinner = toggleBtn.querySelector('.spinner-border');

  // Add animation
  toggleBtn.classList.add('animate-zoom');

  // Show spinner, hide text
  spinner.classList.remove('d-none');
  btnText.classList.add('d-none');

  setTimeout(() => {
    showingAllCategories = !showingAllCategories;
    displayCategories();

    btnText.textContent = showingAllCategories ? 'Tampilkan Sedikit' : 'Tampilkan Semua Kategori';

    // Reset display
    toggleBtn.classList.remove('animate-zoom');
    spinner.classList.add('d-none');
    btnText.classList.remove('d-none');
  }, 500);
}

// Initialize modal when it's shown
document.getElementById('allCategoriesModal')?.addEventListener('shown.bs.modal', function() {
  displayAllCategories();
});

// AJAX function to fetch books
function fetchBooksAJAX(query, callback, limit = 8) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`, true);
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        const data = JSON.parse(xhr.responseText);
        callback(data.docs || []);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        callback([]);
      }
    } else {
      console.error('Error:', xhr.statusText);
      callback([]);
    }
  };
  
  xhr.onerror = function() {
    console.error('Request failed');
    callback([]);
  };
  
  xhr.send();
}

// Display regular books
function displayBooks(books, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (books.length === 0) {
    container.innerHTML = '<div class="col-12 text-center"><p>Tidak ada buku yang ditemukan</p></div>';
    return;
  }

  books.forEach(book => {
    const coverId = book.cover_i;
    const coverUrl = coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` 
      : 'https://via.placeholder.com/200x300?text=No+Cover';
    
    const title = book.title || 'Judul tidak tersedia';
    const authors = book.author_name ? book.author_name.join(', ') : 'Pengarang tidak diketahui';
    const year = book.first_publish_year ? `Tahun: ${book.first_publish_year}` : '';
    
    const bookHTML = `
      <div class="col-md-3 mb-4">
        <div class="card h-100 book-card">
          <img src="${coverUrl}" class="card-img-top" alt="${title}" style="height: 300px; object-fit: cover;">
          <div class="card-body">
            <h6 class="card-title">${title}</h6>
            <p class="card-text text-muted small">${authors}</p>
            <small class="text-muted">${year}</small>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += bookHTML;
  });
}

// Display favorite books with special styling
function displayFavoriteBooks(books, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (books.length === 0) {
    container.innerHTML = '<div class="col-12 text-center"><p>Tidak ada buku favorit yang ditemukan</p></div>';
    return;
  }

  books.forEach(book => {
    const coverId = book.cover_i;
    const coverUrl = coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` 
      : 'https://via.placeholder.com/200x300?text=No+Cover';
    
    const title = book.title || 'Judul tidak tersedia';
    const authors = book.author_name ? book.author_name.join(', ') : 'Pengarang tidak diketahui';
    const year = book.first_publish_year ? `Tahun: ${book.first_publish_year}` : '';
    
    // Generate random rating (4-5 stars for favorites)
    const rating = (Math.random() * 1 + 4).toFixed(1);
    const stars = Math.round(rating);
    
    // Generate random review count
    const reviewCount = Math.floor(Math.random() * 500) + 50;
    
    // Generate star icons
    const starIcons = '<i class="bi bi-star-fill text-warning"></i>'.repeat(stars) + 
                      '<i class="bi bi-star text-warning"></i>'.repeat(5 - stars);
    
    const bookHTML = `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm border-0 book-card">
          <div class="position-relative">
            <img src="${coverUrl}" class="card-img-top" alt="${title}" style="height: 300px; object-fit: cover;">
            <div class="position-absolute top-0 end-0 bg-warning px-2 py-1 rounded-bl">
              <small class="text-white fw-bold"><i class="bi bi-star-fill"></i> ${rating}</small>
            </div>
            <div class="position-absolute bottom-0 start-0 w-100 p-2" style="background: rgba(0,0,0,0.7)">
              <div class="d-flex justify-content-between align-items-center">
                <div class="text-white">
                  <small>${starIcons}</small>
                </div>
                <div class="text-white">
                  <small><i class="bi bi-chat-left-text"></i> ${reviewCount}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h6 class="card-title">${title}</h6>
            <p class="card-text text-muted small">${authors}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${year}</small>
              <button class="btn btn-sm btn-outline-danger">
                <i class="bi bi-heart-fill"></i> Favorit
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += bookHTML;
  });
}

// Load books by category
function loadBooksByCategory(subject, categoryName) {
  // Show loading state
  const container = document.getElementById('new-books-container');
  if (container) {
    container.innerHTML = `
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p>Memuat buku ${categoryName}...</p>
      </div>
    `;
  }

  fetchBooksAJAX(`subject:${subject}`, function(books) {
    displayBooks(books, 'new-books-container');
    const section = document.getElementById('semua_buku');
    if (section) {
      section.scrollIntoView({behavior: 'smooth'});
      const heading = section.querySelector('h2');
      if (heading) heading.textContent = `Buku ${categoryName}`;
    }
  }, 12);
}

// Load new releases
function loadNewReleases() {
  fetchBooksAJAX('publish_year:[2023 TO 2024]', function(books) {
    displayBooks(books, 'new-books-container');
  });
}

// Load popular books
function loadPopularBooks() {
  fetchBooksAJAX('_popularity:>50', function(books) {
    displayBooks(books, 'popular-books-container');
  });
}

// Load recommendations
function loadRecommendations() {
  fetchBooksAJAX('award:true', function(books) {
    displayBooks(books, 'recommendations-container');
  });
}

// Load favorite books (with higher rating filter)
function loadFavoriteBooks() {
  fetchBooksAJAX('_rating:[4 TO 5]', function(books) {
    // Sort by rating (descending)
    books.sort((a, b) => {
      const ratingA = a.ratings_average || 0;
      const ratingB = b.ratings_average || 0;
      return ratingB - ratingA;
    });
    
    displayFavoriteBooks(books.slice(0, 8), 'favorite-books-container');
  }, 20);
}

// Search books function
function searchBooks() {
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();
  
  if (query === '') {
    alert('Silakan masukkan kata kunci pencarian');
    return;
  }

  // Show loading in search results container
  const resultsContainer = document.getElementById('search-results-container');
  if (resultsContainer) {
    resultsContainer.innerHTML = `
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p>Mencari buku dengan kata kunci "${query}"...</p>
      </div>
    `;
    
    // Scroll to search results
    resultsContainer.scrollIntoView({behavior: 'smooth'});
  }

  fetchBooksAJAX(query, function(books) {
    displayBooks(books, 'search-results-container');
  }, 12);
}

// Initialize page
function initializePage() {
  displayCategories();
  loadNewReleases();
  loadPopularBooks();
  loadRecommendations();
  loadFavoriteBooks();
  
  // Add event listener for search button
  const searchButton = document.getElementById('search-button');
  if (searchButton) {
    searchButton.addEventListener('click', searchBooks);
  }
  
  // Add event listener for enter key in search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchBooks();
      }
    });
  }
  
  // Add event listener for category toggle button
  const toggleBtn = document.getElementById('toggle-category-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleCategories);
  }
}

 function searchBooks(event) {
    event.preventDefault();
    const query = document.getElementById("searchInput").value;
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "<p class='text-center'>Mencari...</p>";

    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        const books = data.docs.slice(0, 10); // ambil 10 hasil pertama
        if (books.length === 0) {
          resultsContainer.innerHTML = "<p class='text-center text-danger'>Buku tidak ditemukan.</p>";
          return;
        }

        resultsContainer.innerHTML = books.map(book => `
          <div class="card mb-3 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text text-muted">
                Penulis: ${book.author_name ? book.author_name.join(", ") : "Tidak diketahui"}<br>
                Tahun: ${book.first_publish_year || "Tidak diketahui"}<br>
                Subjek: ${book.subject ? book.subject.slice(0, 3).join(", ") : "Tidak tersedia"}
              </p>
            </div>
          </div>
        `).join("");
      })
      .catch(err => {
        resultsContainer.innerHTML = "<p class='text-center text-danger'>Terjadi kesalahan. Silakan coba lagi.</p>";
        console.error(err);
      });
  }

// Run when page is loaded
window.onload = initializePage;