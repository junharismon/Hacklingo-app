import React, { useEffect } from "react";
import { ScrollView, Text, StyleSheet, Image, View, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticleById } from "../../stores/articlesSlices";
import showToast from "../../helper/showToast";

const Article = () => {
  const route = useRoute();
  const { articleId } = route.params;
  const dispatch = useDispatch();
  const articleDetails = useSelector(
    (state) => state.articlesReducer.articleDetails
  );
  const fetchArticleDetailsStatus = useSelector(
    (state) => state.articlesReducer.status.articleDetails
  );

  useEffect(() => {
    dispatch(fetchArticleById(articleId))
      .unwrap()
      .catch((err) => showToast("error", "Fetch Data Error", err.message));
  }, [articleId]);

  if (fetchArticleDetailsStatus === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 20, paddingTop: 10}}>
      <Text style={styles.title}>
        {articleDetails.title}
      </Text>
      <Text style={styles.subtitle}>Published on May 10, 2023</Text>
      <Text style={styles.author}>By Admin</Text>
      <Image
        style={{ height: 200, width: "100%" }}
        source={{
          uri: articleDetails.articleImageUrl,
        }}
      />
      <Text style={[styles.content, { marginTop: 10 }]}>
        {articleDetails.content}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    // backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  content: {
    fontStyle: "italic",
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 10,
    padding: 5,
  },
});

export default Article;
