import { Box, Card, CardBody, Divider, Flex, Heading, Kbd, Stack, Text, useMediaQuery } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../api/Auth";
import Table from "../../components/Table/Table";


function Dashboard() {
  const [user, setUser] = useState([]);
  const [isLargerThan768] = useMediaQuery("(min-width: 1000px)");

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
<<<<<<< HEAD
=======
          <Stack spacing={"5"} direction={["column", "row"]}>
          </Stack>

>>>>>>> main
        </Box>
      </Flex>

      <Divider />

      <Box justifyContent={"center"} minW={"100%"}>
        <Stack
          spacing={isLargerThan768 ? "5" : "0"}
          direction={isLargerThan768 ? "row" : "column"}
          
        >
          <Card maxH={"500px"} overflow={"scroll"} my={10} mx={5}>
            <CardBody>
              <Table />
            </CardBody>
          </Card>
        </Stack>
      </Box>
    </>
  );
}

export default Dashboard;
