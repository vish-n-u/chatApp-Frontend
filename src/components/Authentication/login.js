import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  FormErrorMessage,
  VStack,
  useToast,
  Toast,
} from "@chakra-ui/react";
import { loginUrl } from "../../urls";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [triedEmail, setTriedEmail] = useState([]); // stores set of email which have been tried
  const [triedPassword, setTriedPassword] = useState([]); // stores set of passwords which have been tried
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();
  const Toast = useToast();

  /**
   *
   * email and password empty check
   */
  function isTrue() {
    if (Object.values(error).includes(true)) return true;
    else if (error.email !== "" || error.password !== "") return true;
    else return false;
  }
  return (
    <VStack spacing="5px">
      <FormControl isRequired isInvalid={error.email}>
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                e.target.value
              ) === false
            ) {
              setError({ ...error, email: "invalid Email-Id" });
            } else if (triedEmail.includes(e.target.value)) {
              setError({
                ...error,
                email: "User with this emailId doesnt exists! try registering",
              });
            } else {
              setError({ ...error, email: "" });
            }
          }}
        />
        <FormErrorMessage>{error.email}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={error.password}>
        <FormLabel>Password</FormLabel>
        <Input
          value={password}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value === "")
              setError({ ...error, password: "password cant be empty" });
            else setError({ ...error, password: "" });
          }}
        />
        <FormErrorMessage>{error.password}</FormErrorMessage>
      </FormControl>

      <Button
        mt="5"
        w="100%"
        colorScheme="blue"
        type="submit"
        isDisabled={isTrue() ? true : false}
        isLoading={isLoading}
        onClick={() => {
          handleSubmit(
            email,
            setEmail,
            password,
            setPassword,
            error,
            setError,
            triedEmail,
            setTriedEmail,
            triedPassword,
            setTriedPassword,
            setIsLoading,
            Toast,
            Navigate
          );
        }}
      >
        Submit
      </Button>
      <Button
        colorScheme="red"
        mt="1"
        w="100%"
        type="submit"
        isLoading={isLoading}
        onClick={() =>
          handleEnterAsGuest(
            setEmail,
            setPassword,
            setIsLoading,
            Toast,
            Navigate
          )
        }
      >
        Enter as Guest
      </Button>
    </VStack>
  );
};

/**
 * Logs in the user and handles success and failure scenarios.
 *@returns {Object} An object containing either token and user details (in case of success) or an error message (in case of failure).
 * If login is successful, the token and user details are stored in localStorage and a success Toast is displayed.
 *  If login fails due to incorrect email or password, the corresponding input field will be cleared and an error Toast will be displayed.
 *
 */
async function handleSubmit(
  email,
  setEmail,
  password,
  setPassword,
  error,
  setError,
  triedEmail,
  setTriedEmail,
  triedPassword,
  setTriedPassword,
  setIsLoading,
  Toast,
  Navigate
) {
  setIsLoading(true);

  if (
    email === "" ||
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false
  ) {
    setError({ ...error, email: "Invalid Email!" });
    Toast({
      status: "error",
      title: "Error",
      description: "Invalid Email!",
      duration: 5000,
    });
    setIsLoading(false);
    return;
  } else if (password === "") {
    setError({ ...error, password: true });
    Toast({
      title: "Error",
      description: "Password cant be empty!",
      status: "error",
      duration: 5000,
    });
    setIsLoading(false);
    return;
  } else {
    const data = await fetch(loginUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const dataJson = await data.json();

    setIsLoading(false);
    if (data.status === 200) {
      Toast({
        status: "success",
        title: "Success",
        description: "Login Successful",
        duration: 5000,
      });
      localStorage.setItem("token", dataJson.token);
      localStorage.setItem("user", dataJson.user);
      Navigate("/chat");
    } else if (data.status === 401) {
      if (dataJson.message === "Incorrect email") {
        setError({
          ...error,
          email: "Email doesnt exists try registering in!",
        });
        let arr = [...triedEmail];
        arr.push(email);
        setTriedEmail(arr);
        setEmail("");
        Toast({
          status: "error",
          title: "error",
          description: " Email doesnt exists try registering in",
          duration: 5000,
        });
      } else if (dataJson.message === "Incorrect password") {
        setError({ ...error, password: "Incorrect Password!" });
        let arr = [...triedPassword];
        arr.push(triedPassword);
        setTriedPassword(arr);
        setPassword("");
        Toast({
          status: "error",
          title: "error",
          description: "Incorrect Password!",
          duration: 5000,
        });
      }
    } else if (data.status === 500) {
      Toast({
        status: "error",
        title: "Server Error",
        description: "Please refresh and retry",
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }
  }
}
/**
 * Logs in the Guest User and handles success and failure scenarios.
 *@returns {Object} An object containing either token and user details (in case of success) or an error message (in case of failure).
 * If login is successful, the token and user details are stored in localStorage and a success Toast is displayed.
 *  If login fails because of internal server err, an err message is displayed
 *
 */
async function handleEnterAsGuest(
  setEmail,
  setPassword,
  setIsLoading,
  Toast,
  Navigate
) {
  setIsLoading(true);
  setEmail("guestEmail@email.com");
  setPassword("1234");
  try {
    const data = await fetch(loginUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        email: "guestEmail@email.com",
        password: "1234",
      }),
    });
    const dataJson = await data.json();
    console.log(dataJson, data);
    localStorage.setItem("token", dataJson.token);
    localStorage.setItem("user", dataJson.user);
    Navigate("/chat");
    setIsLoading(false);
    Toast({
      status: "success",
      title: "Success",
      description: "Login Successful",
      duration: 5000,
    });
  } catch (e) {
    console.log(e);
    setIsLoading(false);
    Toast({
      status: "error",
      title: "Error",
      description: "Internal server error",
      duration: 5000,
    });
  }
}
export default Login;
