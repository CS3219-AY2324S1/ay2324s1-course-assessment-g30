import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { getAuthToken } from '../../api/Auth';
import colors from '../../utils/Colors';


export default function Login() {

  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({mode: 'onSubmit',});


  
  const [formMessage, setFormMessage] = useState('')
  const [formInvalid, setFormInvalid] = useState(false)

  const onSubmit = async (data) => {
    const info = {
        email: data.email,
        password: data.password
    }
    await getAuthToken(info.email, info.password)
    .then((obj) => {
      navigate('/dashboard');
    })
    .catch(function (error) {
      if (error.response) {
        if (error.response.data.error ===  "Bad request. Check your inputs!") {
          setFormMessage("Please enter a valid email address")
        } else {
          setFormMessage(error.response.data.error)
        }
        setFormInvalid(true)
        setError("email")
        setError("password")
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Here', error.message);
      }
  
    });
    
  }

  useEffect(() => {
      if (formInvalid == false) {
          clearErrors('email')
          clearErrors('password')
      }
  }, [formInvalid])

  //for password showing
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(!show)

  return (
    <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        mt={-150}
        backgroundColor={'gray.100'}
        >
        <Stack spacing={8} mx={'auto'} minW={'lg'} px={16}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Login</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
               I love volunteering ❤️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
                    
            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
            <Stack spacing={4}>
            <FormControl isInvalid={formInvalid}>
              <FormControl isRequired id="email" isInvalid={errors?.email}>
                <FormLabel>Email address</FormLabel>
                <Input 
                {...register('email', {
                    required: true,
                  })}
                mb={'5'}
                type="text"
                onClick={() => {setFormInvalid(false);}}
                />
                {!formInvalid && <FormErrorMessage mt={-3}>{errors?.email === "required"}{"Email is required"}</FormErrorMessage> }
              </FormControl >
              <FormControl isRequired id="password" isInvalid={errors?.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input 
                {...register("password", { required: true})}
                mb={'5'}
                type={show ? 'text' : 'password'}
                onClick={() => {setFormInvalid(false);}}
                />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleShow}>
                    {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
                </InputGroup>
                {!formInvalid && <FormErrorMessage mt={-3}>{errors?.password == "required"}{"Password is required"}</FormErrorMessage> }
              </FormControl>
              {<FormErrorMessage>{formMessage}</FormErrorMessage>}
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Link color={'blue.400'} href='/forgot_password'>Forgot password?</Link>
                </Stack>
                <Button
                  bg={colors.primary}
                  color={'white'}
                  _hover={{
                    bg: colors.darkerPrimary,
                  }}
                  type={'submit'}
                  >
                  LOGIN
                </Button>
                <Link href='/register'
                  color={'blue.400'}
                  variant={'link'}
                  type={'submit'}
                  alignSelf={'center'}
                  >
                  Don't have an account?
                </Link>
              </Stack>
            </Stack>

            </form>

          </Box>
        </Stack>
      </Flex>
  )
}
