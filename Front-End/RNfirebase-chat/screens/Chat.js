import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import {
  Actions,
  Bubble,
  GiftedChat,
  InputToolbar,
} from "react-native-gifted-chat";
import {
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { database } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import bg from "../assets/BG.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import {
  AntDesign,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PopChatMenu } from "./HeadersChat/PopChatMenu";
import pickImage from "../helper/imagePicker";
import { fetchOtherUserByEmail, uploadChatImage } from "../stores/usersSlice";
import sendPushNotification from "../helper/sendPushNotification";

const width = Dimensions.get("window").width;

export default function Chat({ route }) {
  const senderEmail = useSelector((state) => state.authReducer.email);
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageData, setSelectedImageData] = useState({});
  const {
    recipientEmail,
    recipientName,
    recipientAvatar,
    recipientDeviceToken
  } = route.params;
  const [roomId, setRoomId] = useState(null);
  const currentUserUsername = useSelector(
    (state) => state.authReducer.username
  );
  const currentUserProfileImageUrl = useSelector(
    (state) => state.authReducer.profileImageUrl
  );

  const loadingRecipientStatus = useSelector(
    (state) => state.usersReducer.status.userByEmail
  );

  const dispatch = useDispatch();

  const mergeMessages = (oldMessages, newMessages) => {
    const allMessages = [...oldMessages, ...newMessages];
    const uniqueMessages = allMessages.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m._id === message._id)
    );

    return uniqueMessages.sort((a, b) => b.createdAt - a.createdAt);
  };

  const generateRoomId = (email1, email2) => {
    return email1 < email2 ? `${email1}_${email2}` : `${email2}_${email1}`;
  };

  useEffect(() => {
    const createRoomId = generateRoomId(senderEmail, recipientEmail);
    const roomDocRef = doc(database, "personalChats", createRoomId);

    const unsubscribe = onSnapshot(roomDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const fetchedMessages = docSnapshot.data().messages.map((message) => ({
          ...message,
          createdAt: message.createdAt.toDate(),
        }));
        setMessages((messages) => mergeMessages(messages, fetchedMessages));
      } else {
        setMessages([]);
      }
    });
    setRoomId(createRoomId);
    return () => {
      unsubscribe();
    };
  }, [recipientEmail, senderEmail]);

  const selectImage = async () => {
    const imageData = await pickImage();
    setSelectedImage(imageData?.uri || "");
    setSelectedImageData(imageData || {});
  };

  const onSend = useCallback(
    async (messages = []) => {
      if (!currentUserUsername) {
        console.error("User data not loaded yet. Please try again later.");
        return;
      }

      // Render the message on screen
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
      setSelectedImage("");
      setSelectedImageData({});

      const roomId = generateRoomId(senderEmail, recipientEmail);
      const roomDocRef = doc(database, "personalChats", roomId);
      const roomDocSnapshot = await getDoc(roomDocRef);

      // Generate a new Room if it doesn't exist yet
      if (!roomDocSnapshot.exists()) {
        await setDoc(roomDocRef, {
          users: [
            {
              email: senderEmail,
              username: currentUserUsername,
              avatar:
                currentUserProfileImageUrl ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
            },
            {
              email: recipientEmail,
              username: recipientName,
              avatar:
                recipientAvatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA", // Set the recipient avatar if available
            },
          ],
          messages: [],
        });
      }

      const message = {
        _id: messages[0]._id,
        createdAt: messages[0].createdAt,
        text: messages[0].text,
        image: messages[0].image,
        user: {
          _id: senderEmail,
          username: currentUserUsername,
          avatar:
            currentUserProfileImageUrl ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
        },
      };

      await updateDoc(roomDocRef, {
        messages: arrayUnion(message),
      });

      // Sending notification to the other user
      if (recipientDeviceToken) {
        sendPushNotification(
          recipientDeviceToken,
          currentUserUsername,
          messages[0].text
        );
      }
    },
    [currentUserUsername]
  );

  const navigation = useNavigation();

  const goToVideoChat = () => {
    const tempId = generateRoomId(senderEmail, recipientEmail);
    navigation.navigate("Video Chat", {
      roomId: roomId ?? tempId,
      username: currentUserUsername,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingRight: 15,
          }}
        >
          <TouchableOpacity>
            <MaterialIcons
              onPress={goToVideoChat}
              name="video-call"
              size={36}
              color="black"
            />
          </TouchableOpacity>
          <PopChatMenu name={recipientName} email={recipientEmail} />
        </View>
      ),
      headerTitle: () => (
        // This is the Chat Header
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
            <AntDesign name="arrowleft" size={30} color="black" />
          </TouchableOpacity>
          <Image
            source={{
              uri:
                recipientAvatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
            }}
            style={styles.image}
          />
          <Text style={{ fontStyle: "italic", fontSize: 20 }}>
            {recipientName}
          </Text>
        </View>
      ),
      headerLeft: () => {
        <View></View>;
      },
    });
  }, []);

  if (loadingRecipientStatus === "loading") {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={bg}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </ImageBackground>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={bg} style={{ flex: 1, position: "relative" }}>
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
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          onSend={(messages) => {
            onSend(messages);
          }}
          user={{
            _id: senderEmail,
            username: currentUserUsername,
            avatar:
              currentUserProfileImageUrl ||
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
          textInputStyle={{ fontSize: 16, paddingHorizontal: 5 }}
          timeTextStyle={{ right: { color: "grey" } }}
          infiniteScroll={true}
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
                    }
                  }
                }}
              >
                <MaterialCommunityIcons
                  name={
                    (text || selectedImage) && onSend ? "send" : "microphone"
                  }
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
                marginBottom: 5,
                borderRadius: 20,
              }}
            />
          )}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                textStyle={{ right: { color: "black" } }}
                wrapperStyle={{
                  left: {
                    backgroundColor: "white",
                  },
                  right: {
                    backgroundColor: "#dcf8c6",
                  },
                }}
              ></Bubble>
            );
          }}
        />
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
    width: 35,
    aspectRatio: 1,
    borderRadius: 30,
    marginRight: 10,
    marginLeft: 10,
  },
});
