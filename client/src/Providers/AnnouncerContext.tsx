import { createContext, useContext, useState, useCallback } from 'react';

type AnnouncerContextType = {
  announce: (message: string) => void;
};

const AnnouncerContext = createContext<AnnouncerContextType | undefined>(undefined);

export function LiveAnnouncer({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');

  const announce = useCallback((newMessage: string) => {
    setMessage(newMessage);
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      <div role="status" aria-live="polite" className="sr-only">
        {message}
      </div>
    </AnnouncerContext.Provider>
  );
}

export function useLiveAnnouncer() {
  const context = useContext(AnnouncerContext);
  if (context === undefined) {
    throw new Error('useLiveAnnouncer must be used within a LiveAnnouncer');
  }
  return context;
}

// Export both names for compatibility
export const AnnouncerProvider = LiveAnnouncer;
export default LiveAnnouncer;
