// src/App.tsx
import React, { useState } from 'react';
import Home from './pages/home.tsx';
import Login from './components/login.tsx';
import RegisterPage from './pages/register.tsx';
import Dashboard from './pages/dashboard.tsx';
import KattappaGame from './games/KattappaGame.tsx';
import InteractiveButton from './components/InteractiveButton.tsx';
import TutorialModal from './components/TutorialModal.tsx';

type Page = 'home' | 'login' | 'register' | 'dashboard' | 'game' | 'profile' | 'teacher';

export default function App(): JSX.Element {
  const [page, setPage] = useState<Page>('home');
  const [student, setStudent] = useState<any | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  function handleLogin(s: any) {
    setStudent(s);
    setPage('dashboard');
  }

  function handleLogout() {
    setStudent(null);
    setPage('home');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Removed circular icon - now only site title */}
            <div>
              <div className="text-2xl font-semibold text-slate-800">Skill_Rush</div>
              <div className="text-xs text-slate-500 -mt-0.5">Gamified STEM for Class 1</div>
            </div>

            <nav className="flex items-center gap-3">
              <button className="text-slate-600 hover:text-slate-900 px-3 py-1 rounded-md" onClick={() => setPage('home')}>Home</button>

              {!student && (
                <>
                  <InteractiveButton variant="ghost" onClick={() => setPage('login')}>Login</InteractiveButton>
                  <InteractiveButton variant="primary" onClick={() => setPage('register')}>Register</InteractiveButton>
                </>
              )}

              {student && (
                <>
                  <button className="text-slate-600 hover:text-slate-900 px-3 py-1 rounded-md" onClick={() => setPage('dashboard')}>Dashboard</button>
                  <InteractiveButton variant="secondary" onClick={handleLogout}>Logout</InteractiveButton>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {page === 'home' && <Home onOpenLogin={() => setPage('login')} onOpenRegister={() => setPage('register')} onOpenTutorial={() => setTutorialOpen(true)} />}
        {page === 'login' && <Login onLogin={(s: any) => handleLogin(s)} />}
        {page === 'register' && <RegisterPage onRegistered={(s: any) => handleLogin(s)} />}
        {page === 'dashboard' && student && <Dashboard student={student} onPlay={() => setPage('game')} />}
        {page === 'game' && student && <KattappaGame studentId={student.id} onEnd={() => setPage('dashboard')} />}
      </main>

      <TutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </div>
  );
}
