import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/books';

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    publishYear: '',
    isbn: '',
    quantity: '',
    description: ''
  });

  const fetchBooks = async (keyword = '') => {
    try {
      const url = keyword ? `${API_URL}?search=${keyword}` : API_URL;
      const response = await axios.get(url);
      setBooks(response.data);
    } catch (error) {
      console.error('Loi khi lay danh sach sach:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchBooks(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        publishYear: Number(formData.publishYear),
        quantity: Number(formData.quantity)
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        alert('Cap nhat sach thanh cong!');
      } else {
        await axios.post(API_URL, payload);
        alert('Them sach moi thanh cong!');
      }

      resetForm();
      fetchBooks(search);
    } catch (error) {
      alert(error.response?.data?.message || 'Co loi xay ra!');
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setFormData({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      category: book.category,
      publisher: book.publisher,
      publishYear: book.publishYear,
      isbn: book.isbn,
      quantity: book.quantity,
      description: book.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Ban co chac chan muon xoa sach nay?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert('Xoa sach thanh cong!');
        fetchBooks(search);
      } catch (error) {
        alert('Loi khi xoa sach!');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      bookId: '',
      title: '',
      author: '',
      category: '',
      publisher: '',
      publishYear: '',
      isbn: '',
      quantity: '',
      description: ''
    });
  };

  return (
    <div className="container">
      <h1>HỆ THỐNG QUẢN LÝ SÁCH</h1>
      <div className="student-info">
        Sinh viên thực hiện: Nguyễn Tuấn Kiệt - MSSV: s234795
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input name="bookId" placeholder="Mã sách (bookId)" value={formData.bookId} onChange={handleChange} required disabled={!!editingId} />
          <input name="title" placeholder="Tên sách" value={formData.title} onChange={handleChange} required />
          <input name="author" placeholder="Tác giả" value={formData.author} onChange={handleChange} required />
          <input name="category" placeholder="Thể loại" value={formData.category} onChange={handleChange} required />
          <input name="publisher" placeholder="Nhà xuất bản" value={formData.publisher} onChange={handleChange} required />
          <input name="publishYear" type="number" placeholder="Năm xuất bản" value={formData.publishYear} onChange={handleChange} required />
          <input name="isbn" placeholder="Mã ISBN" value={formData.isbn} onChange={handleChange} required />
          <input name="quantity" type="number" placeholder="Số lượng" value={formData.quantity} onChange={handleChange} required />
          <input name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} />
        </div>
        <div className="form-actions">
          {editingId ? (
            <>
              <button type="submit" className="btn-update">Cập nhật</button>
              <button type="button" className="btn-cancel" onClick={resetForm}>Hủy</button>
            </>
          ) : (
            <button type="submit" className="btn-add">Thêm sách mới</button>
          )}
        </div>
      </form>

      <input
        type="text"
        className="search-box"
        placeholder="Tìm kiếm sách theo tên, tác giả hoặc thể loại..."
        value={search}
        onChange={handleSearchChange}
      />

      <table>
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>NXB</th>
            <th>Số lượng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book._id}>
                <td>{book.bookId}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.publisher}</td>
                <td>{book.quantity}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(book)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(book._id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>Không tìm thấy sách nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;