import { addFavorite } from "./favorites.js";

const books = [
  { 
    id: 1, 
    title: "JavaScript and jQuery", 
    author: "Jon Duckett", 
    img: "../lab1/Jon.jpg" 
  },
  { 
    id: 2, 
    title: "JavaScript Programming", 
    author: "Don Gosselin", 
    img: "../lab1/don.jpg" 
  },
  { 
    id: 3, 
    title: "JavaScript for Beginners", 
    author: "Emily A. Vander Veer", 
    img: "../lab1/emily.jpg" 
  },
  { 
    id: 4, 
    title: "Eloquent JavaScript", 
    author: "Marijn Haverbeke", 
    img: "../lab1/marijn.jpg" 
  }
];

window.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button");
  
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
     
      const book = books[index];
      
      if (book) {
        addFavorite(book);
        alert(`${book.title} added to Favorites!`);
      }
    });
  });
});