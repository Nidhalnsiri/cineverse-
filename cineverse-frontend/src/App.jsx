import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import Cinemas from './pages/Cinemas';
import MyReservations from './pages/MyReservations';
import MyList from './pages/MyList';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/booking/:sessionId" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cinemas" element={<Cinemas />} />
              <Route path="/reservations" element={<MyReservations />} />
              <Route path="/mylist" element={<MyList />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
