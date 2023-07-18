import React, { createContext } from "react";
import ReactDOM from "react-dom";
import userContext from "./context";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import LoginPage from "./loginPage";
import { createBrowserRouter, json, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import Chat from "./components/Authentication/chat";
const root = createRoot(document.getElementById("root"));
const userInfo = {
  user: JSON.parse(localStorage.getItem("user")),
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

root.render(
  <ChakraProvider>
    <userContext.Provider value={userInfo}>
      <RouterProvider router={router} />
    </userContext.Provider>
  </ChakraProvider>
);

reportWebVitals();
