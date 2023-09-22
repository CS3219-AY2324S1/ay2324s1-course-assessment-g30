import React from "react";
import MatchPanel from "../../components/MatchPanel/MatchPanel";
import { Heading, Flex, useColorModeValue } from "@chakra-ui/react";

function HomePage() {
  return (
    <Flex
      h="100vh"
      w="100%"
      bg={useColorModeValue("gray.50", "gray.800")}
      p={4}
    >
      <Heading as="h2" size="xl">
        Welcome, username!
      </Heading>
      <MatchPanel />
    </Flex>
  );
}

export default HomePage;
