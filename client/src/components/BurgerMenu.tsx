import React from 'react';
import { Menu, X, Mail, Home, Bot, Languages } from 'lucide-react';

interface BurgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  currentLang: string;
  onLanguageToggle: () => void;
  t: {
    nav: {
      home: string;
      features: string;
      contact: string;
    };
  };
  contactEmail: string;
}

export function BurgerMenu({ isOpen, onToggle, currentLang, onLanguageToggle, t, contactEmail }: BurgerMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="text-white hover:text-gray-300 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-16 w-48 bg-black/90 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden">
          <nav className="py-2">
            <button
              onClick={onLanguageToggle}
              className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Languages size={20} />
              <img 
                src={currentLang === 'en' ? 
                  'https://flagcdn.com/w40/br.png' : 
                  'https://flagcdn.com/w40/us.png'
                } 
                alt={currentLang === 'en' ? 'Brazilian flag' : 'US flag'} 
                className="w-6 h-4 grayscale"
              />
              {currentLang === 'en' ? 'Português' : 'English'}
            </button>
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 transition-colors">
              <Home size={20} />
              {t.nav.home}
            </a>
            <a href="#features" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 transition-colors">
              <Bot size={20} />
              {t.nav.features}
            </a>
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 transition-colors">
              <Mail size={20} />
              {t.nav.contact}
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
