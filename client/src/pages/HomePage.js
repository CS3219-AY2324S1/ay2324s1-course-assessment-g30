import React from "react";
import MatchPanel from "../components/MatchPanel/MatchPanel";
import { Heading, Flex, useColorModeValue } from "@chakra-ui/react";

function HomePage() {
  return (
    <Flex minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Heading as="h2" size="xl">
        Welcome, UserName!
      </Heading>
      <MatchPanel />
    </Flex>
  );
}

export default HomePage;
