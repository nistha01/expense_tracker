import React from "react";
import { useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import LoginSignUp from "./components/login/LoginSignUp";
import Profile from "./components/profile/Profile";

const AppRouter = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);

  const loggedInRoutes = [
    { path: "", element: <Navigate to="/home" /> },
    { path: "home", element: <HomePage /> },
    { path: "profile", element: <Profile /> },
    { path: "login", element: <Navigate to="/home" /> }, // Prevent accessing login while logged in
    { path: "*", element: <Navigate to="/home" /> }, // Catch-all for logged-in users
  ];

  const loggedOutRoutes = [
    { path: "", element: <Navigate to="/login" /> },
    { path: "login", element: <LoginSignUp /> },
    { path: "*", element: <Navigate to="/login" /> },// Catch-all for logged-out users
  ];

  const router = createBrowserRouter([
    {
      path: "/",
      children: isLogin ? loggedInRoutes : loggedOutRoutes,
    },
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return <AppRouter />;
}

export default App;
