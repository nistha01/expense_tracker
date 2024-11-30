import { createContext, useState } from "react";

export const AuthContext=createContext();

export const AuthProvider = ({ children }) => {
    const [isLogin,setIsLogin]=useState(false);
    const [isUser,setUser]=useState(false);
  
    
 
  
    return (
      <AuthContext.Provider value={{ isLogin,setIsLogin,isUser,setUser }}>
        {children}
      </AuthContext.Provider>
    );
  };

  