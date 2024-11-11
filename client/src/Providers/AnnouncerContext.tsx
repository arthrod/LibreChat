import { createContext, useContext } from 'react';

interface AnnouncerContextType {
  announcePolite: (options: { message: string; isStatus?: boolean }) => void;
  announceAssertive: (options: { message: string; isStatus?: boolean }) => void;
}

const AnnouncerContext = createContext<AnnouncerContextType>({
  announcePolite: () => {},
  announceAssertive: () => {},
});

export function useLiveAnnouncer() {
  const context = useContext(AnnouncerContext);
  return context;
}

export default AnnouncerContext;
