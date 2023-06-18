import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import base_url from "./base_url";

export const fetchForumDetails = createAsyncThunk(
  "forumsSlice/fetchForumDetails", // this is the action name
  async (input, {rejectWithValue}) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/forums/${input}`,
        headers: {
          userid: userId,
        },
      });
      return response.data;
    } catch(err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const fetchAllForums = createAsyncThunk(
  "forumsSlice/fetchAllForums", // this is the action name
  async (input, {rejectWithValue}) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/forums`,
        headers: {
          userid: userId,
        },
      });
      return response.data;
    } catch(err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

const forumsSlice = createSlice({
  name: "forumsSlice",
  initialState: {
    forumDetails : {},
    forums : [],
    status : {
      forums : "idle",
      forumDetails : "idle"
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForumDetails.pending, (state, action) => {
        state.status.forumDetails = "loading";
      })
      .addCase(fetchForumDetails.fulfilled, (state, action) => {
        state.status.forumDetails = "idle";
        state.forumDetails = action.payload;
      })
      .addCase(fetchForumDetails.rejected, (state, action) => {
        state.status.forumDetails = "error";
      })
      .addCase(fetchAllForums.pending, (state, action) => {
        state.status.forums = "loading";
      })
      .addCase(fetchAllForums.fulfilled, (state, action) => {
        state.status.forums = "idle";
        state.forums = action.payload;
      })
      .addCase(fetchAllForums.rejected, (state, action) => {
        state.status.forums = "error";
      })
  },
});

export default forumsSlice.reducer;
