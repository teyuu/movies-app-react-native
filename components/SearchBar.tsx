import { icons } from "@/constants/icons";
import { View, Text, Image, TextInput } from "react-native";

interface Props {
  placeholder: string;
  onPress?: () => void;
}

const SearchBar = ({ placeholder, onPress }: Props) => {
  return (
    <View className="flex-row items-center  rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="size-5 "
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        placeholderTextColor="#a8b5db"
        className="flex-1 ml-2 text-white"
      />
    </View>
  );
};
export default SearchBar;
