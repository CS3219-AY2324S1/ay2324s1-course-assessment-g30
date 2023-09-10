import React from "react";
import MatchPanel from "../components/MatchPanel/MatchPanel";
import { Heading } from "@chakra-ui/react";

function HomePage() {
  return (
    <div>
      <Heading as="h2" size="xl">
        Welcome, UserName!
      </Heading>
      <MatchPanel />
    </div>
  );
}

export default HomePage;
