import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import CustomImageCarousalLandscape from './Landingpage/CustomImageCarousalLandscape';
import Carousel from './Landingpage/Carousel'
import HeaderDefault from '../components/forum/HeaderDefault';
import { fetchArticles } from '../stores/articlesSlices';
import showToast from '../helper/showToast';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
const lebar = Dimensions.get("window").width


const LandingPage = () => {
  const dispatch = useDispatch()
  const articles = useSelector((state) => state.articlesReducer.articles);
  const navigation = useNavigation();
  
  useEffect(() => {
    dispatch(fetchArticles())
      .unwrap()
      .catch((err) => showToast("error", "fetch data error", err.message));
  }, []);

  const data = articles.map((article) => ({
    title: article.title,
    url: article.articleImageUrl, // Replace with the actual image URL from your data if available
    description: article.content, // Add a description if available in your data
    id: article._id,
  }));

  const data2 = [
    {
      language: "English",
      image: require('../assets/flag_inggris.jpeg'),
    },
    {
      language: "Indonesian/Bahasa Indonesia",
      image: require('../assets/Flag_Indonesia.png'),
    },
    {
      language: "Dutch/Nederlands",
      image: require('../assets/Flag_Dutch.png'),
    },
    {
      language: "German/Deutsch",
      image: require('../assets/Flag_Germany.jpg'),
    },
    {
      language: "Spanish/Español",
      image: require('../assets/Flag_Spanish.png'),
    },
    {
      language: "Japanese/日本語",
      image: require('../assets/Flag_Japanese.jpeg'),
    },
    {
      language: "French/Français",
      image: require('../assets/Flag_French.png'),
    },
  ];
  const handleArticlePress = (article) => {
    navigation.navigate('Article', { articleId : article.id }); // Navigate to DetailScreen with article data
  };
  const navigateToGroups = (language) => {
    navigation.navigate("Chats", { screen: "Find Groups", params : { language } });
  };

  const fetchArticlesStatus = useSelector(state => state.articlesReducer.status.articles);

  return (
    <>
      <HeaderDefault />
      <SafeAreaView style={styles.container}>
        <View style={styles.topCarouselContainer}>
          {fetchArticlesStatus === "loading" ? (
            <ActivityIndicator size={24} />
          ) : (
            <Carousel
              data={data}
              autoPlay={true}
              pagination={true}
              onPress={handleArticlePress}
            />
          )}
        </View>
        <View style={styles.bottomCarouselContainer}>
          <Text style={styles.text}>FIND GROUP</Text>
          <CustomImageCarousalLandscape
            data={data2}
            autoPlay={false}
            pagination={true}
            navigateToGroups={navigateToGroups}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
    fontSize: 22,
    fontWeight: "bold",
    width: lebar * 1
  },
  topCarouselContainer: {
    marginBottom: 40,
    height: 300,
    alignItems: "center",
    justifyContent: "center"
  },
  bottomCarouselContainer: {
    marginBottom: 40,
    height: 200,
    alignItems: "center",
    justifyContent: "center"
  },
  carouselFlag: {
    marginBottom: 40,
    width: lebar * 2
  }
});