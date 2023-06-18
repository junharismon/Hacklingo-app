import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { userSignUp } from "../stores/usersSlice";

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errMessage, setErrMessage] = useState("");
  
  const signUpStatus = useSelector(
    (state) => state.usersReducer.status.userSignUp
    );
  const dispatch = useDispatch();

  const onHandleSignup = async () => {
    if (email !== "" && password !== "" && username !== "") {
      dispatch(userSignUp({ email, password, username }))
        .unwrap()
        .catch((err) => {
          setErrMessage(err.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create new account</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        autoCapitalize="none"
        textContentType="username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      
      <Button onPress={onHandleSignup} color="#f57c00" title="Signup" />
      <Button
        onPress={() => navigation.navigate("Login")}
        title="Go to Login"
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 12
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#444',
        alignSelf: 'center',
        paddingBottom: 24
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 12
    }
});