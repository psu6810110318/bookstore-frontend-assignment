import './App.css'
import { useState, useEffect } from 'react';
import { Divider, Spin, message } from 'antd'; 
import axios from 'axios'
import BookList from './components/BookList'
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';

const URL_BOOK = "/api/book"
const URL_CATEGORY = "/api/book-category"

function BookScreen() {
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editBook, setEditBook] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(URL_CATEGORY);
      setCategories(response.data.map(cat => ({
        label: cat.name,
        value: cat.id
      })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_BOOK);
      setBookData(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddBook = async (book) => {
    setLoading(true)
    try {
      const response = await axios.post(URL_BOOK, book);
      fetchBooks();
      message.success('เพิ่มหนังสือสำเร็จ');
    } catch (error) {
      console.error('Error adding book:', error);
      message.error('เพิ่มหนังสือไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  const handleLikeBook = async (book) => {
    const likedBooks = JSON.parse(localStorage.getItem('likedBooks') || '[]');
    const isAlreadyLiked = likedBooks.includes(book.id);

    setLoading(true)
    try {
      const newLikeCount = isAlreadyLiked 
        ? Math.max(0, book.likeCount - 1) 
        : book.likeCount + 1;

      await axios.patch(URL_BOOK + `/${book.id}`, { likeCount: newLikeCount });
      
      let newLikedBooks;
      if (isAlreadyLiked) {
        newLikedBooks = likedBooks.filter(id => id !== book.id);
        message.info('ยกเลิกการถูกใจแล้ว');
      } else {
        newLikedBooks = [...likedBooks, book.id];
        message.success('ถูกใจหนังสือเล่มนี้แล้ว');
      }
      
      localStorage.setItem('likedBooks', JSON.stringify(newLikedBooks));
      fetchBooks();
    } catch (error) {
      console.error('Error liking book:', error);
      message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteBook = async (bookId) => {
    setLoading(true)
    try {
      await axios.delete(URL_BOOK + `/${bookId}`);
      fetchBooks();
      message.success('ลบหนังสือสำเร็จ');
    } catch (error) {
      console.error('Error deleting book:', error);
      message.error('ลบหนังสือไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  // --- จุดที่แก้ไขหลัก ---
  const handleEditBook = async (book) => {
    setLoading(true)
    try {
      // สร้าง object ใหม่ที่ระบุเฉพาะ field ที่ Backend ต้องการจริงๆ
      // เพื่อป้องกัน field ส่วนเกินเช่น isLiked, category object, createdAt ฯลฯ ติดไป
      const dataPayload = {
        title: book.title,
        author: book.author,
        price: Number(book.price),
        stock: Number(book.stock),
        categoryId: book.categoryId, // ค่านี้ต้องมาจาก form ใน EditBook
        isbn: book.isbn,
        description: book.description,
        coverUrl: book.coverUrl
      }

      await axios.patch(URL_BOOK + `/${book.id}`, dataPayload);
      fetchBooks();
      message.success('แก้ไขข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error editing book:', error);
      message.error('แก้ไขข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
      setEditBook(null);
    }
  }
  // ---------------------

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2em" }}>
        <AddBook categories={categories} onBookAdded={handleAddBook}/>
      </div>
      <Divider>
        My Books List
      </Divider>
      <Spin spinning={loading}>
        <BookList 
          data={bookData.map(book => ({
            ...book,
            // Map isLiked สำหรับแสดงผล แต่ตอนส่งกลับต้องระวังอย่าให้ติดไป
            isLiked: JSON.parse(localStorage.getItem('likedBooks') || '[]').includes(book.id)
          }))} 
          onLiked={handleLikeBook}
          onDeleted={handleDeleteBook}
          onEdit={book => setEditBook(book)}
        />
      </Spin>
      <EditBook 
        book={editBook} 
        categories={categories} 
        open={editBook !== null} 
        onCancel={() => setEditBook(null)} 
        onSave={handleEditBook} />
    </>
  )
}

export default BookScreen