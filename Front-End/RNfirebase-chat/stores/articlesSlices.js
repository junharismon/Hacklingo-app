import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import base_url from "./base_url";

export const fetchArticles = createAsyncThunk(
  "articlesSlice/fetchArticles", // this is the action name
  async (input, { rejectWithValue, dispatch }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/articles`,
        headers: {
          userid: userId,
        },
        params : {
          search : input
        }
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const fetchArticleById = createAsyncThunk(
  "articlesSlice/fetchArticleById", // this is the action name
  async (articleId, { rejectWithValue }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/articles/${articleId}`,
        headers: {
          userid: userId,
        },
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

const articlesSlice = createSlice({
  name: "articlesSlice",
  initialState: {
    articles: [],
    articleDetails: {},
    status: {
      articleDetails: "idle",
      articles: "idle"
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state, action) => {
        state.status.articles = "loading";
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status.articles = "idle";
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status.articles = "error";
      })
      .addCase(fetchArticleById.pending, (state, action) => {
        state.status.articleDetails = "loading";
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.status.articleDetails = "idle";
        state.articleDetails = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.status.articleDetails = "error";
      })
  },
});

export default articlesSlice.reducer;
