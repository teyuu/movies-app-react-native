import { FIREBASE_DB } from "@/config/firebaseConfig";

import { collection, query as firestoreQuery, where, getDocs, updateDoc, addDoc, doc, query, orderBy, limit, setDoc, Timestamp, getDoc, deleteDoc } from "firebase/firestore";
import { fetchMovieById } from "./api";

export const updateSearchCount = async (query: string, movie: Movie, user: any) => {

  try {
    if (!user) {
      console.log("not user")
      throw new Error("User not authenticated");
    }

    const moviesCollection = collection(FIREBASE_DB, "movies");

    const searchQuery = firestoreQuery(
      moviesCollection,
      where("searchTerm", "==", query),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(searchQuery);

    if (!querySnapshot.empty) {
      // Movie already exists, update count
      const existingMovieDoc = querySnapshot.docs[0];
      const existingMovieRef = doc(FIREBASE_DB, "movies", existingMovieDoc.id);
      await updateDoc(existingMovieRef, {
        count: existingMovieDoc.data().count + 1,
      });
    } else {
      // Movie not found, create a new document
      await addDoc(moviesCollection, {
        userId: user.uid,
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const saveMovie = async (movie: Movie, user: any) => {
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {

    const favoritesRef = collection(FIREBASE_DB, "users", user.uid, "favorites");

    const movieDocRef = doc(favoritesRef, movie.id.toString());
    const movieDocSnapshot = await getDoc(movieDocRef);

    if (movieDocSnapshot.exists()) {
      console.log("Movie already in favorites");
      return;
    }


    await setDoc(movieDocRef, {
      id: movie.id,
      title: movie.title,
      poster_url: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      addedAt: Timestamp.now(),
    });

  } catch (error) {
    console.error("Error adding movie to favorites:", error);
  }
};


export const getSavedMovies = async (user: any): Promise<MoviesSaved[] | undefined> => {
  try {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const favoritesRef = collection(FIREBASE_DB, "users", user.uid, "favorites");
    const favoritesQuery = query(favoritesRef, orderBy("addedAt", "desc"));
    const querySnapshot = await getDocs(favoritesQuery);

    const movies: MoviesSaved[] = querySnapshot.docs.map((doc) => ({
      id: doc.data().id,
      title: doc.data().title,
      poster_path: doc.data().poster_url,
      vote_average: doc.data().vote_average,
      release_date: doc.data().release_date,
      addedAt: doc.data().addedAt,
    }));

    return movies;
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    return undefined;
  }
};

export const unsaveMovie = async (movieId: number, user: any) => {
  if (!user) {
    throw new Error("User not authenticated");
  }
  try {
    const movieDocRef = doc(FIREBASE_DB, "users", user.uid, "favorites", movieId.toString());
    await deleteDoc(movieDocRef);
    console.log("Movie removed from favorites");
  } catch (error) {
    console.error("Error removing movie from favorites:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {

    const moviesCollection = collection(FIREBASE_DB, "movies");

    const trendingQuery = query(
      moviesCollection,
      orderBy("count", "desc"),
      limit(5)
    )

    const querySnapshot = await getDocs(trendingQuery)

    const trendingMovies: TrendingMovie[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as TrendingMovie[];

    return trendingMovies as unknown as TrendingMovie[];

  } catch (error) {
    console.error(error);
    return undefined;
  }
}

