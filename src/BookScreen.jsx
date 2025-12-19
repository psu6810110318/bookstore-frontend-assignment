import './App.css'
import { useState, useEffect } from 'react';
import { Divider, Spin, message, Button } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate
import axios from 'axios'
import BookList from './components/BookList'
// ลบ Import AddBook, EditBook ออกได้เลย เพราะไม่ได้ใช้ในหน้านี้แล้ว

const URL_BOOK = "/api/book"

function BookScreen() {
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ประกาศ hook

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

  // ย้าย Logic การ Add/Edit ไปที่ BookFormScreen หมดแล้ว 
  // เหลือแค่ฟังก์ชัน Like กับ Delete ไว้ที่นี่

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

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1em" }}>
        <h2>รายการหนังสือ (Books List)</h2>
        {/* เปลี่ยนปุ่ม Add ให้ไปหน้าใหม่ */}
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => navigate('/books/add')}
        >
          Add New Book
        </Button>
      </div>

      <Spin spinning={loading}>
        <BookList 
          data={bookData.map(book => ({
            ...book,
            isLiked: JSON.parse(localStorage.getItem('likedBooks') || '[]').includes(book.id)
          }))} 
          onLiked={handleLikeBook}
          onDeleted={handleDeleteBook}
          // เปลี่ยน onEdit ให้ไปหน้า Edit พร้อม ID
          onEdit={(book) => navigate(`/books/edit/${book.id}`)}
        />
      </Spin>
    </>
  )
}

export default BookScreen