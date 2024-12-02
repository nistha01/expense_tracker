import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./components/auth/AuthContext";
import HomePage from "./components/home/HomePage";
import LoginSignUp from "./components/login/LoginSignUp";
import { useContext } from "react";
import Profile from "./components/profile/Profile";

const AppRouter = () => {
  const { isLogin } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: "/",
      children: isLogin
        ? [
            { path: "", element: <Navigate to="/home" /> },
            { path: "login", element: <Navigate to="/home" /> },
            { path: "home", element: <HomePage /> },
            {path:"profile",element:<Profile/>}
          ]
        : [
            { path: "", element: <Navigate to="/login" /> },
            { path: "login", element: <LoginSignUp /> },
            { path: "home", element: <LoginSignUp /> },
           
          ],
    },
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    
      <AppRouter/>
    
  );
}

export default App;
