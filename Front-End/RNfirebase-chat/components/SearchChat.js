import { Searchbar } from "react-native-paper";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUsersBySearch } from "../stores/usersSlice";
import showToast from "../helper/showToast";

export function SearchChat() {
  const [searchUsername, setSearchUsername] = useState("");
  const dispatch = useDispatch();

  function handleSearch() {
    if (searchUsername.length !== 0) {
      dispatch(fetchUsersBySearch(searchUsername))
        .unwrap()
        .then(
          (data) =>
            data.length === 0 &&
            showToast(
              "info",
              "There weren't any result",
              `There was no user with username containing ${searchUsername}`
            )
        )
        .catch((err) => showToast("error", "Fetch Data Error", err.message));
    }
  }

  return (
    <>
      <Searchbar
        value={searchUsername}
        onChangeText={(value) => setSearchUsername(value)}
        onSubmitEditing={handleSearch}
        placeholder="Search"
        style={{ flex: 1, width: 70 }}
      />
    </>
  );
}
