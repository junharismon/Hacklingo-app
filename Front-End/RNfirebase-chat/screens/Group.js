import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { database } from "../config/firebase";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import showToast from "../helper/showToast";
import sendPushNotification from "../helper/sendPushNotification";
import { fetchOtherUserByEmail } from "../stores/usersSlice";
import { useDispatch } from "react-redux";

function Groups({ navigation }) {
  const route = useRoute();
  const groupLanguage = route.params ? route.params.language : undefined;
  const [loadingGroupsStatus, setLoadingGroupsStatus] = useState("idle");
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [unjoinedGroups, setUnjoinedGroups] = useState([]);
  const userEmail = useSelector((state) => state.authReducer.email);
  const username = useSelector((state) => state.authReducer.username);

  const dispatch = useDispatch();

  const flagData = [
    {
      language: "English",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Square_Flag_of_the_United_Kingdom.svg/1200px-Square_Flag_of_the_United_Kingdom.svg.png",
    },
    {
      language: "Indonesian/Bahasa Indonesia",
      image:
        "https://cdn.countryflags.com/thumbs/indonesia/flag-button-square-250.png",
    },
    {
      language: "Dutch/Nederlands",
      image:
        "https://www.shutterstock.com/image-vector/flag-holland-netherlands-vector-square-260nw-1123607408.jpg",
    },
    {
      language: "German/Deutsch",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfOja8hsnUirrNjkAYMnfzrCydbdxO9-KsEg&usqp=CAU",
    },
    {
      language: "Spanish/Español",
      image:
        "https://flagdownload.com/wp-content/uploads/Flag_of_Spain_Flat_Square-1024x1024.png",
    },
    {
      language: "Japanese/日本語",
      image:
        "https://thumbs.dreamstime.com/b/japan-flag-vector-square-flat-icon-japan-flag-vector-square-flat-icon-illustration-101720581.jpg",
    },
    {
      language: "French/Français",
      image:
        "https://i0.wp.com/haverfordclerk.com/wp-content/uploads/2015/11/france_flag_square.jpg?fit=250%2C250",
    },
  ];

  const fetchGroups = async (language) => {
    setLoadingGroupsStatus("loading");
    const groupChatsRef = collection(database, "groupChats");
    const unsubscribe = onSnapshot(groupChatsRef, (querySnapshot) => {
      const groupsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredGroups = language
        ? groupsData.filter((group) => group.languages === language)
        : groupsData;
      const joined = filteredGroups.filter((group) =>
        group.users.includes(userEmail)
      );
      const unjoined = filteredGroups.filter(
        (group) => !group.users.includes(userEmail)
      );

      // console.log(unjoined, "<<< ini yang unjoin");

      setJoinedGroups(joined);
      setUnjoinedGroups(unjoined);
      setLoadingGroupsStatus("idle");
    });

    return () => {
      unsubscribe();
    };
  };

  useEffect(() => {
    fetchGroups(groupLanguage);
  }, [groupLanguage]);

  const navigateToCreateGroupChat = () => {
    navigation.navigate("CreateGroupChat");
  };

  const handleJoinRequest = async (item) => {
    const groupDocRef = doc(database, "groupChats", item.id);
    await updateDoc(groupDocRef, {
      requestJoin: arrayUnion({ email: userEmail, username: username }),
    });
    showToast(
      "success",
      `You requested to join ${item.groupName}`,
      "Please wait until the admin accepts you"
    );
    const adminData = await dispatch(
      fetchOtherUserByEmail(item.admin)
    ).unwrap();
    if (adminData.deviceToken) {
      sendPushNotification(
        adminData.deviceToken,
        "Someone wants to join your group!", 
        `${username} has requested to join group ${item.groupName}`
      );
    }
  };

  const showJoinRequestAlert = (item) => {
    Alert.alert(
      "Join Group",
      `Are you sure you want to join "${item.groupName}" group?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleJoinRequest(item),
        },
      ],
      { cancelable: false }
    );
  };

  const handleGroupClick = (item, joinRequest) => {
    if (joinRequest) {
      showJoinRequestAlert(item);
    } else {
      navigation.navigate("Group Chat", {
        groupId: item.id,
        groupName: item.groupName,
      });
    }
  };

  const renderGroupItem = ({ item }, joinRequest) => {
    return (
      <TouchableOpacity
        style={{
          paddingVertical: 15,
          borderBottomColor: "#ccc",
          marginHorizontal: 15,
          borderBottomWidth: 1,
          position: "relative",
        }}
        onPress={() => handleGroupClick(item, joinRequest)}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {item.groupName}
        </Text>
        <Text style={{ fontSize: 14, color: "#777" }}>
          {item.users.length} members
        </Text>
        <Image
          source={{
            uri:
              flagData.find((el) => el.language === item.languages)?.image ||
              flagData[0].image,
          }}
          style={{
            position: "absolute",
            height: 20,
            width: 25,
            bottom: "50%",
            transform: [{ translateY: -5 }],
            right: 0,
          }}
        />
      </TouchableOpacity>
    );
  };

  if (loadingGroupsStatus === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {joinedGroups.length === 0 && unjoinedGroups.length === 0 ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            position: "relative",
          }}
        >
          <View
            style={{
              position: "absolute",
              height: 40,
              aspectRatio: 1,
              top: 20,
              right: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pressable onPress={() => fetchGroups(null)}>
              <AntDesign name="closecircle" size={30} color="black" />
            </Pressable>
          </View>
          <AntDesign name="deleteusergroup" size={200} color="black" />
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Group with {groupLanguage} language is not found, maybe you can
            create them first!
          </Text>
          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={navigateToCreateGroupChat}
          >
            <AntDesign name="addusergroup" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{ flex: 1, backgroundColor: "white", position: "relative" }}
        >
          <FlatList
            data={joinedGroups}
            keyExtractor={(item) => item.id}
            renderItem={(item) => renderGroupItem(item, false)} // Joined groups
            ListHeaderComponent={() => (
              <View>
                <Text style={styles.sectionTitle}>Joined Groups</Text>
              </View>
            )}
            ListFooterComponent={() => (
              <View>
                <Text style={styles.sectionTitle}>Unjoined Groups</Text>
                <FlatList
                  data={unjoinedGroups}
                  keyExtractor={(item) => item.id}
                  renderItem={(item) => renderGroupItem(item, true)} // Unjoined groups
                />
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={navigateToCreateGroupChat}
          >
            {/* <Text style={styles.createGroupButtonText}>Create Group Chat</Text> */}
            <AntDesign name="addusergroup" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  chatRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  chatName: {
    fontSize: 18,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
  },
  createGroupButton: {
    backgroundColor: "#0097b2",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  createGroupButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 15,
  },
});

export default Groups;
