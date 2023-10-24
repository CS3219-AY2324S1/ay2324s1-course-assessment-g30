import {
  Box,
  Card,
  CardBody,
  Divider,
  Stack,
  Heading,
  Kbd,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import { getUserProfile } from "../../api/Auth";
import MatchPanel from "../../components/MatchPanel/MatchPanel";
import RoomList from "../../components/RoomList/RoomList";

function Dashboard() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (user.length === 0) {
      getUserProfile().then((data) => {
        setUser(data);
      });
    }
  }, []);

  return (
    <>
      <Flex>
        <Box m={20}>
          <Heading>Hello, {user.username}! 👋</Heading>
          <Text lineHeight="tall" fontSize={"2xl"}>
            Ready to <Kbd shadow={"base"}>code</Kbd>?
          </Text>
          <Stack spacing={"5"} direction={["column", "row"]}>
          </Stack>
        </Box>
        <MatchPanel />
      </Flex>

      <Divider />
      <Box justifyContent={"center"} display={"flex"} flexWrap={"wrap"}>
        <Stack spacing={"5"} direction={["column", "row"]}>
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
