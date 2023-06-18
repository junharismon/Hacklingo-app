import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../helper/showToast";
import { userLogin } from "../stores/usersSlice";
import logo from "../assets/HACKLINGO.png";
import { ActivityIndicator } from "react-native-paper";
import messaging from "@react-native-firebase/messaging";

export default LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loginStatus = useSelector(
    (state) => state.usersReducer.status.userLogin
  );

  const onHandleLogin = async () => {
    if (email !== "" && password !== "") {
      try {
        const deviceToken = await messaging().getToken();
        await dispatch(userLogin({ email, password, deviceToken })).unwrap();
        showToast("success", "Login success", "You logged in successfully")
      } catch(err) {
        showToast("error", "Login error", err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.inputContainer}>
        <Image
          style={[styles.icon, styles.inputIcon]}
          source={{
            uri: "https://img.icons8.com/ios-filled/512/circled-envelope.png",
          }}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Image
          style={[styles.icon, styles.inputIcon]}
          source={{ uri: "https://img.icons8.com/ios-glyphs/512/key.png" }}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Password"
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      {loginStatus === "loading" ? (
        <View style={{marginBottom: 15}}>
          <ActivityIndicator style={{marginBottom: 5}} />
          <Text>Logging you in...</Text>
        </View>
      ) : (
      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        style={styles.buttonContainer}
      >
        <Text
          style={{
            textDecorationLine: "underline",
            color: "blue",
            fontSize: 12,
          }}
        >
          Don't have an account? register here
        </Text>
      </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onHandleLogin}
        style={[styles.buttonContainer, styles.loginButton]}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B0E0E6",
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
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  icon: {
    width: 30,
    height: 30,
  },
  inputIcon: {
    marginLeft: 15,
    justifyContent: "center",
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
  loginButton: {
    backgroundColor: "#3498db",
  },
  fabookButton: {
    backgroundColor: "#3b5998",
  },
  googleButton: {
    backgroundColor: "#ff0000",
  },
  loginText: {
    color: "white",
  },
  restoreButtonContainer: {
    width: 250,
    marginBottom: 15,
    alignItems: "flex-end",
  },
  socialButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    color: "#FFFFFF",
    marginRight: 5,
  },
});
