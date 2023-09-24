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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const toast = useToast()

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({mode: 'onSubmit'});

  const onSubmit = async (data) => {
    const info = {
      username: data.username,
      password: data.password,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName
   }
   console.log(info)
    
    await createUser(info)
    .then((obj) => {
      toast({
        title: "Account Created!",
        description: "You will be redirected soon",
        status: 'success',
        duration: 6000,
        isClosable: true
      })
    }).then(
      setTimeout( () => {
        navigate('/')
      }, 6000)
    )
    .catch(function (error) {
      if (error.response) {
        // if (error.response.data.error ===  "Bad request. Check your inputs!") {
        //   setFormMessage("Please enter a valid email address")
        // } else {
        //   setFormMessage(error.response.data.error)
        // }
        // setFormInvalid(true)
        // setError("email")
        // setError("password")
        console.log(error)
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Here', error.message);
      }
  })};
    
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
                  })} type="text" />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input {...register('lastName', {
                    required: true,
                  })} type="text" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input {...register('email', {
                    required: true,
                  })} type="email" />
            </FormControl>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input {...register('username', {
                    required: true,
                  })} type="text" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input {...register('password', {
                    required: true,
                  })} type={showPassword ? 'text' : 'password'} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
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
