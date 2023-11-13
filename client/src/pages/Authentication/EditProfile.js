import {
  Box,
  Button,
  Divider,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  InputRightElement
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { editProfile } from '../../api/Auth';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'


function EditProfileModal(props) {

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    formState: { errors }
  } = useForm({defaultValues: props.user});

  const prevUsername = props.user.username;

 
  
  
  
  const [errMsg, setErrMsg] = useState(null);

  const toast = useToast()
  const onSubmit = (data) => {
    let error = false;
    if (data.firstName.length === 0) {
      setError('firstName')
      error = true
    }
    if (data.lastName.length === 0) {
      setError('lastName')
      error = true
    }
    if (data.username.length === 0) {
      setError('username')
      error = true
    }

    if (data.username === prevUsername) {
      delete data.username;
    }

    if (data.password.length === 0) {
      delete data.password;
    }
    console.log(errorPasswordConfirmation)
    if (!error && errorPassword == null && (errorPasswordConfirmation == null || passwordInputValue.length === 0)) {
      editProfile(data).then(() => {
        toast({
          title: 'Profile Edited',
          description: "We've edited your account for you!",
          status: 'success',
          duration: 3000,
        })
        setTimeout( () => 
          window.location.reload(), 3000
        )
      }).catch((e) => {
        setErrMsg(e.response.data.err)
      })
    }
  }

  useEffect(() => {
    setUsernameInputValue(props.user.username);
  }, [props.user.username]);



    //----------------------------------------------------------
  //for username
  const [errorUsername, setErrorUsername] = useState(null);
  const [usernameInputValue, setUsernameInputValue] = useState(props.user.username);
  const handleInputChange = (event) => {
    setErrMsg(null);
    const newValue = event.target.value;

    const pattern = /^[a-z0-9._-]{1,30}$/;

    if (!pattern.test(newValue)) {
      setErrorUsername("Use only lowercase a-z, 0-9, ., _ or -");
      
    } else {
      setErrorUsername(null);
    }

    setUsernameInputValue(newValue);
  };

    //----------------------------------------------------------
  //for password
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');

  
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorPasswordConfirmation, setErrorPasswordConfirmation] = useState(null);
  const [passwordInputValue, setPasswordInputValue] = useState('');
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;

    const minLength = 8;
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);
    const hasSpecialChar = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(newPassword);

    if (newPassword.length === 0) {
      setErrorPassword(null);
      setPasswordConfirm('');
      setErrorPasswordConfirmation(null);
    } else if (
      (newPassword.length < minLength) ||
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
      setError('password');
    } else {
      setErrorPassword(null);
      setErrorPasswordConfirmation(null);
    }

    setPasswordInputValue(newPassword);
  };

  const handlePasswordConfirmChange = (event) => {
    const newPassword = event.target.value;
    console.log(event.target.id)

    const passwordCriteriaMessage = "Please ensure both passwords are the same";
    
    if (newPassword !== passwordInputValue && event.target.id === 'passwordConfirm') {
      setErrorPasswordConfirmation(
        passwordCriteriaMessage
      );
    } else if (newPassword !== passwordConfirm && event.target.id === 'password') {
      setErrorPasswordConfirmation(
        passwordCriteriaMessage
      );
    } else {
      setErrorPasswordConfirmation(null);
    }

    if (event.target.id === 'passwordConfirm') {
      setPasswordConfirm(newPassword);
    }
  };


  return (
    <>
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader fontSize={'2xl'}>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody mt={5} mb={-20}>
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>First Name</Text>
          <Input defaultValue={props.user.firstName} {...register("firstName")} maxLength={20}/>
          {errors.firstName && <p style={{color: 'red'}}>This field is required</p>}

          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Last Name</Text>
          <Input defaultValue={props.user.lastName} {...register("lastName")} maxLength={20}/>
          {errors.lastName && <p style={{color: 'red'}}>This field is required</p>}
          
          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Username</Text>
          <Input {...register('username', {
                    required: true,
                  })} type="text" value={usernameInputValue} onChange={handleInputChange} maxLength={30} />
          {errors.username && <p style={{color: 'red'}}>This field is required</p>}
          <Text color={"#cc0000"} whiteSpace={'pre-wrap'}>{errorUsername}</Text>
          {errMsg && <p style={{color: 'red', marginTop: 20}}>{errMsg}</p>}

          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Password</Text>
          <InputGroup>
          <Input id='password' {...register('password', {
                  })} type={showPassword ? 'text' : 'password'} value={passwordInputValue} onChange={(e) => {handlePasswordChange(e); handlePasswordConfirmChange(e)}} maxLength={128} />
          <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
          </InputRightElement>
          </InputGroup>
          {passwordInputValue.length > 0 && <Text color={"#cc0000"} whiteSpace={'pre-wrap'}>{errorPassword}</Text>}
          {passwordInputValue.length > 0 && errorPassword == null && <><Text mb='20px' pt={10} fontSize={'lg'} fontWeight={'semibold'}>Confirm Password</Text>
          <InputGroup >
          <Input id='passwordConfirm' type={confirmShowPassword ? 'text' : 'password'} 
                  onChange={handlePasswordConfirmChange} value={passwordConfirm} maxLength={128} />
          <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setConfirmShowPassword((showPassword) => !showPassword)}>
                    {confirmShowPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
          </InputRightElement>
          </InputGroup></>}
          {passwordInputValue.length > 0 && errorPasswordConfirmation !== null && <Text color={"#cc0000"} whiteSpace={'pre-wrap'}>{errorPasswordConfirmation}</Text>}
          <p style={{ color: 'gray', fontSize: '14px', marginTop: 20}}>Note: If you wish to keep the password unchanged, please leave the password field blank.</p>
          <Box display={'flex'} justifyContent={'flex-end'} py={16}>
          </Box>
        </ModalBody>
        <ModalFooter>
          
          <Button type='submit'>Submit</Button>
        </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  </>
  )
}

export default EditProfileModal