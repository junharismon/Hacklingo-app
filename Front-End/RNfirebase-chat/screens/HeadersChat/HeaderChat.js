import { View, Dimensions } from "react-native";
import { Image } from "react-native";
import logo from "../../assets/HACKLINGO.png";
import { StyleSheet } from "react-native";
import { PopMenu } from "./PopMenu";
import { Searchbar } from "react-native-paper";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUsersBySearch } from "../../stores/usersSlice";
import showToast from "../../helper/showToast";

export function HeaderChat() {
  const [searchUsername, setSearchUsername] = useState("");
  const dispatch = useDispatch();

  const width = Dimensions.get("window").width;

  function handleSearch() {
    if (searchUsername.length !== 0) {
      dispatch(fetchUsersBySearch({search: searchUsername, context: "contacts"}))
        .unwrap()
        .then(
          (data) =>
            data.length === 0 &&
            showToast(
              "info",
              "Search didn't yield any result",
              `There was no user with username containing ${searchUsername}`
            )
        )
        .catch((err) => showToast("error", "Fetch Data Error", err.message));
    }
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: "#0097b2",
        paddingVertical: 3,
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            justifyContent: "center",
            marginRight: 10,
            marginLeft: 10,
          }}
        >
          <PopMenu />
        </View>
        <View
          style={{
            flex: 1,
            marginRight: 10,
            marginTop: 5,
            marginBottom: 5,
            flexDirection: "row",
          }}
        >
          <Searchbar
            value={searchUsername}
            onChangeText={(value) => setSearchUsername(value)}
            onSubmitEditing={handleSearch}
            placeholder="search users..."
            style={{
              flex: 1,
              width: width * 0.64,
              height: 40,
              backgroundColor: "#F6F1F1",
            }}
            inputStyle={{ fontSize: 14, alignSelf: "center" }}
          />
        </View>
        <Image source={logo} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});
