import { nanoid } from 'nanoid';
import { books } from '../data/books.js';

export const getBooks = (request, res) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const BooksFilterByName = books.filter((book) => {
      const regexNameBook = new RegExp(name, 'gi');
      return regexNameBook.test(book.name);
    });

    return res
      .response({
        status: 'success',
        data: {
          books: BooksFilterByName?.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  }

  if (reading) {
    const BooksFilterByReading = books.filter(
      (book) => Number(book.reading) === Number(reading)
    );

    return res
      .response({
        status: 'success',
        data: {
          books: BooksFilterByReading?.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  }

  if (finished) {
    const BooksFilterByFinished = books.filter(
      (book) => Number(book.finished) === Number(finished)
    );
    return res
      .response({
        status: 'success',
        data: {
          books: BooksFilterByFinished?.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  }

  if (!name && !reading && !finished) {
    return res
      .response({
        status: 'success',
        data: {
          books: books?.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  }
};

export const createBook = (request, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return res
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return res
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return res
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    .code(201);
};

export const getDetailBook = (request, res) => {
  const { bookId } = request.params;
  const bookDetail = books.find((book) => book.id === bookId);

  if (!bookDetail) {
    return res
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
  }

  return res
    .response({
      status: 'success',
      data: {
        book: bookDetail,
      },
    })
    .code(200);
};

export const updateBook = (request, res) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return res
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return res
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return res
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
  }
  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: pageCount === readPage,
    updatedAt: new Date().toISOString(),
  };

  return res
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    .code(200);
};

export const deleteBook = (request, res) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) {
    return res
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
  }
  books.splice(bookIndex, 1);
  return res
    .response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    .code(200);
};
