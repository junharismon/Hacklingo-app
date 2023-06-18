import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { database } from "../config/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Image } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchOtherUsersByEmail } from "../stores/usersSlice";
dayjs.extend(relativeTime);

function ChatList() {
  const [chats, setChats] = useState([]);
  const [loadingChatsStatus, setLoadingChatsStatus] = useState("idle");
  const navigation = useNavigation();
  const userEmail = useSelector((state) => state.authReducer.email);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userEmail) return;
    setLoadingChatsStatus("loading");
    const personalChatsRef = collection(database, "personalChats");
    const personalChatsQuery = query(personalChatsRef);
    const personalChatsUnsubscribe = onSnapshot(
      personalChatsQuery,
      async (snapshot) => {
        const personalChatsData = snapshot.docs.map((doc) => {
          let {messages, users} = doc.data();
          return {
            messages: messages[messages.length-1],
            users: users,
            chatId: doc.id,
            isGroup: false,
          }
        });
        const userChats = personalChatsData.filter((chat) => {
          return chat.users.some((userObj) => userObj.email === userEmail);
        });
        const mergedChats = await mergeChatLists(userChats);
        setChats(mergedChats);
        setLoadingChatsStatus("idle");
      }
    );

    return () => {
      personalChatsUnsubscribe();
    };
  }, [userEmail]);

  const mergeChatLists = async (newChats) => {
    const mergedChats = newChats
    .map((chat) => {
        const recipient = chat.users.find((user) => user.email !== userEmail);
        return { ...chat, recipient };
      })
      .sort((a, b) => {
        const lastMessageTimeA = a.messages.createdAt.seconds;
        const lastMessageTimeB = b.messages.createdAt.seconds;
        return lastMessageTimeB - lastMessageTimeA
      });
    // Get the users data from collection users;
    const recipientEmails = mergedChats.map((el) => el.recipient.email);
    const usersCollectionRef = collection(database, "users");
    const usersQuery = query(
      usersCollectionRef,
      where("email", "in", recipientEmails)
    );

    // Execute the query
    const querySnapshot = await getDocs(usersQuery);

    // Retrieve the matching user documents
    const matchingUsers = new Map();
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const selectedFields = {
        email: userData.email,
        username: userData.username,
        profileImageUrl: userData.profileImageUrl,
        deviceToken: userData.deviceToken,
      };
      matchingUsers.set(userData.email, selectedFields);
    });

    mergedChats.forEach((el, i) => {
      el.recipient.username = matchingUsers.get(el.recipient.email).username;
      el.recipient.avatar = matchingUsers.get(
        el.recipient.email
      ).profileImageUrl;
      el.recipient.deviceToken = matchingUsers.get(
        el.recipient.email
      ).deviceToken;
    });
    return mergedChats;
  };

  if (loadingChatsStatus === "loading") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 10, backgroundColor: "#fff" }}>
      {chats.length === 0 && loadingChatsStatus === "idle" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "grey", fontSize: 14 }}>
            You don't have any chat history yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          renderItem={({ item }) => {
            const lastMessage = item.messages;
            const otherUser = item.users.find((u) => u.email !== userEmail);
            const lastMessageDate = new Date(
              lastMessage?.createdAt.seconds * 1000
            );

            return (
              <TouchableOpacity
                style={styles.container}
                onPress={() => {
                  navigation.navigate("Chat", {
                    recipientEmail: otherUser.email,
                    recipientName: otherUser.username,
                    senderEmail: userEmail,
                    recipientAvatar: otherUser.avatar,
                    recipientDeviceToken: otherUser.deviceToken,
                  });
                }}
              >
                <Image
                  source={{ uri: otherUser.avatar }}
                  style={styles.image}
                />
                <View style={styles.content}>
                  <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>
                      {otherUser.username}
                    </Text>
                    <Text style={styles.subTitle}>
                      {dayjs(lastMessageDate).fromNow(false)}
                    </Text>
                  </View>
                  <Text style={styles.subTitle}>{lastMessage?.text}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: "center",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20,
    fontStyle: "italic",
  },
  subTitle: {
    color: "gray",
    fontStyle: "italic",
    marginBottom: 5,
    marginRight: 5,
  },
});

export default ChatList;
