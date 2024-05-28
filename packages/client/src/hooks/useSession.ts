import { create } from 'zustand';

export const SESSION_STORAGE_KEY = 'session-context';

interface Session {
  id: string;
  email: string;
  name: string;
  token: string;
  createdOn?: number;
}

interface SessionState {
  session: Session | null;

  login: (newSession: Omit<Session, 'createdOn'>) => void;
  logout: () => void;
  restoreSessionFromLocalStorage: () => void;
}

const useSession = create<SessionState>((set) => ({
  session: (() => {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    return storedSession ? JSON.parse(storedSession) as Session : null;
  })(),

  login: (newSession) => {
    const sessionWithTimestamp = {
      ...newSession,
      createdOn: new Date().getTime(),
    };
    set({ session: sessionWithTimestamp });
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionWithTimestamp));
  },

  logout: () => {
    set({ session: null });
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  restoreSessionFromLocalStorage: () => {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSession) {
      set({ session: JSON.parse(storedSession) as Session });
    }
  },
}));

export default useSession;
