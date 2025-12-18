import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardScreen() {
  const [bookData, setBookData] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get('/api/book', {
        headers: { 'Authorization': `bearer ${token}` }
      });
      setBookData(response.data);
    } catch (error) {
      console.error("Error fetching data for dashboard", error);
    }
  };

  const categories = [...new Set(bookData.map(book => book.category?.name || 'ทั่วไป'))];

  const stockByCategories = categories.map(catName => {
    return bookData
      .filter(book => (book.category?.name || 'ทั่วไป') === catName)
      .reduce((sum, book) => sum + (Number(book.stock) || 0), 0);
  });

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'จำนวนสต็อกรวม (เล่ม)',
        data: stockByCategories,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true, 
        text: 'สรุปยอดสต็อกหนังสือคงเหลือแยกตามหมวดหมู่', 
        font: { size: 22, weight: 'bold' } 
      },
    },
    scales: {
      x: { 
        beginAtZero: true,
        title: { display: true, text: 'จำนวนเล่มทั้งหมดในสต็อก', font: { weight: 'bold' } }
      },
      y: { 
        title: { display: true, text: 'หมวดหมู่', font: { weight: 'bold' } },
        ticks: { font: { size: 14 } }
      }
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '12px',
        width: '100%'
      }}>
       
        <div style={{ height: '500px', width: '100%' }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}