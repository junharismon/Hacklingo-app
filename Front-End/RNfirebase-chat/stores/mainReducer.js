import { configureStore } from "@reduxjs/toolkit";
import forumsSlice from "./forumsSlice.js";
import usersSlice from "./usersSlice.js";
import postsSlice from "./postsSlice.js";
import commentsSlice from "./commentsSlice.js";
import articlesSlices from "./articlesSlices.js";
import authSlice from "./authSlice.js";

export const store = configureStore({
  reducer: {
    usersReducer: usersSlice,
    forumsReducer: forumsSlice,
    postsReducer: postsSlice,
    commentsReducer: commentsSlice,
    articlesReducer: articlesSlices,
    authReducer : authSlice
  },
});
