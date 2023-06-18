import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import logo from "../../assets/HACKLINGO.png"
export default function Comments() {
  const [title, setTitle] = useState('');

  const onHandleCreate = () => {
    console.log('Title:', title);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={logo} style={{ height: 320, width: "100%", opacity: 0.3 }} >
      </ImageBackground>
        <View style={{ opacity: 1}}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            placeholder="Enter Comment here"
          />

          <TouchableOpacity style={styles.button} onPress={onHandleCreate}>
            <Text style={styles.buttonText}>Create Comment</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    backgroundColor: "white"
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});