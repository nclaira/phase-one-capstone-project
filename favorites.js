export function getFavorites() {
  const savedBooks = localStorage.getItem("favorites");
  if (savedBooks) {
    const books = JSON.parse(savedBooks);
    return books.map(book => ({
      ...book,
      id: String(book.id)
    }));
  }
  return [];
}

// Function to save favorite books 
export function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Function to add a book to favorites
export function addFavorite(book) {

  const favorites = getFavorites();
  

  const bookId = String(book.id);
  const bookToAdd = { ...book, id: bookId };
  

  const bookExists = favorites.some(fav => String(fav.id) === bookId);
  
  if (!bookExists) {
    favorites.push(bookToAdd);
    saveFavorites(favorites);
  }
}



// Function to remove a book from favorites
export function removeFavorite(id) {
  let favorites = getFavorites();
  
  const bookId = String(id);
  
  console.log("All current book IDs:", favorites.map(f => `"${f.id}" (type: ${typeof f.id})`));
  console.log("Trying to remove ID:", `"${bookId}" (type: ${typeof bookId})`);
  
  favorites = favorites.filter(book => String(book.id) !== bookId);
  
  saveFavorites(favorites);
  
  
  console.log("Remaining books after removal:", favorites.length);
}

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favoritesList");
  if (!container) return;

  // Function to display favorites
  function displayFavorites() {
    const favorites = getFavorites();

    if (favorites.length === 0) {
      container.innerHTML = "<p class='text-center text-gray-500'>No favorite books yet.</p>";
      return;
    }

    let html = "";
    favorites.forEach(book => {
      let bookLink;
      if (book.previewLink && book.previewLink !== "") {
        bookLink = book.previewLink;
      } else {
        const searchQuery = encodeURIComponent(`${book.title} ${book.author}`);
        bookLink = `https://books.google.com/books?q=${searchQuery}`;
      }
      
      html += `
        <div class="border rounded-lg shadow p-4 flex flex-col">
          <div class="flex justify-center items-center h-48">
            <a href="${bookLink}" target="_blank" rel="noopener noreferrer">
              <img src="${book.img}" alt="${book.title}" class="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105">
            </a>
          </div>
          <div class="mt-4 flex-grow">
            <a href="${bookLink}" target="_blank" rel="noopener noreferrer">
              <h2 class="font-bold text-lg text-center text-blue-600 hover:text-blue-800 cursor-pointer">${book.title}</h2>
            </a>
            <p class="text-gray-500 text-center">${book.author}</p>
          </div>
          <div class="flex justify-center mt-auto">
            <button class="remove-btn bg-red-600 text-white rounded py-2 px-4 hover:bg-red-700" data-book-id="${book.id}">
              Remove
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;





    // Add click events to all remove buttons
    const removeButtons = container.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const bookId = button.getAttribute('data-book-id');
        
        console.log("Button clicked! Book ID:", bookId);
        console.log("Current favorites before removal:", getFavorites());
        
        removeFavorite(bookId);
        
        console.log("Current favorites after removal:", getFavorites());
        
        alert("Book removed from favorites!");
        displayFavorites(); // Refresh the display
      });
    });
  }

  displayFavorites();
});