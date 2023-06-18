import { View, Text, Image } from "react-native";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Comment = ({ comment }) => {

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
          marginLeft: 10,
        }}
      >
        <Image
          source={{ uri: comment.userId.profileImageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA" }}
          style={{ height: 30, width: 30, borderRadius: 100 }}
        />
        <Text
          style={{
            color: "grey",
            fontSize: 12,
            marginLeft: 10,
            fontWeight: "500",
          }}
        >
          {comment.userId.username} • {dayjs(comment.createdAt).fromNow(false)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 50,
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 12, marginLeft: 10, fontWeight: "400" }}>
          {comment.content}
        </Text>
      </View>
    </View>
  );
};

export default Comment;
