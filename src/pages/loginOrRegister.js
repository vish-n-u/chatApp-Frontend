import React from "react";
import {
  Box,
  Text,
  Container,
  TabList,
  Tabs,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import "../App.css";
import Login from "../components/Authentication/login";
import Register from "../components/Authentication/register";

const LoginPage = () => {
  return (
    <div className="App">
      <Container w="100%">
        <Box
          bg="white"
          border="2px"
          borderRadius="md"
          mt="10%"
          w="100%"
          minW="52"
        >
          <Text
            display="flex"
            p="3"
            minW="100%"
            fontSize="2xl"
            justifyContent="center"
            alignItems="center"
          >
            MeChat!
          </Text>
        </Box>

        <Box
          bg="white"
          display="flex"
          w="100%"
          mt="7"
          borderRadius="md"
          justifyContent="space-between"
          p="2"
        >
          <Tabs variant="soft-rounded" w="100%">
            <TabList w="100%">
              <Tab width="50%" color="black">
                Login
              </Tab>
              <Tab width="50%" color="black">
                Register
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Register />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default LoginPage;
