$(document).ready(function() {
    setTimeout(function() {
        $("#loading-screen").fadeOut(500, function() {
            $(".content").fadeIn(500);
        });
    }, 1500);
});

// Initialize Bootstrap tooltips
$(function() {
  $('[data-bs-toggle="tooltip"]').tooltip();

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

  // State variables for categories display
  let showingAllCategories = false;

  // Pagination state
  const paginationState = {
    'new-books': { page: 1, query: '', category: '' },
    'favorite-books': { page: 1 },
    'recommendations': { page: 1 }
  };

  // Fetch books with AJAX (using jQuery.ajax)
  window.fetchBooksAJAX = function(query, limit = 8) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`,
        method: 'GET',
        success: function(data) {
          resolve(data.docs || []);
        },
        error: function(xhr, status, error) {
          console.error('Error:', error);
          reject(error);
        }
      });
    });
  };

  // Display books (with append option)
  window.displayBooks = function(books, containerId, append = false) {
    const $container = $(`#${containerId}`);
    if (!$container.length) return;

    if (!append) {
      $container.empty();
    }

    if (books.length === 0) {
      if (!append) {
        $container.html('<div class="col-12 text-center"><p>Tidak ada buku yang ditemukan</p></div>');
      }
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
          <div class="card h-100 book-card border">
            <img src="${coverUrl}" class="card-img-top" alt="${title}" style="height: 300px; object-fit: cover;">
            <div class="card-body">
              <h6 class="card-title">${title}</h6>
              <p class="card-text text-muted small">${authors}</p>
              <small class="text-muted">${year}</small>
            </div>
          </div>
        </div>
      `;
      $container.append(bookHTML);
    });
  };

  // Load books by category
  window.loadBooksByCategory = async function(subject, categoryName, page = 1, append = false) {
    paginationState['new-books'] = { 
      page, 
      category: subject,
      query: '' 
    };

    const $container = $('#new-books-container');
    if (!append) {
      $container.html(`
        <div class="col-12 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Memuat buku ${categoryName}...</p>
        </div>
      `);
    }

    try {
      const books = await fetchBooksAJAX(`subject:${subject}`, 12 * page);
      displayBooks(books, 'new-books-container', append);
      
      const $section = $('#semua_buku');
      if ($section.length) {
        if (!append) $section[0].scrollIntoView({behavior: 'smooth'});
        const $heading = $section.find('h2');
        if ($heading.length) $heading.text(`Buku ${categoryName}`);
      }
    } catch (error) {
      console.error('Error loading books by category:', error);
      $container.html(`
        <div class="col-12 text-center">
          <p class="text-danger">Gagal memuat buku. Silakan coba lagi.</p>
        </div>
      `);
    }
  };

  // Display categories on the main page
  function displayCategories() {
    const $container = $('#categories-container');
    if (!$container.length) return;

    $container.empty();

    const categoriesToShow = showingAllCategories ? allCategories : allCategories.slice(0, 8);

    categoriesToShow.forEach(category => {
      $container.append(`
        <div class="col-6 col-md-3 mb-3">
          <button class="btn btn-sm w-100 h-100 fw-semibold fs-5 category-btn"
                  data-subject="${category.subject}" 
                  data-name="${category.name}">
            ${category.name}
          </button>
        </div>
      `);
    });
  }

  // Display all categories in the modal
  function displayAllCategories() {
    const $container = $('#all-categories-container');
    if (!$container.length) return;
    
    $container.empty();
    
    // Group categories into chunks of 4 for better layout
    const chunkSize = 4;
    for (let i = 0; i < allCategories.length; i += chunkSize) {
      const chunk = allCategories.slice(i, i + chunkSize);
      
      const $row = $('<div class="row mb-3"></div>');
      
      chunk.forEach(category => {
        $row.append(`
          <div class="col-md-3">
            <button class="btn btn-sm w-100 h-100 fw-semibold fs-5 category-btn"
                    data-subject="${category.subject}" 
                    data-name="${category.name}">
              ${category.name}
            </button>
          </div>
        `);
      });
      
      $container.append($row);
    }
  }

  // Toggle between showing all categories and limited categories
  function toggleCategories() {
    const $toggleBtn = $('#toggle-category-btn');
    const $btnText = $toggleBtn.find('.btn-text');
    const $spinner = $toggleBtn.find('.spinner-border');

    // Add animation
    $toggleBtn.addClass('animate-zoom');

    // Show spinner, hide text
    $spinner.removeClass('d-none');
    $btnText.addClass('d-none');

    setTimeout(() => {
      showingAllCategories = !showingAllCategories;
      displayCategories();

      $btnText.text(showingAllCategories ? 'Tampilkan Sedikit' : 'Tampilkan Semua Kategori');

      // Reset display
      $toggleBtn.removeClass('animate-zoom');
      $spinner.addClass('d-none');
      $btnText.removeClass('d-none');
    }, 500);
  }

  // Display favorite books with special styling
  function displayFavoriteBooks(books, containerId, append = false) {
    const $container = $(`#${containerId}`);
    if (!$container.length) return;

    if (!append) {
      $container.empty();
    }

    if (books.length === 0) {
      if (!append) {
        $container.html('<div class="col-12 text-center"><p>Tidak ada buku favorit yang ditemukan</p></div>');
      }
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
            <div class="card-body border">
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
      $container.append(bookHTML);
    });
  }

  // Load new releases
  async function loadNewReleases(append = false) {
    if (!append) {
      paginationState['new-books'] = { 
        page: 1, 
        query: '',
        category: '' 
      };
    }

    const $container = $('#new-books-container');
    if (!append) {
      $container.html(`
        <div class="col-12 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Memuat buku terbaru...</p>
        </div>
      `);
    }

    try {
      const books = await fetchBooksAJAX('publish_year:[2023 TO 2024]', 12 * paginationState['new-books'].page);
      displayBooks(books, 'new-books-container', append);
      
      if (!append) {
        const $section = $('#semua_buku');
        if ($section.length) {
          const $heading = $section.find('h2');
          if ($heading.length) $heading.text('Buku Terbaru');
        }
      }
    } catch (error) {
      console.error('Error loading new releases:', error);
      $container.html(`
        <div class="col-12 text-center">
          <p class="text-danger">Gagal memuat buku terbaru. Silakan coba lagi.</p>
        </div>
      `);
    }
  }

  // Load popular books
  async function loadPopularBooks(append = false) {
    const $container = $('#popular-books-container');
    if (!append) {
      $container.html(`
        <div class="col-12 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Memuat buku populer...</p>
        </div>
      `);
    }

    try {
      const books = await fetchBooksAJAX('_popularity:>50', 8 * (append ? paginationState['new-books'].page : 1));
      displayBooks(books, 'popular-books-container', append);
    } catch (error) {
      console.error('Error loading popular books:', error);
      $container.html(`
        <div class="col-12 text-center">
          <p class="text-danger">Gagal memuat buku populer. Silakan coba lagi.</p>
        </div>
      `);
    }
  }

  // Load recommendations
  async function loadRecommendations(append = false) {
    paginationState['recommendations'].page = append ? paginationState['recommendations'].page : 1;

    const $container = $('#recommendations-container');
    if (!append) {
      $container.html(`
        <div class="col-12 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Memuat rekomendasi...</p>
        </div>
      `);
    }

    try {
      const books = await fetchBooksAJAX('award:true', 8 * paginationState['recommendations'].page);
      displayBooks(books, 'recommendations-container', append);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      $container.html(`
        <div class="col-12 text-center">
          <p class="text-danger">Gagal memuat rekomendasi. Silakan coba lagi.</p>
        </div>
      `);
    }
  }

  // Load favorite books
  async function loadFavoriteBooks(append = false) {
    paginationState['favorite-books'].page = append ? paginationState['favorite-books'].page : 1;

    const $container = $('#favorite-books-container');
    if (!append) {
      $container.html(`
        <div class="col-12 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Memuat buku favorit...</p>
        </div>
      `);
    }

    try {
      const books = await fetchBooksAJAX('_rating:[4 TO 5]', 8 * paginationState['favorite-books'].page);
      books.sort((a, b) => (b.ratings_average || 0) - (a.ratings_average || 0));
      displayFavoriteBooks(books, 'favorite-books-container', append);
    } catch (error) {
      console.error('Error loading favorite books:', error);
      $container.html(`
        <div class="col-12 text-center">
          <p class="text-danger">Gagal memuat buku favorit. Silakan coba lagi.</p>
        </div>
      `);
    }
  }

  // Search books function
  async function searchBooks(event, append = false) {
    if (event) event.preventDefault();
    
    const $searchInput = $('#search-input');
    const query = $searchInput.val().trim();
    
    if (query === '' && !append) {
      alert('Silakan masukkan kata kunci pencarian');
      return;
    }

    if (!append) {
      paginationState['new-books'] = { 
        page: 1, 
        query,
        category: '' 
      };
    }

    const $container = $('#new-books-container');
    const $section = $('#semua_buku');
    
    if (!append) {
      $container.html(`
        <div class="col-12 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Mencari buku dengan kata kunci "${query}"...</p>
        </div>
      `);
      $section[0].scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const books = await fetchBooksAJAX(
        paginationState['new-books'].query, 
        12 * paginationState['new-books'].page
      );
      
      displayBooks(books, 'new-books-container', append);
      
      const $heading = $section.find('h2');
      if ($heading.length) {
        $heading.text(append 
          ? `Hasil pencarian untuk "${query}" (Halaman ${paginationState['new-books'].page})`
          : `Hasil pencarian untuk "${query}" (${books.length} buku)`);
      }
    } catch (error) {
      console.error('Error searching books:', error);
      $container.html(`
        <div class="col-12 text-center">
          <p class="text-danger">Gagal melakukan pencarian. Silakan coba lagi.</p>
        </div>
      `);
    }
  }

  // Load more books function
  async function loadMoreBooks(section) {
    const $btn = $(`#load-more-${section}`);
    if (!$btn.length) return;

    // Show loading state
    const $btnText = $btn.find('.btn-text');
    const $spinner = $btn.find('.spinner-border');
    $btnText.addClass('d-none');
    $spinner.removeClass('d-none');
    $btn.prop('disabled', true);

    try {
      paginationState[section].page += 1;

      switch(section) {
        case 'new-books':
          if (paginationState['new-books'].category) {
            await loadBooksByCategory(
              paginationState['new-books'].category, 
              paginationState['new-books'].category, 
              paginationState['new-books'].page,
              true
            );
          } else if (paginationState['new-books'].query) {
            await searchBooks(null, true);
          } else {
            await loadNewReleases(true);
          }
          break;
        case 'recommendations':
          await loadRecommendations(true);
          break;
      }
    } catch (error) {
      console.error('Error loading more books:', error);
      // Revert page increment if failed
      paginationState[section].page -= 1;
    } finally {
      $btnText.removeClass('d-none');
      $spinner.addClass('d-none');
      $btn.prop('disabled', false);
    }
  }

  // Initialize modal when it's shown
  $('#allCategoriesModal').on('shown.bs.modal', function() {
    displayAllCategories();
  });

  // Event delegation for category buttons
  $(document).on('click', '.category-btn', function() {
    const subject = $(this).data('subject');
    const name = $(this).data('name');
    loadBooksByCategory(subject, name);
  });

  // Initialize page
  function initializePage() {
    displayCategories();
    loadNewReleases();
    loadPopularBooks();
    loadFavoriteBooks();
    loadRecommendations();
    
    // Add event listeners
    $('#search-form').on('submit', searchBooks);
    $('#search-input').on('keypress', function(e) {
      if (e.key === 'Enter') searchBooks(e);
    });
    
    $('#toggle-category-btn').on('click', toggleCategories);

    // Load more buttons
    $('#load-more-new-books').on('click', () => loadMoreBooks('new-books'));
    $('#load-more-recommendations').on('click', () => loadMoreBooks('recommendations'));
  }

  // Run when page is loaded
  initializePage();
});