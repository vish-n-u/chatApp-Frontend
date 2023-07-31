import React, { createContext } from "react";
import ReactDOM from "react-dom";
import userContext from "./context";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginPage from "./pages/loginOrRegister";
import { createBrowserRouter, json, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import Chat from "./pages/chat";
const root = createRoot(document.getElementById("root"));
export const setupLogging = () => {
  if (process.env.NODE_ENV === "production") {
    // Override console methods with empty functions (hiding logs in production)
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
  }
};
setupLogging();

function userInfo() {
  return localStorage.getItem("user");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

root.render(
  <ChakraProvider>
    <userContext.Provider value={userInfo()}>
      <RouterProvider router={router} />
    </userContext.Provider>
  </ChakraProvider>
);

reportWebVitals();
