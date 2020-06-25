require('dotenv').config();

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: 'mylibrary-7e8a4.firebaseapp.com',
  databaseURL: 'https://mylibrary-7e8a4.firebaseio.com',
  projectId: 'mylibrary-7e8a4',
  storageBucket: 'mylibrary-7e8a4.appspot.com',
  messagingSenderId: '1078431646571',
  appId: '1:1078431646571:web:7df921af4f71677845822e',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const dbLibraryRef = firebase.database().ref('library');
let myLibrary = [];

function Book(name, author, pages, read) {
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary() {
  const title = document.getElementById('title');
  if (title.checkValidity()) {
    const bookForm = document.forms['book-form'];
    const newBook = new Book(
      bookForm.elements['title'].value,
      bookForm.elements['author'].value,
      bookForm.elements['pages'].value,
      bookForm.elements['readstatus'].value
    );
    dbLibraryRef.push(newBook);
    document.getElementById('popup').reset();
    closeForm();
  } else {
    return;
  }
}

dbLibraryRef.on('value', (snap) => {
  const book = snap.val();
  if (book != null) {
    let keys = Object.keys(book);
    //clear the list so there won't be repeated cards
    const container = document.getElementById('container');
    container.querySelectorAll('div').forEach((n) => n.remove());
    for (let i = keys.length - 1; i >= 0; i--) {
      const createDiv = document.createElement('div');
      const createH2 = document.createElement('h2');
      const authorP = document.createElement('p');
      const pagesP = document.createElement('p');
      const buttonDel = document.createElement('i');
      const buttonRead = document.createElement('button');
      const createDiv2 = document.createElement('div');

      container.appendChild(createDiv);
      createDiv.className = 'card';
      createDiv.id = `${keys[i]}`;

      const thisDiv = document.getElementById(`${keys[i]}`);
      thisDiv.appendChild(createH2);
      createH2.className = 'title';
      createH2.textContent = `${book[keys[i]].name}`;

      thisDiv.appendChild(authorP);
      authorP.className = 'author';
      authorP.textContent = `${book[keys[i]].author}`;

      thisDiv.appendChild(pagesP);
      pagesP.className = 'pages';
      pagesP.textContent = `${book[keys[i]].pages} pages`;

      thisDiv.appendChild(createDiv2);
      createDiv2.className = 'btn-container';

      createDiv2.appendChild(buttonRead);
      buttonRead.className = 'btn-read';
      if (book[keys[i]].read === 'unread') {
        buttonRead.textContent = 'Not Read Yet';
      } else {
        buttonRead.classList.add('done');
        buttonRead.textContent = 'Done reading';
      }
      buttonRead.addEventListener('click', changeRead);

      createDiv2.appendChild(buttonDel);
      buttonDel.addEventListener('click', deleteBook);
      buttonDel.className = 'fas fa-trash';
    }
  } else {
    const container = document.getElementById('container');
    container.querySelectorAll('div').forEach((n) => n.remove());
  }
});
function deleteBook(event) {
  dbLibraryRef.child(`${event.target.parentNode.parentNode.id}`).remove();
}
function changeRead(event) {
  dbLibraryRef
    .child(`${event.target.parentNode.parentNode.id}/read`)
    .once('value')
    .then((snapshot) => {
      if (snapshot.val() === 'unread') {
        dbLibraryRef
          .child(`${event.target.parentNode.parentNode.id}`)
          .update({ read: 'read' });
      } else {
        dbLibraryRef
          .child(`${event.target.parentNode.parentNode.id}`)
          .update({ read: 'unread' });
      }
    });
}
function openForm() {
  document.getElementsByClassName('form')[0].style.display = 'flex';
}
function closeForm() {
  document.getElementsByClassName('form')[0].style.display = 'none';
}
