import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ImageBackground,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import { database } from "../config/firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import BG from "../assets/HACKLINGO.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersBySearch } from "../stores/usersSlice";
import { Searchbar } from "react-native-paper";
import showToast from "../helper/showToast";

const {height, width} = Dimensions.get("window");

function CreateGroupChat({ route, navigation}) {
  const {
    groupId,
    groupName: initialGroupName,
    groupMembers,
    editMode,
  } = route.params || {};
  const [groupName, setGroupName] = useState(initialGroupName || "");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [isProGroup, setIsProGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(
    new Set(groupMembers || [])
  );
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const languages = [
    "English",
    "German/Deutsch",
    "Japanese/日本語",
    "French/Français",
    "Indonesian/Bahasa Indonesia",
    "Dutch/Nederlands",
    "Spanish/Español",
  ];
  const userEmail = useSelector((state) => state.authReducer.email);
  const loadingUsersBySearch = useSelector(
    (state) => state.usersReducer.status.usersBySearch
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEmail = async () => {
      setSelectedUsers((prevSelectedUsers) => {
        const newSelectedUsers = new Set(prevSelectedUsers);
        newSelectedUsers.add(userEmail);
        return newSelectedUsers;
      });
    };

    fetchEmail();
  }, []);

  useEffect(() => {
    dispatch(fetchUsersBySearch({search: ""}))
      .unwrap()
      .then((data) => {
        data = data.data.filter((user) => user.email !== userEmail);
        setUsers(data);
      })
      .catch((err) => console.log(err, "<<<< ini error pas ngambil data"));
  }, [userEmail]); // Add userEmail as a dependency

  useEffect(() => {
    if (editMode) {
      navigation.setOptions({ title: "Edit Group Chat" });
    }
  }, [editMode, navigation]);

  const toggleUserSelection = (user) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (selectedUsers.has(user)) {
      newSelectedUsers.delete(user);
    } else {
      if (!isProGroup && newSelectedUsers.size >= 5) {
        Alert.alert(
          "Member Limit Reached",
          "Non-Pro groups can have a maximum of 5 members. Upgrade to a Pro group to add more members.",
          [{ text: "OK" }]
        );
        return;
      }
      newSelectedUsers.add(user);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const searchUsernames = async () => {
    let usersBySearch = await dispatch(fetchUsersBySearch({search})).unwrap();
    usersBySearch = usersBySearch.data.filter((user) => user.email !== userEmail);
    setUsers(usersBySearch);
  }

  const CustomCheckBox = ({ isSelected, onPress }) => (
    <>
      <TouchableOpacity style={[styles.checkBox]} onPress={onPress}>
        <Text style={{ alignSelf: "center" }}>{isSelected ? "✔" : ""}</Text>
      </TouchableOpacity>
    </>
  );

  const onCreateGroupChat = async () => {
    if (groupName !== "" && selectedLanguage !== "") {

        const groupData = {
          groupName,
          users: Array.from(selectedUsers.add(userEmail)), // Include the current user's email
          languages: selectedLanguage,
          createdAt: new Date(),
          messages: [],
          admin: userEmail,
          isProGroup,
          requestJoin: [],
        };
    
        const groupChatsRef = collection(database, "groupChats");
        showToast("success", "Create new group success!", "You have created a new group!");
        if (editMode) {
          const groupDocRef = doc(database, "groupChats", groupId);
          await setDoc(groupDocRef, groupData);
          navigation.goBack();
        } else {
          await addDoc(groupChatsRef, groupData);
          navigation.goBack();
        }
    } else {
        showToast("error", "Group name and language must be filled", "You must choose a group language and name");
    }
  };

  return (
      <ImageBackground
        source={BG}
        style={{flex: 1, opacity: 0.7, height: height * 0.9 }}
      >
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Input Group Name"
            value={groupName}
            onChangeText={setGroupName}
          />
          <View style={{ marginVertical: 10 }}>
            <View style={styles.languageSelectorContainer}>
              <SelectDropdown
                data={languages}
                defaultButtonText={"Select Language"}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"#f8f8ff"}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
                onSelect={(item) => setSelectedLanguage(item)}
              />
            </View>
          </View>
          <Text style={styles.sectionTitle}>Users</Text>
          <Searchbar
            value={search}
            onChangeText={(text) => setSearch(text)}
            onSubmitEditing={searchUsernames}
            placeholder="search users..."
            style={{
              height: 40,
              backgroundColor: "transparent",
              marginBottom: 8,
            }}
            inputStyle={{ fontSize: 14, alignSelf: "center" }}
          />
          {loadingUsersBySearch === "loading" ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          ) : (
            users.length === 0 ? (
                <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                    <Text>No users found.</Text>
                </View>
            ) : (
                <FlatList
                  data={users}
                  keyExtractor={(item) => item.email}
                  renderItem={({ item }) => (
                    <View style={styles.userRow}>
                      <CustomCheckBox
                        isSelected={selectedUsers.has(item.email)}
                        onPress={() => toggleUserSelection(item.email)}
                      />
                      <Text style={styles.userName}>{item.username}</Text>
                    </View>
                  )}
                />
            )
          )}
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreateGroupChat}
          >
            <Text style={styles.buttonText}>Create Group Chat</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  languageSelectorContainer: {
    borderWidth: 3,
    borderColor: "#0097b2",
    borderRadius: 10,
  },
  GroupPro: {
    borderWidth: 1,
    borderColor: "#0097b2",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginVertical: 5,
    paddingVertical: 5,
  },
  box: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#0097b2",
    padding: 16,
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  input: {
    borderWidth: 3,
    borderColor: "#0097b2",
    borderRadius: 10,
    paddingVertical: 5,
    marginVertical: 5,
    padding: 10,
    textAlign: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    marginLeft: 8,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#0097b2",
    borderBottomWidth: 1,
    textAlign: "center",
    paddingBottom: 5,
  },
  languagesContainer: {
    marginBottom: 16,
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  languageName: {
    marginLeft: 8,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#0097b2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkBox: {
    width: 25,
    height: 25,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#0097b2",
    marginRight: 5,
  },
  proGroupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  proGroupText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  dropdown1BtnStyle: {
    width: "80%",
    height: 45,
    backgroundColor: "white",
    borderRadius: 30,
    borderColor: "#444",
    textAlign: "center",
  },
  dropdown1BtnTxtStyle: { color: "#444", right: 30, fontSize: 13 },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    width: "90%",
    borderColor: "#0097b2",
    borderWidth: 3,
  },
  dropdown1RowTxtStyle: { color: "#444", alignSelf: "center" },
});

export default CreateGroupChat;
