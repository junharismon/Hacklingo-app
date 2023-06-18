import * as React from "react";
import { Searchbar } from "react-native-paper";
import { Dimensions, Image, View } from "react-native";
import logo from "./assets/LOGO.png";
import { useDispatch } from "react-redux";
import { fetchPostsBySearch } from "../../stores/postsSlice";
import showToast from "../../helper/showToast";

export default function HeaderForum({ forumId }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const dispatch = useDispatch();
  const width = Dimensions.get("window").width;

  const onChangeSearch = (query) => setSearchQuery(query);

  const onPostSearch = () => {
    dispatch(fetchPostsBySearch({ search: searchQuery, forumId }))
      .unwrap()
      .catch((err) => showToast("error", "Fetch Data Error", err.message));
  };

  return (
    <View style={{ flexDirection: "row", backgroundColor: "#0097b2", alignItems: "center"}}>
      <Searchbar
        placeholder="search posts..."
        style={{
          backgroundColor: "#F6F1F1",
          width: width * 0.64,
          marginRight: 10,
          height: 40
        }}
        inputStyle={{fontSize: 14, alignSelf: "center"}}
        onSubmitEditing={onPostSearch}
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <Image source={logo} style={{ width: 50, height: 50, marginRight: 10 }} />
    </View>
  );
}
