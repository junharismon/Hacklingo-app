import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator
} from "react-native";
import axios from "axios";
import HeaderDefault from "../components/forum/HeaderDefault";
import { ScrollView } from "react-native-gesture-handler";
import logo from "../assets/HACKLINGO.png";
import Constants from "expo-constants";
import showToast from "../helper/showToast";

const GrammarCheckScreen = () => {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [loading, setLoading] = useState("idle");
  const apiKey = Constants.manifest.extra.grammarApiKey;

  const handleGrammarCheck = async () => {
    try {
      setLoading("loading");
      const response = await axios.get("https://api.textgears.com/grammar", {
        params: {
          key: apiKey,
          text: inputText,
          language: "en-GB",
        },
      });
      if (response.data && response.data.response) {
        let corrected = inputText;

        // Sort errors by offset in descending order
        const errors = response.data.response.errors.sort(
          (a, b) => b.offset - a.offset
        );

        // Replace errors with suggestions
        errors.forEach((error) => {
          if (error.better && error.better.length > 0) {
            corrected =
              corrected.slice(0, error.offset) +
              error.better[0] +
              corrected.slice(error.offset + error.length);
          }
        });
        setCorrectedText(corrected);
        setLoading("idle");
      }
    } catch (error) {
      showToast("error", "Grammar Check Error", "There was an error when fetching grammar check result");
      console.error("Error fetching grammar check results:", error);
    }
  };

  return (
    <>
      <HeaderDefault />
      <ScrollView
        style={{ width: "100%", height: "100%", backgroundColor: "white" }}
      >
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <Text style={styles.title}>Grammar Check</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            onChangeText={setInputText}
            value={inputText}
            placeholder="Enter your text here"
          />
          <TouchableOpacity style={styles.button} onPress={handleGrammarCheck}>
            <Text style={styles.buttonText}>Check Grammar</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.correctedText}
            multiline
            textAlignVertical="top"
            numberOfLines={4}
            value={correctedText}
            editable={false}
          />
        </KeyboardAvoidingView>
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
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: -20 }, { translateY: -20 }],
            }}
          >
            {loading === "loading" && <ActivityIndicator size="large" color="#0000ff" />}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#0097b2",
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#F6F1F1",
  },
  button: {
    backgroundColor: "#0097b2",
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  correctedText: {
    borderWidth: 1,
    borderColor: "#0097b2",
    borderRadius: 4,
    padding: 20,
    fontSize: 16,
    backgroundColor: "#F6F1F1",
    fontWeight: "800",
    color: "black",
  },
});

export default GrammarCheckScreen;
