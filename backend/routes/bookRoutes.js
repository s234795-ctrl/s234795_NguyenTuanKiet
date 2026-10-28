const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /api/books & Search API (GET /api/books?search=keyword)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const books = await Book.find(query);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Loi server khi lay danh sach sach', error: error.message });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Khong tim thay sach' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Loi server', error: error.message });
  }
});

// POST /api/books
router.post('/', async (req, res) => {
  try {
    const { bookId, title, author, category, publisher, publishYear, isbn, quantity, description } = req.body;

    if (!bookId || !title || !author || !category || !publisher || !publishYear || !isbn || quantity === undefined) {
      return res.status(400).json({ message: 'Vui long dien day du thong tin bat buoc' });
    }

    const existingBook = await Book.findOne({ bookId });
    if (existingBook) {
      return res.status(400).json({ message: 'Ma sach (bookId) da ton tai' });
    }

    const newBook = new Book({ bookId, title, author, category, publisher, publishYear, isbn, quantity, description });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Khong the them sach', error: error.message });
  }
});

// PUT /api/books/:id
router.put('/:id', async (req, res) => {
  try {
    const { bookId, title, author, category, publisher, publishYear, isbn, quantity, description } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ message: 'Du lieu khong hop le' });
    }

    if (bookId) {
      const duplicateBook = await Book.findOne({ bookId, _id: { $ne: req.params.id } });
      if (duplicateBook) {
        return res.status(400).json({ message: 'Ma sach (bookId) da ton tai o ban ghi khac' });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { bookId, title, author, category, publisher, publishYear, isbn, quantity, description },
      { new: true, runValidators: true }
    );

    if (!updatedBook) return res.status(404).json({ message: 'Khong tim thay sach de cap nhat' });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Loi server khi cap nhat', error: error.message });
  }
});

// DELETE /api/books/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Khong tim thay sach de xoa' });
    res.status(200).json({ message: 'Xoa sach thanh cong' });
  } catch (error) {
    res.status(500).json({ message: 'Loi server khi xoa', error: error.message });
  }
});

module.exports = router;