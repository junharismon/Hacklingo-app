import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Pressable
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteUsersBySearch, fetchUsersByNativeLanguage } from "../stores/usersSlice";
import showToast from "../helper/showToast";
import { AntDesign } from '@expo/vector-icons';

function Contacts({ navigation }) {
  const dispatch = useDispatch();

  const usersBySearch = useSelector(
    (state) => state.usersReducer.usersBySearch
  );
  const usersByNativeLanguage = useSelector(
    (state) => state.usersReducer.users
  );
  const userId = useSelector((state) => state.authReducer.userId);
  const userEmail = useSelector((state) => state.authReducer.email);
  const targetLanguage = useSelector(
    (state) => state.authReducer.targetLanguage
  );
  const contactsList = usersBySearch.filter((user) => user._id !== userId);
  const contactsListByNativeLanguage = usersByNativeLanguage
    .filter((user) => user._id !== userId)
    .sort((a, b) => a.nativeLanguage.localeCompare(b.nativeLanguage));

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

  useEffect(() => {
    dispatch(fetchUsersByNativeLanguage(targetLanguage))
      .unwrap()
      .catch((err) => showToast("error", "Fetch Data Error", err.message));
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: "white" }}
    >
      {/* Kalau merge ambil yang ini guys */}
      <View style={{flex: 1, minHeight: 580,}}>
      {contactsList.length !== 0 && (
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: 10}}>
          <Text style={styles.sectionTitle}>Users By Search</Text>
          <Pressable onPress={() => dispatch(deleteUsersBySearch())} style={[styles.sectionTitle, {height: 25, aspectRatio: 1}]}>
            <AntDesign name="closesquare" size={25} color="black" />
          </Pressable>
        </View>
      )}
      {contactsList.length !== 0 &&
        contactsList.map((contact) => {
          return (
            <View key={contact._id}>
              <TouchableOpacity
                style={styles.container}
                onPress={async () => {
                  navigation.navigate("Chat", {
                    recipientEmail: contact.email,
                    recipientName: contact.username,
                    recipientAvatar: contact.profileImageUrl,
                    senderEmail: userEmail,
                    recipientDeviceToken: contact.deviceToken,
                  });
                }}
              >
                <Image
                  source={{
                    uri:
                      contact.profileImageUrl ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
                  }}
                  style={styles.image}
                />
                <Image
                  source={{
                    uri: flagData.find(
                      (el) => el.language === contact.nativeLanguage
                    ).image,
                  }}
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: "50%",
                    transform: [{ translateY: 10 }],
                    height: 20,
                    width: 25,
                  }}
                />
                <View style={styles.content}>
                  <Text numberOfLines={1} style={styles.name}>
                    {contact.username}
                  </Text>
                  <Text numberOfLines={2} style={styles.subTitle}>
                    {contact.email}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      <View>
        <Text style={styles.sectionTitle}>
          Users You Might Be Interested In
        </Text>
      </View>
      {contactsListByNativeLanguage.map((contact) => {
        return (
          <View key={contact._id}>
            <TouchableOpacity
              style={styles.container}
              onPress={async () => {
                navigation.navigate("Chat", {
                  recipientEmail: contact.email,
                  recipientName: contact.username,
                  recipientAvatar: contact.profileImageUrl,
                  senderEmail: userEmail,
                  recipientDeviceToken: contact.deviceToken,
                });
              }}
            >
              <Image
                source={{
                  uri:
                    contact.profileImageUrl ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
                }}
                style={styles.image}
              />
              <Image
                source={{
                  uri: flagData.find(
                    (el) => el.language === contact.nativeLanguage
                  ).image,
                }}
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: "50%",
                  transform: [{ translateY: 10 }],
                  height: 20,
                  width: 25,
                }}
              />
              <Text>{contactsList.profileImageUrl}</Text>
              <View style={styles.content}>
                <Text numberOfLines={1} style={styles.name}>
                  {contact.username}
                </Text>
                <Text numberOfLines={2} style={styles.subTitle}>
                  {contact.email}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: "center",
    position: "relative",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  name: {
    fontWeight: "bold",
    fontSize: 20,
    fontStyle: "italic",
  },

  content: {
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
    paddingBottom: 5,
  },

  subTitle: {
    color: "gray",
    fontStyle: "italic",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 15,
  },
});

export default Contacts;
