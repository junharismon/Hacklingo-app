import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { userLogin } from "../stores/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../helper/showToast";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersReducer.users);
  const userDetails = useSelector((state) => state.usersReducer.userDetails);
  const forumDetails = useSelector((state) => state.forumsReducer.forumDetails);
  const postDetails = useSelector((state) => state.postsReducer.postDetails);
  const articleDetails = useSelector(
    (state) => state.articlesReducer.articleDetails
  );
  const commentDetails = useSelector(
    (state) => state.commentsReducer.commentDetails
  );
  const posts = useSelector((state) => state.postsReducer.posts);
  const forums = useSelector((state) => state.forumsReducer.forums);
  const articles = useSelector((state) => state.articlesReducer.articles);
  const updateUserStatus = useSelector(
    (state) => state.usersReducer.status.updateUserDetails
  );
  const signUpStatus = useSelector(
    (state) => state.usersReducer.status.userSignUp
  );
  const loginStatus = useSelector(
    (state) => state.usersReducer.status.userLogin
  );

  // console.log(updateUserStatus, "<<< ini status update user profile");
  // console.log(signUpStatus, "<<< ini status sign up");
  console.log(loginStatus, "<<< ini status login");
  // console.log(postDetails, "<<<< ini post details");
  // console.log(commentDetails, "<<<< ini comment details");
  // console.log(posts, "<<<< ini posts");
  // console.log(users, "<<< ini users");
  // console.log(userDetails, "<<< ini user details");
  // console.log(forumDetails, "<<<< ini forum details");
  // console.log(forums, "<<<< ini forum details");
  // console.log(articles, "<<<< ini articles");
  // console.log(articleDetails, "<<<< ini article details");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      console.log("masuk login");
      dispatch(userLogin({ email, password }))
        .unwrap()
        .catch((err) => {
          // showToast("error", "Login error", err.message);
        });
    }
  };

  useEffect(() => {
    if (loginStatus === "loading") {
      showToast("info", "Logging you in ...", "Please wait a few seconds");
    }
  }, [loginStatus]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoFocus={true}
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
      <Button onPress={onHandleLogin} color="#f57c00" title="Login" />
      <Button
        onPress={() => navigation.navigate("Signup")}
        title="Go to Signup"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#444",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
  },
});
