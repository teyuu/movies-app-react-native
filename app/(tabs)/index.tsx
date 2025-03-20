import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/hooks/useAuth";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/movieService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView } from "react-native";
import { Text, View } from "react-native";

export default function Index() {
  const { user } = useAuth();

  const router = useRouter();

  const [movies, setMovies] = useState<{
    data: Movie[];
    loading: boolean;
    error: any;
  }>({
    data: [],
    loading: true,
    error: null,
  });

  const [trendingMovies, setTrendingMovies] = useState<{
    data: TrendingMovie[];
    loading: boolean;
    error: any;
  }>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await fetchMovies({ query: "" });
        setMovies({ data: movieData, loading: false, error: null });
      } catch (error) {
        setMovies({ data: [], loading: false, error });
      }

      try {
        const trendingData = await getTrendingMovies();
        const uniqueTrendingMovies = Array.from(
          new Map(trendingData!.map((movie) => [movie.title, movie])).values()
        );
        setTrendingMovies({ data: uniqueTrendingMovies, loading: false, error: null });
      } catch (error) {
        setTrendingMovies({ data: [], loading: false, error });
      }
    };

    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {movies.loading || trendingMovies.loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : movies.error || movies.error ? (
          <Text>
            Errorr: ${movies.error?.message || trendingMovies.error?.message}
          </Text>
        ) : (
          <View className="flex-1 mt-5 ml-4">
            <Text className="text-white text-xl font-semibold mb-8">
              Welcome,{" "}
              <Text className="text-yellow-400 font-bold">
                {user?.email?.split("@")[0]}!
              </Text>
            </Text>
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />

            {trendingMovies.data.length > 0 && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  data={trendingMovies.data}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}

            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest moviessss
              </Text>
              <FlatList
                data={movies.data}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
