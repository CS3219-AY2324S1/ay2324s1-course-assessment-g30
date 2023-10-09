import NavigationBar from "../Navbar/NavigationBar"
import Footer from "../Footer/Footer"
import {useLocation } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Container} from "@chakra-ui/react";


const Layout = ({ children }) => {
  const location = useLocation();
  
  const isLogin = () => {
    // if (location.pathname == '/' || location.pathname == '/login' || location.pathname == '/register' || location.pathname == '/forgot_password') {
      return (
        <>
        <NavigationBar /> 
        <Container maxW={'7xl'} mt={"2rem"} mb={"3rem"} style={{ zIndex: 1 }}>
          {children}
        </Container>
        </>
      );
    // } 
    // else {
    //   return (
    //     <>
    //     <AuthBar /> 
    //     <Box maxW={'full'} mt={"2rem"} mb={"3rem"} style={{ zIndex: 1 }}>
    //       {children}
    //     </Box>
    //     </>
    //   );
    // }
  }

  return (
    <>
      <ChakraProvider>
        {
          isLogin() 
        }
        <Footer />
      </ChakraProvider>
    </>
  );
}

export default Layout;