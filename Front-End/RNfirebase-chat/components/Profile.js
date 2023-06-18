import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { updateUserDetails } from "../stores/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import pickImage from "../helper/imagePicker";
import showToast from "../helper/showToast";

export default function Profile() {
  const [displayName, setDisplayName] = useState("");
  const [displayLanguage, setDisplayLanguage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageData, setSelectedImageData] = useState({});
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const currentUsername = useSelector((state) => state.authReducer.username);
  const currentUserProfileImageUrl = useSelector(
    (state) => state.authReducer.profileImageUrl
  );
  const currentNativeLanguage = useSelector(
    (state) => state.authReducer.nativeLanguage
  );
  const updateUserDetailsStatus = useSelector(
    (state) => state.usersReducer.status.updateUserDetails
  );

  async function handlePress() {
    // Kalau merge ambil yang ini guys
    try {
      const formData = new FormData();
      if (Object.keys(selectedImageData).length !== 0) {
        formData.append("file", selectedImageData);
      }
      formData.append("username", displayName);
      formData.append("nativeLanguage", displayLanguage);
      await dispatch(updateUserDetails(formData)).unwrap();
      showToast(
        "success",
        "Update Data Success",
        "Your data has been successfully updated"
      );
      navigation.navigate("Home");
    } catch (err) {
      showToast("error", "Update Data Error", err.message);
    }
  }

  useEffect(() => {
    setDisplayName(currentUsername);
    setSelectedImage(currentUserProfileImageUrl);
    setDisplayLanguage(currentNativeLanguage);
  }, []);

  return (
    <React.Fragment>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding: 20,
          margin: "auto",
        }}
      >
        <Text style={{ fontSize: 22 }}>Profile Info</Text>
        <Text style={{ fontSize: 14, marginTop: 20 }}>
          Please provide your name and an optional profile photo
        </Text>
        <TouchableOpacity
          onPress={() =>
            pickImage().then((imagedata) => {
              setSelectedImage(imagedata?.uri || currentUserProfileImageUrl);
              setSelectedImageData(imagedata || {});
            })
          }
          style={{
            marginTop: 30,
            borderRadius: 120,
            width: 120,
            height: 120,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!selectedImage ? (
            <MaterialCommunityIcons
              name="camera-plus"
              color={"grey"}
              size={45}
            />
          ) : (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: "100%", borderRadius: 120 }}
            />
          )}
        </TouchableOpacity>
        {updateUserDetailsStatus === "loading" && (
          <View
            style={{
              marginVertical: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size={15} />
            <Text>Uploading new info...</Text>
          </View>
        )}
        <View style={{ marginTop: 40, flexDirection: "row", width: "100%" }}>
          <AntDesign name="user" size={24} color="black" />
          <View style={{ width: "80%", marginLeft: 20 }}>
            <Text style={{ fontStyle: "italic", color: "grey" }}>Name</Text>
            <TextInput
              placeholder="Type your name"
              value={displayName}
              onChangeText={(text) => setDisplayName(text)}
              style={[
                {
                  borderBottomWidth: 2,
                  width: "100%",
                },
                { borderBottomColor: !displayName ? "red" : "grey" },
              ]}
            />
          </View>
        </View>
        <View style={{ marginTop: 40, flexDirection: "row", width: "100%" }}>
          <Ionicons name="language-outline" size={24} color="black" />
          <View style={{ width: "80%", marginLeft: 20 }}>
            <Text style={{ fontStyle: "italic", color: "grey" }}>Language</Text>
            <TextInput
              placeholder="Type your name"
              value={displayLanguage}
              onChangeText={(text) => setDisplayLanguage(text)}
              style={[
                {
                  borderBottomWidth: 2,
                  width: "100%",
                },
                { borderBottomColor: !displayName ? "red" : "grey" },
              ]}
            />
          </View>
        </View>
        <View style={{ marginTop: 50, width: 80 }}>
          <Button
            title="Update"
            onPress={handlePress}
            disabled={!displayName}
            color="#0097b2"
          />
        </View>
      </View>
    </React.Fragment>
  );
}
