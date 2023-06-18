import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { insertNewComment } from "../../stores/commentsSlice";
import { fetchPostDetails } from "../../stores/postsSlice";
import showToast from "../../helper/showToast";
import { ActivityIndicator } from "react-native-paper";
import Comment from "../../components/forum/Comment";

export default function DetailScreen({ navigation, route }) {
  const { id } = route.params;
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();

  const postDetails = useSelector((state) => state.postsReducer.postDetails);
  const postDetailsStatus = useSelector(
    (state) => state.postsReducer.status.postDetails
  );
  const lebar = Dimensions.get("window").height;

  const handleAddComment = async () => {
    try {
      const input = { content: commentText, postId: postDetails._id };
      await dispatch(insertNewComment(input)).unwrap();
      setCommentText("");
      await dispatch(fetchPostDetails(id)).unwrap(); // Fetch the comments once again after success add comment
      showToast(
        "success",
        "Add Comment Success",
        "Your comment has been added"
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    dispatch(fetchPostDetails(id))
      .unwrap()
      .catch((err) => showToast("error", "Error Fetching Post", err.message));
  }, [id]);

  if (postDetailsStatus === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View
          style={{
            backgroundColor: "white",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          <View
            style={{
              marginLeft: 20,
              marginTop: 5,
              padding: 5,
              flexDirection: "row",
            }}
          >
            <Image
              source={{
                uri:
                  postDetails.userId?.profileImageUrl ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
              }}
              style={{ height: 40, width: 40, borderRadius: 100 }}
            />
            <View>
              <Text style={{ marginLeft: 20 }}>
                {postDetails.userId?.username}
              </Text>
              <Text style={{ marginTop: 5, marginLeft: 20, color: "grey" }}>
                {postDetails.createdAt?.split("T")[0]}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 5 }}>
            <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: "500" }}>
              {postDetails.title}
            </Text>
          </View>
          {postDetails.postImageUrl && (
            <View style={{ marginTop: 10, width: "100%", height: lebar * 0.3 }}>
              <TouchableOpacity
                onPress={() => {
                  return navigation.navigate("Image", {
                    postImageUrl: postDetails.postImageUrl,
                  });
                }}
              >
                <Image
                  source={{ uri: postDetails.postImageUrl }}
                  style={{ height: "100%", width: "100%" }}
                />
              </TouchableOpacity>
            </View>
          )}
          {/* content */}
          <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
            <Text style={{ color: "black", fontWeight: "300", fontSize: 15 }}>
              {postDetails.content}
            </Text>
          </View>
          <View style={{ justifyContent: "flex-start" }}>
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
                marginLeft: 10,
                borderBottomWidth: 5,
                borderColor: "#F6F1F1",
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              <Ionicons
                name="ios-chatbox-outline"
                size={20}
                color="black"
                style={{ marginLeft: 20 }}
              />
              <Text style={{ fontSize: 12, color: "grey", marginLeft: 5 }}>
                {" "}
                {postDetails.comments?.length}{" "}
              </Text>
            </View>
            {/* comment di forum */}
            {postDetails.comments?.length > 0 ? (
              postDetails.comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))
            ) : (
              <View style={{ backgroundColor: "#F6F1F1" }}>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    color: "gray",
                  }}
                >
                  No comments found. Be the first one to comment!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 25,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginHorizontal: 12,
            flex: 1,
            marginRight: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            placeholder="Add Comment"
            onChangeText={(text) => setCommentText(text)}
            value={commentText}
            width={"90%"}
          />
          <TouchableOpacity onPress={handleAddComment}>
            <Ionicons name="ios-paper-plane-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
