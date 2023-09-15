import {
    Button,
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
import Cookies from 'js-cookie';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProfile } from '../../api/Auth';



function DeleteProfileModal(props) {

  const toast = useToast()

  const navigate = useNavigate();

  const handleSubmit = () => {
    deleteProfile().then(() => {
        toast({
          title: 'Account deleted',
          description: "We hope to see you again soon!",
          status: 'warning',
          duration: 3000,
        })
        Cookies.remove('token');
        Cookies.remove('uuid');
        localStorage.removeItem('notAuthenticated');
      }).then(() => {
        setTimeout( () => 
          navigate('/'), 3000
        )
      })
  }


  return (
    <>
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={'2xl'} color={'#ff0f00'}>Delete Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody mt={5} >
          <Text mb='20px' fontSize={'lg'} >Do you really want to delete your account? This action can't be reverted!</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={props.onClose}>
            Close
          </Button>
          <Button type='submit' _hover={{
            backgroundColor: '#ff0f0f',
            color: 'white'
        }} onClick={() => handleSubmit()}>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default DeleteProfileModal