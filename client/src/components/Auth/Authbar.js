import {
    Box,
    Image,
    Center,
    Flex,
  } from '@chakra-ui/react';
  import { Logo } from '../Footer/Footer'
import { useNavigate } from 'react-router-dom';

  const AuthBar = () => {

    const navigator = useNavigate();
  
    return(
      <>
        <Box 
          sx={{ position: '-webkit-sticky', /* Safari */ position: 'sticky', top: '0', }}
          
          style={{ zIndex: 10 }}
          maxH={'20'}
        >
          <Flex ml={'10'}>
          <Box boxSize={'120'} pt={3} >
            <Logo onClick={() => {navigator('/')}} />
          </Box>
          </Flex>
        </Box>
      </>
    )
  }
  
  export default AuthBar;