import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        userId : null,
        email : null,
        username: null,
        profileImageUrl: "",
        nativeLanguage : null,
        targetLanguage : [],
        role : null,
        deviceToken: null,
        usersByNativeLanguageFetched: false
    },
    reducers: {
        loginSuccess(state, action) {
            state.userId = action.payload.userId
            state.email = action.payload.email
            state.username = action.payload.username
            state.profileImageUrl = action.payload.profileImageUrl
            state.nativeLanguage = action.payload.nativeLanguage
            state.targetLanguage = action.payload.targetLanguage
            state.role = action.payload.role
            state.deviceToken = action.payload.deviceToken
        },
        updateSuccess(state, action) {
            state.username = action.payload.username
            state.profileImageUrl = action.payload.profileImageUrl
            state.nativeLanguage = action.payload.nativeLanguage
        },
        setFetchStatus(state) {
            state.usersByNativeLanguageFetched = true
        },
        logout(state){
            state.userId = null
            state.email = null
            state.username = null
            state.profileImageUrl = null
            state.nativeLanguage = null
            state.targetLanguage = null
            state.role = null,
            state.deviceToken = null
        }
    },
  });
  
  export default authSlice.reducer;

  export const { loginSuccess, logout, updateSuccess, setFetchStatus } = authSlice.actions