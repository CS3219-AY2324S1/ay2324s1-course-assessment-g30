import {
    Box,
    Image,
    Flex,
  } from '@chakra-ui/react';

  const AuthBar = () => {
  
    return(
      <>
        <Box 
          sx={{ position: '-webkit-sticky', /* Safari */ position: 'sticky', top: '0', }}
          bg={"darkBlue"}
          style={{ zIndex: 10 }}
          maxH={'20'}
        >
          <Flex ml={'10'}>
          <Box boxSize={'120'} pt={3} >
          <Image src={require('../../assets/images/logo.png')} alt='Skills For Good' />
          </Box>
          </Flex>
        </Box>
      </>
    )
  }
  
  export default AuthBar;