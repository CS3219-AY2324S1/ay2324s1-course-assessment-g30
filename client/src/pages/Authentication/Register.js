import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form';
import { createUser } from '../../api/Auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'
import colors from '../../utils/Colors';
import * as React from 'react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({mode: 'onSubmit'});


  const [regError, setRegError] = useState(null);

  const onSubmit = async (data) => {
    setRegError(null);
    const info = {
      username: data.username,
      password: data.password,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName
   }
   
   if (errorUsername == null && errorPassword == null) {
    await createUser(info)
    .then((obj) => {
      toast({
        title: "Account Created!",
        description: "You will be redirected soon",
        status: 'success',
        duration: 6000,
        isClosable: true
      })
      setTimeout( () => {
        navigate('/')
      }, 6000)
    })
    .catch(function (error) {
      if (error.response) {
        setRegError(error.response.data.err);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Here', error.message);
      }
    
   })

  }};

  //----------------------------------------------------------
  //for username
  const [errorUsername, setErrorUsername] = useState(null);
  const [usernameInputValue, setUsernameInputValue] = useState("");
  const handleInputChange = (event) => {
    const newValue = event.target.value;

    // Define a regular expression pattern to match your criteria
    const pattern = /^[a-z0-9._-]{1,30}$/;

    // Test if the input value matches the pattern
    if (!pattern.test(newValue)) {
      setErrorUsername("Use only lowercase a-z, 0-9, ., _ or -");
      
    } else {
      setErrorUsername(null);
    }

    setUsernameInputValue(newValue);
  };

  //----------------------------------------------------------
  //for password

  const [errorPassword, setErrorPassword] = useState(null);
  const [passwordInputValue, setPasswordInputValue] = useState("");

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;

    const minLength = 8;
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);
    const hasSpecialChar = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(newPassword);

    if (
      newPassword.length < minLength ||
      !hasLowerCase ||
      !hasUpperCase ||
      !hasDigit ||
      !hasSpecialChar
    ) {
      const passwordCriteriaMessage = "Password must be at least 8 characters long. \n"
      + "Contain at least one lowercase letter. \n"
      + "Contain one uppercase letter. \n"
      + "Contain one digit. \n"
      + "Contain one special character.";
      setErrorPassword(
        passwordCriteriaMessage
      );
    } else {
      setErrorPassword(null);
    }

    setPasswordInputValue(newPassword);
  };

    
  return (
    <Flex
      minH={'100vh'}
      mt={-150}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input {...register('firstName', {
                    required: true,
                  })} type="text" maxLength={20} />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input {...register('lastName', {
                    required: true,
                  })} type="text" maxLength={20} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input {...register('email', {
                    required: true,
                  })} type="email" maxLength={254}/>
            </FormControl>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input {...register('username', {
                    required: true,
                  })} type="text" value={usernameInputValue} onChange={handleInputChange} maxLength={30} />
                  <Text color={"#cc0000"} whiteSpace={'pre-wrap'}>{errorUsername}</Text>
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input {...register('password', {
                    required: true,
                  })} type={showPassword ? 'text' : 'password'} value={passwordInputValue} onChange={handlePasswordChange} maxLength={128} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Text color={"#cc0000"} whiteSpace={'pre-wrap'}>{errorPassword}</Text>
            </FormControl>
            {regError && <Text color={"#cc0000"}>{regError}</Text>}
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={colors.primary}
                color={'white'}
                type='submit'
                _hover={{
                  bg: colors.darkerPrimary,
                }}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'} href={'/login'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
        </form>
      </Stack>
    </Flex>
  )
}
