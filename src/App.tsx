// src/App.tsx
import React, { useState } from 'react';
import Home from './pages/home.tsx';
import Login from './components/login.tsx';
import RegisterPage from './pages/register.tsx';
import Dashboard from './pages/dashboard.tsx';
import KattappaGame from './games/KattappaGame.tsx';

type Page = 'home' | 'login' | 'register' | 'dashboard' | 'game' | 'profile';

export default function App(): JSX.Element {
  const [page, setPage] = useState<Page>('home');
  const [student, setStudent] = useState<any | null>(null);

  function handleLogin(s: any) {
    setStudent(s);
    setPage('dashboard');
  }

  function handleLogout() {
    setStudent(null);
    setPage('home');
  }

  return (
    <div>
      <nav className="navbar bg-light mb-3">
        <div className="container-fluid">
          <span className="navbar-brand">skill_rush</span>
          <div className="d-flex gap-2 align-items-center">
            <button className="btn btn-outline-primary" onClick={() => setPage('home')}>Home</button>
            {!student && <button className="btn btn-primary" onClick={() => setPage('login')}>Login</button>}
            {!student && <button className="btn btn-success" onClick={() => setPage('register')}>Register</button>}
            {student && <button className="btn btn-secondary" onClick={() => setPage('dashboard')}>Dashboard</button>}
            {student && <button className="btn btn-danger" onClick={handleLogout}>Logout</button>}
          </div>
        </div>
      </nav>

      <div className="container">
        {page === 'home' && <Home onOpenLogin={() => setPage('login')} onOpenRegister={() => setPage('register')} />}
        {page === 'login' && <Login onLogin={(s: any) => handleLogin(s)} />}
        {page === 'register' && <RegisterPage onRegistered={(s: any) => handleLogin(s)} />}
        {page === 'dashboard' && student && <Dashboard student={student} onPlay={() => setPage('game')} />}
        {page === 'game' && student && <KattappaGame studentId={student.id} onEnd={() => setPage('dashboard')} />}
      </div>
    </div>
  );
}
