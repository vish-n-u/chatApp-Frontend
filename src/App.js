import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "@chakra-ui/react";

async function getData() {
  const data = await fetch("http://localhost:5000/");
  const dataFuture = await data.json();
  console.log(dataFuture);
}

function App() {
  const [c, setC] = useState(0);
  let count = 0;

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    console.log("count has increased", count);
  }, [count]);
  console.log(c, count);
  return (
    <div className="App">
      <Button
        colorScheme="pink"
        m={"10px"}
        size="lg"
        onClick={() => {
          setC(c + 1);
          count++;
        }}
      >
        Button
      </Button>
    </div>
  );
}

export default App;
