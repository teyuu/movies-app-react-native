import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/hooks/useAuth";
import { View, Text, Image, FlatList, ScrollView } from "react-native";

const Saved = () => {
  const { user, savedMovies } = useAuth();

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
      <ScrollView className="flex-1 mt-5 ml-4">
        <Text className="text-lg text-white font-bold mt-5 mb-3">
          Saved Movies
        </Text>
        <FlatList
          data={savedMovies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          className="mt-2 pb-32 mr-3"
          scrollEnabled={false}
          ListEmptyComponent={() => (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-300 text-md">
              You haven't saved any movies yet.
              </Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};
export default Saved;
