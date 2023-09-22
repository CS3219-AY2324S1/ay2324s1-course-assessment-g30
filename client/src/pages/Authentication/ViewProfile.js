import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../../api/Auth';
import { Center, Card, useDisclosure, Text, Stack, StackDivider, Box, Heading, CardHeader, CardBody, CardFooter, Button, HStack } from '@chakra-ui/react'
import EditProfileModal from './EditProfile';
import DeleteProfileModal from './DeleteProfile';

function ViewProfile() {

  const [user, setUser] = useState([]);

  useEffect(() => {
    if (user.length === 0) {
      getUserProfile().then((data) => {
        setUser(data);
        
      })
      
    }
   }, [])

  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()

  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()

  return (
    <Box h={'100vh'}>
      
      <EditProfileModal user={user} isOpen={isOpenEdit} onOpen={onOpenEdit} onClose={onCloseEdit} />
      <DeleteProfileModal user={user} isOpen={isOpenDelete} onOpen={onOpenDelete} onClose={onCloseDelete} />
      <Center mt={100}>
    <Stack>
    <HStack display={'flex'} justify={'space-between'}>
    <Box>
      <Button onClick={onOpenEdit}>Edit Profile</Button>
    </Box>
    <Box>
      <Button _hover={{
        backgroundColor: '#ff0f0f',
        color: 'white'
      }} onClick={onOpenDelete}>Delete Profile</Button>
    </Box>
    </HStack>
    <Card minW={'400px'}>
    <CardHeader>
      <Heading size='md'>Profile</Heading>
    </CardHeader>

    <CardBody>
      <Stack divider={<StackDivider />} spacing='4'>
        <Box>
          <Heading size='xs' textTransform='uppercase'>
            Email
          </Heading>
          <Text pt='2' fontSize='sm'>
            {user.email}
          </Text>
        </Box>
        <Box>
          <Heading size='xs' textTransform='uppercase'>
            Username
          </Heading>
          <Text pt='2' fontSize='sm'>
            {user.username}
          </Text>
        </Box>
        <Box>
          <Heading size='xs' textTransform='uppercase'>
            First Name
          </Heading>
          <Text pt='2' fontSize='sm'>
            {user.firstName}
          </Text>
        </Box>
        <Box>
          <Heading size='xs' textTransform='uppercase'>
            Last Name
          </Heading>
          <Text pt='2' fontSize='sm'>
            {user.lastName}
          </Text>
        </Box>
      </Stack>
    </CardBody>
    </Card>
    </Stack>
    </Center>
    </Box>
  )
}

export default ViewProfile