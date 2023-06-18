import { View, Text, Image } from "react-native";
import React from "react";

const PostImage = ({ route }) => {
  const { postImageUrl } = route.params;
  return (
    <View style={{ flex: 1}}>
      <Image source={{ uri: postImageUrl }} style={{height: "100%", resizeMode: "contain"}} />
    </View>
  );
};

export default PostImage;
