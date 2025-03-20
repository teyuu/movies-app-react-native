import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/hooks/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { getSavedMovies, saveMovie, unsaveMovie } from "@/services/movieService";
import { useAuth } from "@/hooks/useAuth";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { user, fetchSavedMovies, savedMovies } = useAuth();
  const [isSaved, setIsSaved] = useState(false);


  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const handleToggleSave = async () => {
    if (!movie || !user) return;

    try {
      if (isSaved) {
        await unsaveMovie(movie.id, user);
      } else {
        await saveMovie(movie, user);
      }
      fetchSavedMovies(); 
      setIsSaved(!isSaved); 
    } catch (error) {
      console.error("Error toggling save state:", error);
    }
  };

  useEffect(() => {
    if (movie && savedMovies) {
      const saved = savedMovies.some((savedMovie) => savedMovie.id === movie.id);
      setIsSaved(saved);
    }
  }, [movie, savedMovies]);

  return (
    <View className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
          <View className="flex-col items-start justify-center mt-5 px-5">
            <Text className="text-white font-bold text-xl">{movie?.title}</Text>
            <View className="flex-row items-center gap-x-1 mt-2">
              <Text className="text-light-200 text-sm">
                {movie?.release_date?.split("-")[0]}
              </Text>
              <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
            </View>
            <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
              <Image source={icons.star} className="size-4" />
              <Text className="text-white font-bold text-sm">
                {Math.round(movie?.vote_average ?? 0)}
              </Text>
              <Text className=" text-light-200 text-sm">
                ({movie?.vote_count} votes)
              </Text>
            </View>
            <MovieInfo label="Overview" value={movie?.overview} />
            <MovieInfo
              label="Genres"
              value={
                movie?.genres?.map((g: any) => g.name).join(" • ") || "N/A"
              }
            />
            <View className="flex flex-row justify-between w-1/2">
              <MovieInfo
                label="Budget"
                value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
              />
              <MovieInfo
                label="Revenue"
                value={`$${Math.round(
                  (movie?.revenue ?? 0) / 1_000_000
                )} million`}
              />
            </View>
            <MovieInfo
              label="Production Companies"
              value={
                movie?.production_companies
                  ?.map((c: any) => c.name)
                  .join(" • ") || "N/A"
              }
            />
          </View>
        </View>
      </ScrollView>
      <View className="flex flex-row absolute bottom-5 left-0 right-0 mx-5 gap-2">
        <TouchableOpacity
        onPress={router.back}
        className="flex-1 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50">
          <Image
            source={icons.arrow}
            className="size-5 mr-1 mt-0.5 rotate-180"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">Go back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleToggleSave}
          className="w-[25%] bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        >
          <Image
            source={ icons.save} // Switch icon based on state
            className="size-5 mr-1 mt-0.5"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">
            {isSaved ? "Unsave" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default MovieDetails;
