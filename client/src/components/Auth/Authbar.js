import {
    Box,
    Link,
    Flex,
  } from '@chakra-ui/react';
  import { Logo } from '../Footer/Footer'

  const AuthBar = () => {
  
    return(
      <>
        <Box 
          sx={{ position: '-webkit-sticky', /* Safari */ position: 'sticky', top: '0', }}
          style={{ zIndex: 10 }}
          maxH={'20'}
        >
          <Flex ml={'10'}>
          <Box  pt={3} >
          <Link href={'/'}>
            <Logo />
          </Link>
          </Box>
          </Flex>
        </Box>
      </>
    )
  }
  
  export default AuthBar;