import * as React from "react";
import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  useColorModeValue,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import colors from "../../utils/Colors";
import { useNavigate } from "react-router-dom";
import checkAuth from "../../utils/checkAuth";

export default function LandingPage() {
  const [reload, setReload] = React.useState(false);
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      setLoggedIn(true);
    }
  }, []);

  React.useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard");
    }
  }, [loggedIn, navigate]);

  React.useEffect(() => {
    if (reload) {
      window.location.reload();
      setReload(true);
    }
  }, []);

  return (
    <>
      <VStack spacing={"50px"}>
        <Container maxW={"7xl"}>
          <Stack
            align={"center"}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}
            direction={{ base: "column", md: "row" }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
              >
                <Text
                  as={"span"}
                  position={"relative"}
                  _after={{
                    content: "''",
                    width: "full",
                    height: "30%",
                    position: "absolute",
                    bottom: 1,
                    left: 0,
                    bg: colors.primary,
                    zIndex: -1,
                  }}
                >
                  Learn once,
                </Text>
                <br />
                <Text as={"span"} color={colors.primary}>
                  use everywhere!
                </Text>
              </Heading>
              <Text color={"gray.500"}>
                Elevate Your Programming Skills with PeerPrep: Your Ultimate
                Destination for DSA Mastery! Dive into a world of challenging
                coding exercises, sharpen your problem-solving abilities, and
                prepare for coding interviews with our extensive collection of
                data structures and algorithms challenges.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: "column", sm: "row" }}
              >
                <Button
                  rounded={"full"}
                  size={"lg"}
                  fontWeight={"normal"}
                  px={6}
                  colorScheme={"red"}
                  bg={colors.primary}
                  onClick={() => navigate("/login")}
                  _hover={{ bg: colors.darkerPrimary }}
                >
                  Get started
                </Button>
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify={"center"}
              align={"center"}
              position={"relative"}
              w={"full"}
            >
              <Blob
                w={"150%"}
                h={"150%"}
                position={"absolute"}
                top={"-20%"}
                left={0}
                zIndex={-1}
                color={useColorModeValue("red.50", "red.400")}
              />
              <Box
                position={"relative"}
                height={"full"}
                width={"full"}
                overflow={"hidden"}
              >
                <Image
                  alt={"Hero Image"}
                  fit={"cover"}
                  align={"center"}
                  w={"100%"}
                  h={"100%"}
                  src={"https://i.ibb.co/ZNTHkdr/Untitled-design-13.png"}
                />
              </Box>
            </Flex>
          </Stack>
        </Container>
        <Spacer />
      </VStack>
    </>
  );
}

const Blob = (props) => {
  return (
    <Icon
      width={"100%"}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};
