import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Divider,
  Textarea,
  useToast,
  Box,
  Button,
  Text
} from '@chakra-ui/react'
import { Controller, useForm } from "react-hook-form";
import { editProfile } from '../../api/Auth';
import colors from '../../utils/Colors';


function EditProfileModal(props) {

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    formState: { errors }
  } = useForm({defaultValues: props.user});

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
    if (!error) {
      editProfile(data).then(() => {
        toast({
          title: 'Profile Edited',
          description: "We've edited your account for you!",
          status: 'success',
          duration: 3000,
        })
        
      }).then(() => {
        setTimeout( () => 
          window.location.reload(), 3000
        )
      })
    }
  }

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
          <Input defaultValue={props.user.firstName} {...register("firstName")}/>
          {errors.firstName && <p style={{color: 'red'}}>This field is required</p>}
          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Last Name</Text>
          <Input defaultValue={props.user.lastName} {...register("lastName")}/>
          {errors.lastName && <p style={{color: 'red'}}>This field is required</p>}
          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Username</Text>
          <Input defaultValue={props.user.username} {...register("username")}/>
          {errors.username && <p style={{color: 'red'}}>This field is required</p>}
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