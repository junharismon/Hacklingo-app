import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { insertNewPost } from "../../stores/postsSlice";
import pickImage from "../../helper/imagePicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import showToast from "../../helper/showToast";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import logo from "../../assets/HACKLINGO.png";

export default function Post({ route }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageData, setSelectedImageData] = useState({});
  const insertPostStatus = useSelector(
    (state) => state.postsReducer.status.newPost
  );
  const { forumId } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onPickImage = async () => {
    try {
      const imageData = await pickImage();
      setSelectedImage(imageData.uri);
      setSelectedImageData(imageData);
    } catch (err) {
      console.log(err, "<<< ini err pick image untuk post");
    }
  };

  const onCreatePost = () => {
    if (title !== "" && content !== "") {
      const form = new FormData();
      if (Object.keys(selectedImageData)[0]) {
        form.append("file", selectedImageData);
      }
      form.append("title", title);
      form.append("content", content);
      form.append("forumId", forumId);
      dispatch(insertNewPost(form))
        .unwrap()
        .then(() => {
          showToast(
            "success",
            "Insert Post Success!",
            "you have succesfully create your post!"
          );
          navigation.goBack();
        })
        .catch((err) => {
          showToast("error", "Insert New Post Error", err.message);
        });
    } else {
      showToast("error", "Input Incomplete", "title and content must be filled");
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior="height"
        style={styles.container}
        keyboardVerticalOffset={-75} // adjust this value as needed
      >
        <View>
          {/* <KeyboardAvoidingView behavior="padding"> */}
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            placeholder="Enter post title"
          />

          <Text style={styles.label}>Content:</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={5}
            textAlignVertical={"top"}
            onChangeText={setContent}
            value={content}
            placeholder="Enter post content"
          />
          {/* </KeyboardAvoidingView> */}
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={onPickImage}
              style={{
                marginTop: 10,
                marginBottom: 20,
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
                  source={{
                    uri:
                      selectedImage ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
                  }}
                  style={{ width: "100%", height: "100%", borderRadius: 120 }}
                />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={onCreatePost}>
            <Text style={styles.buttonText}>Create Post</Text>
          </TouchableOpacity>
          <View>
            <Image
              source={logo}
              style={{
                height: 210,
                width: "60%",
                opacity: 0.3,
                position: "relative",
                marginTop: 10,
                alignSelf: "center",
              }}
            />
          {insertPostStatus === "loading" && (
            <View
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: [{translateX: -15}, {translateY: -15}],
                // alignItems: "center",
                // justifyContent: "center",
              }}
            >
              <ActivityIndicator size={30} />
              {/* <Text>Uploading your post ...</Text> */}
            </View>
          )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#0097b2",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
