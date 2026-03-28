import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { movies } from "@/data/movies";

interface CustomMovie {
  id: string;
  title: string;
  year: string;
  genre: string;
  color: string;
  runtime?: string;
  rating?: string;
  description?: string;
}

type MovieType = typeof movies[0] | CustomMovie;

interface WatchedMovie {
  id: string;
  movieName: string;
  watchedDate: string;
  watchedWith: string;
  addedAt: number;
}

interface StoreState {
  storeName: string;
  setStoreName: (name: string) => void;
  selectedSnacks: string[];
  toggleSnack: (snack: string) => void;
  selectedMovie: MovieType | null;
  setSelectedMovie: (movie: MovieType | null) => void;
  customMovies: CustomMovie[];
  setCustomMovies: (movies: CustomMovie[]) => void;
  useCustomMovies: boolean;
  setUseCustomMovies: (use: boolean) => void;
  watchedMovies: WatchedMovie[];
  addWatchedMovie: (movie: Omit<WatchedMovie, 'id' | 'addedAt'>) => void;
  deleteWatchedMovie: (id: string) => void;
  clearWatchedMovies: () => void;
}

function useStoreState(): StoreState {
  const [storeName, setStoreName] = useState<string>("MY VIDEO RENTAL");
  const [selectedSnacks, setSelectedSnacks] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);
  const [customMovies, setCustomMovies] = useState<CustomMovie[]>([]);
  const [useCustomMovies, setUseCustomMovies] = useState<boolean>(false);
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);

  const handleSetStoreName = useCallback(async (name: string) => {
    setStoreName(name);
    try {
      await AsyncStorage.setItem("storeName", name);
    } catch {
      
    }
  }, []);

  const handleSetCustomMovies = useCallback(async (movies: CustomMovie[]) => {
    setCustomMovies(movies);
    try {
      await AsyncStorage.setItem("customMovies", JSON.stringify(movies));
    } catch {
      
    }
  }, []);

  const handleSetUseCustomMovies = useCallback(async (use: boolean) => {
    setUseCustomMovies(use);
    try {
      await AsyncStorage.setItem("useCustomMovies", JSON.stringify(use));
    } catch {
      
    }
  }, []);

  const toggleSnack = useCallback((snack: string) => {
    setSelectedSnacks((prev) =>
      prev.includes(snack)
        ? prev.filter((s) => s !== snack)
        : [...prev, snack]
    );
  }, []);

  const addWatchedMovie = useCallback(async (movie: Omit<WatchedMovie, 'id' | 'addedAt'>) => {
    const newMovie: WatchedMovie = {
      ...movie,
      id: Date.now().toString(),
      addedAt: Date.now(),
    };
    
    setWatchedMovies((prev) => {
      const updated = [newMovie, ...prev].slice(0, 365);
      AsyncStorage.setItem('watchedMovies', JSON.stringify(updated)).catch(() => {
        
      });
      return updated;
    });
  }, []);

  const deleteWatchedMovie = useCallback(async (id: string) => {
    setWatchedMovies((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      AsyncStorage.setItem('watchedMovies', JSON.stringify(updated)).catch(() => {
        
      });
      return updated;
    });
  }, []);

  const clearWatchedMovies = useCallback(async () => {
    setWatchedMovies([]);
    try {
      await AsyncStorage.removeItem('watchedMovies');
    } catch {
      
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedStoreName, savedCustomMovies, savedUseCustomMovies, savedWatchedMovies] = await Promise.all([
          AsyncStorage.getItem("storeName"),
          AsyncStorage.getItem("customMovies"),
          AsyncStorage.getItem("useCustomMovies"),
          AsyncStorage.getItem("watchedMovies")
        ]);
        
        if (savedStoreName) {
          setStoreName(savedStoreName);
        }
        if (savedCustomMovies) {
          try {
            const parsed = JSON.parse(savedCustomMovies);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCustomMovies(parsed);
            }
          } catch {
            await AsyncStorage.removeItem("customMovies");
            setCustomMovies([]);
          }
        }
        if (savedUseCustomMovies) {
          try {
            const parsed = JSON.parse(savedUseCustomMovies);
            if (typeof parsed === 'boolean') {
              setUseCustomMovies(parsed);
            }
          } catch {
            await AsyncStorage.removeItem("useCustomMovies");
            setUseCustomMovies(false);
          }
        }
        if (savedWatchedMovies) {
          try {
            const parsed = JSON.parse(savedWatchedMovies);
            if (Array.isArray(parsed)) {
              setWatchedMovies(parsed.slice(0, 365));
            }
          } catch {
            await AsyncStorage.removeItem("watchedMovies");
            setWatchedMovies([]);
          }
        }
      } catch {
        
      }
    };
    
    loadData();
  }, []);

  return {
    storeName,
    setStoreName: handleSetStoreName,
    selectedSnacks,
    toggleSnack,
    selectedMovie,
    setSelectedMovie,
    customMovies,
    setCustomMovies: handleSetCustomMovies,
    useCustomMovies,
    setUseCustomMovies: handleSetUseCustomMovies,
    watchedMovies,
    addWatchedMovie,
    deleteWatchedMovie,
    clearWatchedMovies,
  };
}

export const [StoreProvider, useStore] = createContextHook(useStoreState);
