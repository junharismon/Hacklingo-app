import React, { useState } from "react";
import {
  EvilIcons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../helper/showToast";
import { userSignUp } from "../stores/usersSlice";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import logo from "../assets/HACKLINGO.png";
import pickImage from "../helper/imagePicker";
import messaging from "@react-native-firebase/messaging";

export default SignUpView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageData, setSelectedImageData] = useState({});
  // const [columns, setColumns] = useState([""]);
  const [columns, setColumns] = useState([{ id: 0, value: "" }]);
  const signUpStatus = useSelector(
    (state) => state.usersReducer.status.userSignUp
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const countries = [
    "English",
    "Indonesian/Bahasa Indonesia",
    "Japanese/日本語",
    "German/Deutsch",
    "French/Français",
    "Spanish/Español",
    "Dutch/Nederlands",
  ];

  const onHandleSignup = async () => {
    if (
      email !== "" &&
      password !== "" &&
      fullName !== "" &&
      language !== "" &&
      columns[0] !== ""
    ) {
      const targetLanguage = columns.map(el => el.value);
      const deviceToken = await messaging().getToken();
      console.log(deviceToken, "<<<< this is your phone's fcm token");
      const input = {
        email,
        password,
        username : fullName,
        nativeLanguage : language,
        targetLanguage,
        selectedImageData,
        deviceToken,
      }
      dispatch(userSignUp(input))
        .unwrap()
        .then(() => showToast("success", "Sign up success", "You signed up successfully"))
        .catch((err) => {
          console.log(err);
          showToast("error", "Sign Up Error", err.message);
        });
    } else {
      showToast("error", "Input Incomplete", "All input must be filled");
    }
  };

  const addColumn = () => {
    const newId =
      columns.length > 0
        ? Math.max(...columns.map((column) => column.id)) + 1
        : 0;
    setColumns([...columns, { id: newId, value: "" }]);
  };

  const removeColumn = (id) => {
    const updatedColumns = columns.filter((column) => column.id !== id);
    setColumns(updatedColumns);
  };

  const handleColumnChange = (value, id) => {
    const updatedColumns = columns.map((column) =>
      column.id === id ? { ...column, value } : column
    );
    setColumns(updatedColumns);
  };

  const onSelectImagePress = async () => {
    const imageData = await pickImage();
    setSelectedImage(imageData?.uri || "");
    setSelectedImageData(imageData || {});
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity onPress={onSelectImagePress}>
          {!selectedImage ? (
            <MaterialCommunityIcons
              name="camera-plus"
              color={"grey"}
              size={45}
              style={{ marginBottom: 30 }}
            />
          ) : (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: 100,
                aspectRatio: 1,
                borderRadius: 120,
                marginBottom: 30,
              }}
            />
          )}
          {/* <Image source={logo} style={styles.logo} resizeMode="contain" /> */}
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={{
              uri: "https://img.icons8.com/ios-glyphs/512/user-male-circle.png",
            }}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Full name"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            onChangeText={(fullName) => setFullName(fullName)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={{
              uri: "https://img.icons8.com/ios-filled/512/circled-envelope.png",
            }}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={{ uri: "https://img.icons8.com/ios-glyphs/512/key.png" }}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Image
            style={[styles.inputIconDropdown, { width: 25, height: 25 }]}
            source={{
              uri: "https://img.icons8.com/ios-filled/25/flag--v1.png",
            }}
          />
          <SelectDropdown
            data={countries}
            defaultButtonText={"Select Native Language"}
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
                  color={"white"}
                  size={18}
                />
              );
            }}
            dropdownIconPosition={"right"}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            onSelect={(item) => setLanguage(item)}
          />
        </View>
        <View>
          {columns.map((column, index) => (
            <View key={column.id} style={styles.inputContainer}>
              <Image
                style={[styles.inputIconDropdown, { width: 30, height: 30 }]}
                source={{
                  uri: "https://img.icons8.com/ios-glyphs/30/globe--v1.png",
                }}
              />
              <SelectDropdown
                data={countries}
                defaultButtonText={"Select Target Language"}
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
                onSelect={(value) => handleColumnChange(value, column.id)}
              />
              {columns.length > 1 && (
                <TouchableOpacity onPress={() => removeColumn(column.id)}>
                  <AntDesign name="delete" size={18} color="black" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={addColumn} style={styles.addButton}>
                <EvilIcons name="plus" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {signUpStatus === "loading" ? (
          <View style={{marginBottom: 15}}>
            <ActivityIndicator style={{marginBottom: 5}} />
            <Text>Signing you up...</Text>
          </View>
        ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.buttonContainer}
        >
          <Text
            style={{
              textDecorationLine: "underline",
              color: "blue",
              fontSize: 12,
            }}
          >
            Already have an account? login here
          </Text>
        </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.buttonContainer, styles.signupButton]}
          onPress={onHandleSignup}
        >
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B0E0E6",
    minHeight: Dimensions.get("window").height,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 30,
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center",
  },
  inputIconDropdown: {
    width: 30,
    height: 30,
    position: "absolute",
    left: 15,
    zIndex: 40,
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  signupButton: {
    backgroundColor: "#3498db",
  },
  signUpText: {
    color: "white",
  },
  TouchableOpacity: {
    backgroundColor: "white",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  text: {
    marginTop: 15,
    marginLeft: -25,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: "center",
  },
  dropdown1BtnStyle: {
    width: "80%",
    height: 45,
    backgroundColor: "white",
    borderRadius: 30,
    // borderWidth: 1,
    borderColor: "#444",
  },
  dropdown1BtnTxtStyle: { color: "#444", right: 30, fontSize: 13 },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 30,
    width: 250,
  },
  dropdown1RowTxtStyle: { color: "#444", alignSelf: "center" },
});
