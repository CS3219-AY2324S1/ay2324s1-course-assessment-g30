import {
  Box,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { editProfile } from '../../api/Auth';


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


    if (!error) {
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