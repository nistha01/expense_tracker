import { createContext, useState } from "react";

export const AuthContext=createContext();

export const AuthProvider = ({ children }) => {
    const [isLogin,setIsLogin]=useState(false);
    const [isUser,setUser]=useState(false);
    const [gmail,setGmail]=useState("");
  
    
 
  
    return (
      <AuthContext.Provider value={{ isLogin,setIsLogin,isUser,setUser,gmail,setGmail }}>
        {children}
      </AuthContext.Provider>
    );
  };

  