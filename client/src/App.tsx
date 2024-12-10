import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
<<<<<<< HEAD
=======
import SearchBooks from './pages/SearchBooks';
import './App.css';
>>>>>>> 08a4a89a73adfb3298c0352d1be62a5fcc3db371

function App() {
  return (
    <div className="App">
      <Navbar />
<<<<<<< HEAD
      <main>
        <h1>Welcome to My Library Bookie</h1>
      </main>
=======
      <Routes>
        <Route path="/" element={<SearchBooks />} />
        {/* Add other routes as needed */}
      </Routes>
>>>>>>> 08a4a89a73adfb3298c0352d1be62a5fcc3db371
    </div>
  );
}

export default App;