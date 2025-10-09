import { addFavorite } from "./favorites.js";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const bookList = document.getElementById("bookList");

// Function to create a book card
function createBookCard(book) {
  const card = document.createElement("div");
  card.className = "border rounded-lg shadow p-4 flex flex-col";

  const bookLink = book.infoLink || "#";

  console.log(`Book: ${book.title}`);
  console.log(`Authors: ${book.authors.join(", ")}`);
  console.log(`Info Link: ${bookLink}`);

  // Image container
  const imgContainer = document.createElement("div");
  imgContainer.className = "flex justify-center items-center h-48";

  const imgLink = document.createElement("a");
  imgLink.href = bookLink;
  imgLink.target = "_blank";
  imgLink.rel = "noopener noreferrer";

  const img = document.createElement("img");
  img.src = book.thumbnail || "";
  img.alt = book.title;
  img.className = "w-full h-full object-cover cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105";

  imgLink.appendChild(img);
  imgContainer.appendChild(imgLink);

  // Title container
  const titleContainer = document.createElement("div");
  titleContainer.className = "mt-4 flex-grow";

  const titleLink = document.createElement("a");
  titleLink.href = bookLink;
  titleLink.target = "_blank";
  titleLink.rel = "noopener noreferrer";

  const title = document.createElement("h3");
  title.textContent = book.title;
  title.className = "font-bold text-lg text-center text-blue-600 hover:text-blue-800 cursor-pointer";

  titleLink.appendChild(title);
  titleContainer.appendChild(titleLink);

  const author = document.createElement("p");
  author.textContent = book.authors ? book.authors.join(", ") : "Unknown Author";
  author.className = "text-gray-500 text-center";
  titleContainer.appendChild(author);

  // Add to favorites button
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "flex justify-center mt-auto";

  const button = document.createElement("button");
  button.textContent = "Add to Favorites";
  button.className = "bg-blue-600 text-white rounded py-2 px-4";

  button.addEventListener("click", () => {
    addFavorite({
      id: book.id,
      title: book.title,
      author: author.textContent,
      img: img.src,
      previewLink: bookLink
    });
    alert(`${book.title} added to Favorites!`);
  });

  buttonContainer.appendChild(button);

  card.appendChild(imgContainer);
  card.appendChild(titleContainer);
  card.appendChild(buttonContainer);

  return card;
}

// Search books with Open Library API
async function searchBooks(query) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://openlibrary.org/search.json?q=${encodedQuery}&limit=8`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);

  const data = await response.json();
  const books = data.docs || [];

  return books.map(item => ({
    id: item.key,
    title: item.title || "No Title",
    authors: item.author_name || ["Unknown Author"],
    thumbnail: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : "",
    infoLink: `https://openlibrary.org${item.key}`
  }));
}

// Show books on page
async function showBooks(query) {
  bookList.innerHTML = "<p>Searching for books...</p>";

  try {
    const books = await searchBooks(query);
    bookList.innerHTML = "";

    if (books.length === 0) {
      bookList.innerHTML = `<p>No books found for "${query}".</p>`;
      return;
    }

    books.forEach(book => {
      const card = createBookCard(book);
      bookList.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to fetch books:", error);
    bookList.innerHTML = `<p>Error searching for books: ${error.message}. Please try again later.</p>`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) showBooks(query);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) showBooks(query);
      }
    });
  }
});
