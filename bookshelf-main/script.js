const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';

document.addEventListener('DOMContentLoaded', function () {
  const submit = document.getElementById('form');
  submit.addEventListener("submit", function (event) {
    event.preventDefault();
    Swal.fire({
      title: 'apakah mau disimpan',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success')
        addBook();
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});


function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(books);
  console.log('succes')
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addBook() {
  const title = document.getElementById('JudulBuku').value;
  const authors = document.getElementById('PengarangBuku').value;
  const years = document.getElementById('TahunBuku').value;
  const isCompleted = document.getElementById('inputBuku').checked;

  const generateID = generateId();
  const bookInput = generateBookObject(generateID, title, authors, years, isCompleted);
  books.push(bookInput);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, authors, years, isCompleted) {
  return {
    id,
    title,
    authors,
    years,
    isCompleted
  }
}

function subBook(bookInput) {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookInput.title;

  const authorTitle = document.createElement('p');
  authorTitle.innerText = 'Pengarang Buku : ' + bookInput.authors;

  const yearTitle = document.createElement('p');
  yearTitle.innerText = 'Tahun Buku : ' + bookInput.years;

  const container = document.createElement('article');
  container.append(bookTitle, authorTitle, yearTitle);
  container.setAttribute('class', `book_item-${bookInput.id}`);

  if (bookInput.isCompleted) {
    const Button = document.createElement('span');
    Button.setAttribute('class', 'material-symbols-outlined button-refresh');
    Button.innerText = 'refresh';

    Button.addEventListener('click', function () {
      Swal.fire({
        title: 'APAKAH ANDA YAKIN?',
        text: "APAKAH ANDA INGIN MENGULANG BUKU INI?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'MENGULANGI'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'success'
          )
          undoTaskFromCompleted(bookInput.id);
        }
      })

    });

    const trashButton = document.createElement('span');
    trashButton.setAttribute('class', 'material-symbols-outlined button-trash');
    trashButton.innerText = 'delete';

    trashButton.addEventListener('click', function () {
      Swal.fire({
        title: 'APAKAH ANDA YAKIN?',
        text: "ANDA AKAN MENGHAPUS DAFTAR BUKU!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'HAPUS'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'success'
          )
          removeTaskFromCompleted(bookInput.id);
        }
      })
    });

    container.append(Button, trashButton);
  } else {
    const checkButton = document.createElement('span');
    checkButton.setAttribute('class', 'material-symbols-outlined button-check');
    checkButton.innerText = 'check';

    checkButton.addEventListener('click', function () {
      Swal.fire({
        title: 'APAKAH ANDA YAKIN?',
        text: "APAKAH ANDA SUDAH MEMBACA BUKU?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YAKIN'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'success'
          )
          addTaskToCompleted(bookInput.id);
        }
      })

    });

    const trashButton = document.createElement('span');
    trashButton.setAttribute('class', 'material-symbols-outlined button-trash');
    trashButton.innerText = 'delete';

    trashButton.addEventListener('click', function () {
      Swal.fire({
        title: 'APAKAH ADA YAKIN',
        text: "ANDA AKAN MENGHAPUS DAFTAR BUKU!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
          )
          removeTaskFromCompleted(bookInput.id);
        }
      })
    });
    container.append(checkButton, trashButton);
  }
  return container;
};

document.getElementById('cari')
  .addEventListener('submit', function (e) {
      e.preventDefault();
      const cariBuku = document.getElementById('search').value.toLowerCase();
      const list = document.querySelectorAll('.book_item > h3');
      for (const book of list) {
        if (book.innerText.toLowerCase().includes(cariBuku)) {
          book.parentElement.parentElement.style.display = 'block';
        } else {
          book.parentElement.parentElement.style.display = 'none';
        }
      }
      });

    function addTaskToCompleted(bookId) {
      const bookTarget = findbook(bookId);
      if (bookTarget == null) return;

      bookTarget.isCompleted = true;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    };

    function findbook(bookId) {
      for (const bookItem of books) {
        if (bookItem.id === bookId) {
          return bookItem;
        }
      }
      return null;
    };

    function removeTaskFromCompleted(bookId) {
      const bookTarget = findbookIndex(bookId);
      if (bookTarget === -1) return;
      books.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    };


    function undoTaskFromCompleted(bookId) {
      const bookTarget = findbook(bookId);
      if (bookTarget == null) return;
      bookTarget.isCompleted = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData()
    }

    function findbookIndex(bookId) {
      for (index in books) {
        if (books[index].id === bookId) {
          return index
        }
      }
      return -1
    };



    document.addEventListener(RENDER_EVENT, function () {

      const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
      incompleteBookshelfList.innerHTML = '';

      const completedBook = document.getElementById('completeBookshelfList');
      completedBook.innerHTML = '';

      for (booksItem of books) {
        const bookElement = subBook(booksItem);
        if (!booksItem.isCompleted) {
          incompleteBookshelfList.append(bookElement);
        } else {
          completedBook.append(bookElement);
        }
      }
    });