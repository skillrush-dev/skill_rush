// src/App.tsx (edited header + game loader wiring)
import React, { useState, useEffect } from 'react';
import './i18n'; // initialize i18next
import { useTranslation } from "react-i18next";
import LanguageSwitcher from './components/LanguageSwitcher';
import Home from './pages/home';
import Login from './components/login';
import RegisterPage from './pages/register';
import Dashboard from './pages/dashboard';
import InteractiveButton from './components/InteractiveButton';
import TutorialModal from './components/TutorialModal';
import { GAMES } from './games';
import GameLoader from './games/GameLoader';
import StartLearning from "./pages/StartLearning";

type Page = 'home' | 'login' | 'register' | 'dashboard' | 'game' | 'profile' | 'teacher' | 'learning';

export default function App(): JSX.Element {
  const { i18n } = useTranslation();
  const [page, setPage] = useState<Page>('home');
  const [student, setStudent] = useState<any | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [currentGameKey, setCurrentGameKey] = useState<string | null>(null);
  const [learningSubject, setLearningSubject] = useState<{ subject: string } | null>(null);

  useEffect(() => {
    // sync initial language from storage
    const lang = localStorage.getItem("skill_rush_lang");
    if (lang && i18n.language !== lang) i18n.changeLanguage(lang);
  }, [i18n]);

  function handleLogin(s: any) {
    setStudent(s);
    setPage('dashboard');
  }

  function handleLogout() {
    setStudent(null);
    setPage('home');
  }

  function startGame(key: string) {
    setCurrentGameKey(key);
    setPage('game');
  }

  function endGame() {
    setCurrentGameKey(null);
    setPage('dashboard');
  }

  const currentGameMeta = GAMES.find(g => g.key === currentGameKey) ?? null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <div className="text-2xl font-semibold text-slate-800">Skill_Rush</div>
              <div className="text-xs text-slate-500 -mt-0.5">Gamified STEM for Class 6–12</div>
            </div>

            <nav className="flex items-center gap-3">
              <button className="text-slate-600 hover:text-slate-900 px-3 py-1 rounded-md" onClick={() => setPage('home')}>Home</button>
              <LanguageSwitcher onChange={() => {}} />
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {page === 'home' && <Home onOpenLogin={() => setPage('login')} onOpenRegister={() => setPage('register')} onOpenTutorial={() => setTutorialOpen(true)} />}

        {page === 'login' && <Login onLogin={(s: any) => handleLogin(s)} />}
        {page === 'register' && <RegisterPage onRegistered={(s: any) => handleLogin(s)} />}

        {page === 'dashboard' && student && <Dashboard student={student} onStartGame={(key:string)=>startGame(key)} />}

        {page === 'learning' && learningSubject && (
          <StartLearning subjectKey={learningSubject.subject} language={localStorage.getItem("skill_rush_lang") || "en"} onClose={() => { setLearningSubject(null); setPage('dashboard'); }} />
        )}

        {page === 'game' && student && currentGameMeta && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{currentGameMeta.title}</h3>
              <button className="text-sm text-slate-500 hover:underline" onClick={endGame}>Exit game</button>
            </div>

            {/* Pass an onLearn callback into the loaded game component */}
            <GameLoader loader={currentGameMeta.loader} gameProps={{
              studentId: student.id,
              onEnd: endGame,
              onLearn: () => {
                // open learning for maths (or map gameKey->subject)
                setLearningSubject({ subject: "maths" });
                setPage('learning');
              }
            }} />
          </div>
        )}
      </main>

      <TutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </div>
  );
}
