import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  isUser: false,
  gmail: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin(state, action) {
      state.isLogin = action.payload;
    },
    setUser(state, action) {
      state.isUser = action.payload;
    },
    setGmail(state, action) {
      state.gmail = action.payload;
    },
    setExpenseList(state,action){
      state.sepenseList=action.payload;
    },
    setFormisOpen(state,action){
      state.isFormOpen=action.payload;
    }
  },
});

export const { setLogin, setUser, setGmail,isLogin,setExpenseLi,setFormisOpen } = authSlice.actions;
export default authSlice.reducer;