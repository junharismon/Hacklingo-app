import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import bg from "../assets/BG.png";
import {
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Pressable,
  Dimensions
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Actions,
} from "react-native-gifted-chat";
import {
  getFirestore,
  onSnapshot,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
} from "firebase/firestore";
import { database } from "../config/firebase";
import {
  MaterialIcons,
  Entypo,
  FontAwesome,
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import pickImage from "../helper/imagePicker";
import { fetchOtherUsersByEmail, uploadChatImage } from "../stores/usersSlice";
import showToast from "../helper/showToast";
import sendPushNotification from "../helper/sendPushNotification";

const width = Dimensions.get("window").width;

export default function GroupChat({ route, navigation }) {
  const userEmail = useSelector((state) => state.authReducer.email);
  const username = useSelector((state) => state.authReducer.username);
  const userProfileImageUrl = useSelector(
    (state) => state.authReducer.profileImageUrl
  );
  const [messages, setMessages] = useState([]);
  const { groupId, groupName } = route.params;
  const [groupLanguage, setGroupLanguage] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupAdmin, setGroupAdmin] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageData, setSelectedImageData] = useState({});
  const mergeMessages = (oldMessages, newMessages) => {
    const allMessages = [...oldMessages, ...newMessages];
    const uniqueMessages = allMessages.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m._id === message._id)
    );

    return uniqueMessages.sort((a, b) => b.createdAt - a.createdAt);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (!groupId) {
      return;
    }

    const database = getFirestore();
    const groupDocRef = doc(database, "groupChats", groupId);
    const unsubscribe = onSnapshot(groupDocRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data) {
        if (data.messages) {
          const fetchedMessages = data.messages.map((message) => ({
            _id: message._id,
            createdAt: message.createdAt.toDate(),
            text: message.text,
            image: message.image,
            user: message.user,
          }));
          setMessages((messages) => mergeMessages(messages, fetchedMessages));
        } else {
          setMessages([]);
        }

        setGroupLanguage(data.languages);
        setGroupMembers(data.users || []);
        setGroupAdmin(data.admin || null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [groupId]);

  const selectImage = async () => {
    const imageData = await pickImage();
    setSelectedImage(imageData?.uri || "");
    setSelectedImageData(imageData || {});
  };

  const onSend = useCallback(
    (messages = []) => {
      if (!userEmail) {
        console.error("User data not loaded yet. Please try again later.");
        return;
      }

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      setSelectedImage("");
      setSelectedImageData({});

      const { _id, createdAt, text, image } = messages[0];
      const messageObj = {
        _id,
        createdAt,
        text,
        image,
        user: {
          _id: userEmail,
          username: username,
          avatar:
            userProfileImageUrl ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
        },
      };

      const groupDocRef = doc(database, "groupChats", groupId);
      updateDoc(groupDocRef, {
        messages: arrayUnion(messageObj),
      });

      // Send the push notifications to multiple people
      getDoc(groupDocRef)
      .then(async (snapshot) => {
        const groupMemberEmails = snapshot.data().users;
        const membersData = await dispatch(fetchOtherUsersByEmail(groupMemberEmails)).unwrap();
        const deviceTokens = membersData.filter(el => el.email !== userEmail).map(el => el.deviceToken);
        for(const deviceToken of deviceTokens) {
          if (deviceToken) {
            sendPushNotification(deviceToken, username, messages[0].text);
          }
        }
      })
    },
    [userEmail, groupId, username]
  );

  const renderUsername = (currentMessage) => {
    return (
      <Text style={{ fontSize: 12, color: "#777", marginBottom: 5 }}>
        {currentMessage.user.username}
      </Text>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 10 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Video Chat", {
                roomId: groupId,
                username: username,
              })
            }
            style={{ marginRight: 10 }}
          >
            <MaterialIcons name="video-call" size={24} color="#0D47A1" />
          </TouchableOpacity>
          {userEmail && groupAdmin && userEmail === groupAdmin && (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate("RequestJoin", { groupId })}
                style={{ marginRight: 10 }}
              >
                <Entypo name="add-user" size={24} color="#0D47A1" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CreateGroupChat", {
                    groupId,
                    groupName,
                    groupLanguage,
                    groupMembers,
                    editMode: true,
                  })
                }
              >
                <FontAwesome name="gear" size={24} color="#0D47A1" />
              </TouchableOpacity>
            </>
          )}
        </View>
      ),
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ChatList")}
            style={{ paddingRight: 10 }}
          >
            <AntDesign name="arrowleft" size={30} color="black" />
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", paddingLeft: 10, fontSize: 20 }}>
            {groupName}
          </Text>
        </View>
      ),
      headerLeft: () => {
        <View></View>;
      },
    });
  }, [
    navigation,
    groupId,
    groupName,
    groupLanguage,
    groupMembers,
    userEmail,
    groupAdmin,
  ]);

  const renderBubble = (props) => {
    const isCurrentUser = props.currentMessage.user._id === userEmail;

    return (
      <View>
        {!isCurrentUser && renderUsername(props.currentMessage)}
        <Bubble
          {...props}
          textStyle={{ right: { color: "black" } }}
          wrapperStyle={{
            left: { backgroundColor: "#fff" },
            right: { backgroundColor: "#dcf8c6" },
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={bg} style={{ flex: 1 }}>
        {selectedImage && (
          <View style={styles.previewImageContainer}>
            <View style={styles.previewImage}>
              <Image
                source={{ uri: selectedImage }}
                style={{
                  height: "100%",
                  aspectRatio: 1,
                  resizeMode: "cover",
                  borderRadius: 20,
                }}
              />
            </View>
            <Pressable
              onPress={() => {
                setSelectedImage("");
                setSelectedImageData({});
              }}
            >
              <AntDesign name="close" size={24} color="#babdb7" />
            </Pressable>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: userEmail,
              username: username,
              avatar:
                userProfileImageUrl ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
            }}
            renderActions={(props) => (
              <Actions
              {...props}
              containerStyle={{
                alignSelf: "center",
              }}
              onPressActionButton={selectImage}
              icon={() => <Ionicons name="camera" size={30} color={"grey"} />}
            />
            )}
            timeTextStyle={{ right: { color: "grey" } }}
            renderSend={(props) => {
              const { text, messageIdGenerator, user, onSend } = props;
              return (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 40,
                    backgroundColor: "primary",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 5,
                    paddingRight: 5,
                  }}
                  onPress={async () => {
                    if ((text || selectedImage) && onSend) {
                      try {
  
                        // If the user wants to upload an image, upload first before sending
                        let imageUrl = "";
                        if (selectedImage) {
                          imageUrl = (
                            await dispatch(
                              uploadChatImage(selectedImageData)
                            ).unwrap()
                          ).chatImageUrl;
                        }
  
                        // After the process, pass the imageUrl as parameter in messages
                        onSend(
                          {
                            text: text.trim(),
                            image: imageUrl,
                            user,
                            _id: messageIdGenerator(),
                          },
                          true
                        );
                      } catch (err) {
                        console.log(err, "<<<< ini error send image");
                        showToast("error", "There was a problem when sending your message", "Please try again later");
                      }
                    }
                  }}
                >
                  <MaterialCommunityIcons
                    name={(text || selectedImage) && onSend ? "send" : "microphone"}
                    size={23}
                    color={"black"}
                  />
                </TouchableOpacity>
              );
            }}
            renderInputToolbar={(props) => (
              <InputToolbar
                {...props}
                containerStyle={{
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 2,
                  borderRadius: 20,
                  paddingTop: 5,
                }}
              />
            )}
            renderBubble={renderBubble}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headers: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 50,
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
    flex: 0.06,
    justifyContent: "space-between",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    marginHorizontal: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  previewImageContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 55,
    width: width * 0.95,
    height: 160,
    backgroundColor: "#dcf8c6",
    borderColor: "#bff099",
    borderStyle: "solid",
    borderWidth: 3,
    marginHorizontal: 10,
    zIndex: 9999,
    borderRadius: 20,
    padding: 10,
  },
  previewImage: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 50,
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 30,
    marginRight: 10,
    marginLeft: 10,
  },
});
