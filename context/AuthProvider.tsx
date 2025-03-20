import { createContext, useState, useEffect, ReactNode } from "react";
import { FIREBASE_AUTH } from "@/config/firebaseConfig";
import { signIn, signUp, logout } from "@/services/authService";
import { User, onAuthStateChanged } from "firebase/auth";
import useFetch from "@/hooks/useFetch";
import { getSavedMovies } from "@/services/movieService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchSavedMovies: () => void;
  savedMovies: MoviesSaved[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMovies, setSavedMovies] = useState<MoviesSaved[]>([]);

  const fetchSavedMovies = async () => {
    if (user) {
      const movies = await getSavedMovies(user);
      setSavedMovies(movies!);
    }
  };

  useEffect(() => {
    if (user){
      fetchSavedMovies()
    }else{
      console.log("No users to fetch")
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    fetchSavedMovies,
    savedMovies,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
