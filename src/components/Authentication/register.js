import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  FormErrorMessage,
  VStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { registerUrl } from "../../urls";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const Toast = useToast();
  const [error, setError] = useState({
    name: false,
    email: "",
    password: false,
    confirmPassword: "",
    picture: false,
  });
  const [triedEmail, setTriedEmail] = useState([]);
  async function handlePic(pic) {
    console.log(pic, "///");
    try {
      setLoading(true);
      if (typeof pic == "undefined") {
        Toast({
          title: "Please add a picture",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      } else if (pic.type == "image/jpeg" || pic.type == "image/png") {
        const data = new FormData();
        data.append("file", pic);
        data.append("upload_preset", "chatApp");
        data.append("cloud_name", "dtpj5hbsy");
        const responseData = await fetch(
          "https://api.cloudinary.com/v1_1/dtpj5hbsy/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const responseDataJson = await responseData.json();
        console.log("success", responseDataJson, responseData);
        setPicture(responseDataJson.url.toString());
        setLoading(false);
      } else {
        Toast({
          title: "Please add a picture",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Error");
      return;
    }
  }
  function isTrue() {
    if (Object.values(error).includes(true)) return true;
    else if (error.email !== "" || error.confirmPassword !== "") return true;
    else return false;
  }
  console.log(error, triedEmail, isTrue());
  return (
    <VStack spacing="5px">
      <FormControl isRequired isInvalid={error.name}>
        <FormLabel>Name</FormLabel>

        <Input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value !== "") setError({ ...error, name: false });
            else setError({ ...error, name: true });
          }}
        />
        <FormErrorMessage>{"Name cant be empty!"}</FormErrorMessage>
      </FormControl>

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
                email: "User with this emailId already exists! try logging in",
              });
            } else {
              setError({ ...error, email: "" });
            }
          }}
        />
        {error.email && <FormErrorMessage>{error.email}</FormErrorMessage>}
      </FormControl>
      <FormControl isRequired isInvalid={error.password}>
        <FormLabel>Password</FormLabel>
        <Input
          value={password}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value !== "") setError({ ...error, password: false });
            else setError({ ...error, password: true });
          }}
        />
        <FormErrorMessage>{"password cant be empty"}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={error.confirmPassword}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          value={confirmPassword}
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <FormErrorMessage>{error.confirmPassword}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel optionalIndicator>Upload Picture</FormLabel>
        <Input type="file" onChange={(e) => handlePic(e.target.files[0])} />
      </FormControl>
      <Button
        mt="5"
        w="100%"
        colorScheme="blue"
        type="submit"
        isDisabled={isTrue() ? true : false}
        isLoading={loading}
        onClick={() => {
          handleSubmit(
            name,
            setName,
            email,
            setEmail,
            password,
            setPassword,
            confirmPassword,
            setConfirmPassword,
            picture,
            setPicture,
            error,
            setError,
            triedEmail,
            setTriedEmail,
            setLoading
          );
        }}
      >
        Submit
      </Button>
    </VStack>
  );
};

async function handleSubmit(
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  picture,
  setPicture,
  error,
  setError,
  triedEmail,
  setTriedEmail,
  setLoading
) {
  setLoading(true);
  if (name === "") {
    setError({ ...error, name: true });
    console.log("Reached before else");
    setLoading(false);
    return;
  } else if (
    email === "" ||
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false
  ) {
    setError({ ...error, email: true });
    setLoading(false);
    return;
  } else if (password === "") {
    setError({ ...error, password: true });
    setLoading(false);
    return;
  } else if (password !== confirmPassword) {
    setError({
      ...error,
      confirmPassword: "confirm password does not match your password.",
    });
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
    return;
  } else {
    const data = await fetch(registerUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        username: name,
        email: email,
        password: password,
        pic: picture,
      }),
    });
    const dataJson = await data.json();
    setLoading(false);
    console.log(dataJson, data);
    if (data.status === 201) {
      alert("success");
    } else if (data.status === 400) {
      if (dataJson.message === "email already exists") {
        setError({ ...error, email: "Email already exists try logging in!" });
        let arr = [...triedEmail];
        arr.push(email);
        setTriedEmail(arr);
        setEmail("");
      }
    } else if (data.status === 500) {
      setLoading(false);
      alert("Internal server errr, please refresh and retry!");
      return;
    }
  }
}
export default Register;
