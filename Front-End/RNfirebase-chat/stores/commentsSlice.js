import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import base_url from "./base_url";

export const fetchCommentDetails = createAsyncThunk(
  "commentsSlice/fetchCommentDetails", // this is the action name
  async (input, { rejectWithValue }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/comments/${input}`,
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

export const insertNewComment = createAsyncThunk(
  "commentsSlice/insertNewComment", // this is the action name
  async (input, { rejectWithValue }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "POST",
        url: `${base_url}/comments`,
        headers: {
          userid: userId,
        },
        data : input
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

export const updateCommentById = createAsyncThunk(
  "commentsSlice/updateCommentById", // this is the action name
  async ({input, commentId}, { rejectWithValue }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "PUT",
        url: `${base_url}/comments/${commentId}`,
        headers: {
          userid: userId,
        },
        data : input
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

export const deleteCommentById = createAsyncThunk(
  "commentsSlice/deleteCommentById", // this is the action name
  async (postId, { rejectWithValue }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "DELETE",
        url: `${base_url}/comments/${postId}`,
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

const commentsSlice = createSlice({
  name: "commentsSlice",
  initialState: {
    commentDetails: {},
    status: {
      commentDetails: "idle",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentDetails.pending, (state, action) => {
        state.status.commentDetails = "loading";
      })
      .addCase(fetchCommentDetails.fulfilled, (state, action) => {
        state.status.commentDetails = "idle";
        state.commentDetails = action.payload;
      })
      .addCase(fetchCommentDetails.rejected, (state, action) => {
        state.status.commentDetails = "error";
      })
  },
});

export default commentsSlice.reducer;
