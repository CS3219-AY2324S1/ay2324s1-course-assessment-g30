import { Box, Card, CardBody, Divider, Flex, Heading, Kbd, Stack, Text, useMediaQuery } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../api/Auth";
import MatchPanel from "../../components/MatchPanel/MatchPanel";
import RoomList from "../../components/RoomList/RoomList";
import Table from "../../components/Table/Table";


function Dashboard() {
  const [user, setUser] = useState([]);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (user.length === 0) {
      getUserProfile().then((data) => {
        setUser(data);
      });
    }
  }, []);

  return (
    <>
      <Flex direction={isLargerThan768 ? "row" : "column"}>
        <Box m={20}>
          <Heading>Hello, {user.username}! 👋</Heading>
          <Text lineHeight="tall" fontSize={"2xl"}>
            Ready to <Kbd shadow={"base"}>code</Kbd>?
          </Text>
        </Box>
        <MatchPanel />
      </Flex>

      <Divider />

      <Box justifyContent={"center"} display={"flex"} flexWrap={"wrap"}>
        <Stack
          spacing={isLargerThan768 ? "5" : "0"}
          direction={isLargerThan768 ? "row" : "column"}
        >
          <Card maxH={"500px"} overflow={"scroll"} my={10} mx={5}>
            <CardBody>
              <Table />
            </CardBody>
          </Card>
          <Card maxH={"500px"} overflow={"scroll"} my={10} mx={5}>
            <CardBody>
              <RoomList />
            </CardBody>
          </Card>
        </Stack>
      </Box>
    </>
  );
}

export default Dashboard;
