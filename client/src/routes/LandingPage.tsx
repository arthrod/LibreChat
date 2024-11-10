import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Canvas } from '../components/Canvas';
import { BurgerMenu } from '../components/BurgerMenu';
import { Features } from '../components/Features';
import { translations } from './Landing/translations';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial language based on browser preference
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('pt')) {
      setLang('pt');
    }
  }, []);

  const t = translations[lang as keyof typeof translations];
  const contactEmail = lang === 'en' ? 'contact@cicero.chat' : 'contato@cicero.chat';

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'pt' : 'en');
    setIsMenuOpen(false);
  };

  const handleTryNow = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <Canvas className="fixed inset-0 w-full h-full z-0" />
      
      <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center p-6">
        <div className="text-2xl font-bold">CICERO</div>
        <BurgerMenu
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
          currentLang={lang}
          onLanguageToggle={toggleLanguage}
          t={t}
          contactEmail={contactEmail}
        />
      </header>

      <main className="relative z-1 min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{t.hero.title}</h1>
        <p className="text-xl md:text-2xl mb-8">{t.hero.subtitle}</p>
        <button 
          onClick={handleTryNow}
          className="px-6 py-3 bg-white text-black text-base font-semibold rounded-lg hover:bg-gray-100 transition-colors">
          {t.hero.tryNow}
        </button>
      </main>

      <Features t={t} />

      <footer className="py-16 bg-black/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            CICERO
          </h2>
          <div className="flex justify-center items-center gap-8">
            <a href={`mailto:${contactEmail}`} className="text-white hover:text-red-500 transition-colors">
              <Mail size={24} />
            </a>
            <a href="https://www.linkedin.com/company/cicero-contracts" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500 transition-colors">
              <i className="fab fa-linkedin-in text-2xl"></i>
            </a>
            <a href="https://wa.me/1234567890" className="text-white hover:text-red-500 transition-colors">
              <i className="fab fa-whatsapp text-2xl"></i>
            </a>
          </div>
          <p className="mt-6 text-gray-400">© {new Date().getFullYear()} Cicero. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
