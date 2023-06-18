import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, database } from "../config/firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import saveToAsyncStorage from "../helper/saveToAsyncStorage";
import base_url from "./base_url";
import { loginSuccess, logout, updateSuccess } from "./authSlice";
import { FirebaseError } from "firebase/app";

export const fetchUserDetails = createAsyncThunk(
  "usersSlice/fetchUserDetails", // this is the action name
  async (_, { rejectWithValue }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/users/${userId}`,
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

export const uploadChatImage = createAsyncThunk(
  "usersSlice/uploadChatImage", // this is the action name
  async (input, { rejectWithValue }) => {
    // this is the action
    try {
      const formData = new FormData();
      formData.append("file", input);
      formData.append("context", "image");
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "POST",
        url: `${base_url}/users/chatImage`,
        headers: {
          userid: userId,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
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

export const fetchUsersByNativeLanguage = createAsyncThunk(
  "usersSlice/fetchUsersByNativeLanguage",
  async (targetLanguage, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/users`,
        headers: {
          userid: userId,
        },
        params: {
          targetLanguage,
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

export const fetchUsersBySearch = createAsyncThunk(
  "usersSlice/fetchUsersBySearch",
  async (input, { rejectWithValue }) => {
    try {
      const {search, context} = input;
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/users/usernames`,
        headers: {
          userid: userId,
        },
        params: {
          search,
        },
      });
      return {data: response.data, context};
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const userLogin = createAsyncThunk(
  "usersSlice/userLogin",
  async (input, { rejectWithValue, dispatch }) => {
    try {
      const { email, password, deviceToken } = input;

      // Login first to the project db for validation
      const response = await axios({
        method: "POST",
        url: `${base_url}/users/login`,
        data: input,
      });

      // Login to firebase after success
      await signInWithEmailAndPassword(auth, email, password);

      // Save to Async Storage
      saveToAsyncStorage(response.data);

      // Update the device token on the firebase data;
      const userRef = doc(database, "users", response.data._id);
      updateDoc(userRef, {
        deviceToken,
      });

      // Set the states
      dispatch(
        loginSuccess({
          userId: response.data._id,
          email: response.data.email,
          username: response.data.username,
          profileImageUrl: response.data.profileImageUrl || "",
          nativeLanguage: response.data.nativeLanguage,
          targetLanguage: response.data.targetLanguage,
          role: response.data.role,
          deviceToken: response.data.deviceToken,
        })
      );
      return true;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const userSignUp = createAsyncThunk(
  "usersSlice/userSignUp",
  async (input, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("email", input.email);
      formData.append("password", input.password);
      formData.append("username", input.username);
      formData.append("nativeLanguage", input.nativeLanguage);
      formData.append("targetLanguage", JSON.stringify(input.targetLanguage));
      formData.append("deviceToken", input.deviceToken);
      formData.append("role", "regular");

      if (Object.keys(input.selectedImageData).length !== 0) {
        formData.append("file", input.selectedImageData);
        formData.append("context", "image");
      }

      // Sign up first to the project database
      const response = await axios({
        method: "POST",
        url: `${base_url}/users/register`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Sign Up to firebase if success
      const { user } = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );
      // Save it to firebase database
      // Reference the document using the custom ID
      const docRef = doc(database, "users", response.data._id);

      // Create the data object for the document
      const data = {
        email: user.email,
        username: response.data.username,
        profileImageUrl: response.data.profileImageUrl || "",
        deviceToken: response.data.deviceToken,
        nativeLanguage: response.data.nativeLanguage,
        targetLanguage: response.data.targetLanguage,
      };

      // Add the document to Firestore with the custom ID
      await setDoc(docRef, data);

      // Save it to async storage
      await saveToAsyncStorage(response.data);
      dispatch(
        loginSuccess({
          userId: response.data._id,
          email: response.data.email,
          username: response.data.username,
          profileImageUrl: response.data.profileImageUrl || "",
          nativeLanguage: response.data.nativeLanguage,
          targetLanguage: response.data.targetLanguage,
          role: response.data.role,
          deviceToken: response.data.deviceToken,
        })
      );
      return true;
    } catch (err) {
      // return err.response if it was an axios error with reject with value
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const fetchOtherUserByEmail = createAsyncThunk(
  "usersSlice/fetchOtherUserByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/users/email`,
        headers: {
          userid: userId,
        },
        params: { email },
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data.message);
      } else {
        throw err;
      }
    }
  }
);

export const fetchOtherUsersByEmail = createAsyncThunk(
  "usersSlice/fetchOtherUsersByEmail",
  async (emails, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/users/emails`,
        headers: {
          userid: userId,
        },
        params: { emails },
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data.message);
      } else {
        throw err;
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  "usersSlice/logoutUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const userId = await AsyncStorage.getItem("userid");
      await AsyncStorage.clear();
      await signOut(auth);
      dispatch(logout());
      axios({
        method: "PATCH",
        url: `${base_url}/users/logout`,
        headers: {
          userid: userId,
        },
      });
      const userRef = doc(database, "users", userId);
      updateDoc(userRef, {
        deviceToken: "",
      });
    } catch (err) {
      console.log("Error logging out: ", err);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "usersSlice/updateUserDetails",
  async (input, { rejectWithValue, dispatch }) => {
    try {
      input.append("context", "image");
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "PUT",
        url: `${base_url}/users/${userId}`,
        headers: {
          userid: userId,
          "Content-Type": "multipart/form-data",
        },
        data: input,
      });

      // Save it to Async Storage
      saveToAsyncStorage(response.data);

      // Save it to firebase database
      const userRef = doc(database, "users", userId);
      updateDoc(userRef, {
        profileImageUrl: response.data.profileImageUrl,
        username: response.data.username,
        nativeLanguage: response.data.nativeLanguage,
      });

      // Save it to reducer
      dispatch(
        updateSuccess({
          username: response.data.username,
          profileImageUrl: response.data.profileImageUrl,
          nativeLanguage: response.data.nativeLanguage,
        })
      );
      return response.data;
    } catch (err) {
      // return err.response if it was an axios error with reject with value
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else if (err instanceof FirebaseError) {
        console.log(err, "masuk error firebase");
        return rejectWithValue(err);
      } else {
        console.log(err, "masuk throw error");
        return rejectWithValue(err);
      }
    }
  }
);

export const deleteUser = createAsyncThunk(
  "usersSlice/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "DELETE",
        url: `${base_url}/users/${userId}`,
        headers: {
          userid: userId,
        },
      });
      return response.data;
    } catch (err) {
      // return err.response if it was an axios error with reject with value
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

const usersSlice = createSlice({
  name: "usersSlice",
  initialState: {
    users: [],
    userDetails: {},
    usersBySearch: [],
    userByEmail: {},
    usersByEmail: [],
    status: {
      userDetails: "idle",
      users: "idle",
      updateUserDetails: "idle",
      userSignUp: "idle",
      userLogin: "idle",
      usersBySearch: "idle",
      uploadChatImage: "idle",
      userByEmail: "idle",
      usersByEmail: "idle",
    },
  },
  reducers: {
    deleteUsersBySearch(state, action) {
      state.usersBySearch = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state, action) => {
        state.status.userDetails = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status.userDetails = "idle";
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status.userDetails = "error";
      })
      .addCase(fetchUsersByNativeLanguage.pending, (state, action) => {
        state.status.users = "loading";
      })
      .addCase(fetchUsersByNativeLanguage.fulfilled, (state, action) => {
        state.status.users = "idle";
        state.users = action.payload;
      })
      .addCase(fetchUsersByNativeLanguage.rejected, (state, action) => {
        state.status.users = "error";
      })
      .addCase(fetchUsersBySearch.pending, (state, action) => {
        state.status.usersBySearch = "loading";
      })
      .addCase(fetchUsersBySearch.fulfilled, (state, action) => {
        state.status.usersBySearch = "idle";
        if (action.payload.context === "contacts") {
          state.usersBySearch = action.payload.data;
        }
      })
      .addCase(fetchUsersBySearch.rejected, (state, action) => {
        state.status.usersBySearch = "error";
      })
      .addCase(updateUserDetails.pending, (state, action) => {
        state.status.updateUserDetails = "loading";
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.status.updateUserDetails = "idle";
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status.updateUserDetails = "error";
      })
      .addCase(userSignUp.pending, (state, action) => {
        state.status.userSignUp = "loading";
      })
      .addCase(userSignUp.fulfilled, (state, action) => {
        state.status.userSignUp = "idle";
      })
      .addCase(userSignUp.rejected, (state, action) => {
        state.status.userSignUp = "error";
      })
      .addCase(userLogin.pending, (state, action) => {
        state.status.userLogin = "loading";
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status.userLogin = "idle";
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status.userLogin = "error";
      })
      .addCase(uploadChatImage.pending, (state, action) => {
        state.status.uploadChatImage = "loading";
      })
      .addCase(uploadChatImage.fulfilled, (state, action) => {
        state.status.uploadChatImage = "idle";
      })
      .addCase(uploadChatImage.rejected, (state, action) => {
        state.status.uploadChatImage = "error";
      })
      .addCase(fetchOtherUserByEmail.pending, (state, action) => {
        state.status.userByEmail = "loading";
      })
      .addCase(fetchOtherUserByEmail.fulfilled, (state, action) => {
        state.status.userByEmail = "idle";
        state.userByEmail = action.payload;
      })
      .addCase(fetchOtherUserByEmail.rejected, (state, action) => {
        state.status.userByEmail = "error";
      })
      .addCase(fetchOtherUsersByEmail.pending, (state, action) => {
        state.status.usersByEmail = "loading";
      })
      .addCase(fetchOtherUsersByEmail.fulfilled, (state, action) => {
        state.status.usersByEmail = "idle";
        state.usersByEmail = action.payload;
      })
      .addCase(fetchOtherUsersByEmail.rejected, (state, action) => {
        state.status.usersByEmail = "error";
      });
  },
});

export default usersSlice.reducer;

export const { deleteUsersBySearch } = usersSlice.actions;
