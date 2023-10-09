import { Container, Input, FormErrorMessage, FormControl, Radio, RadioGroup, Stack, Divider, Heading, Box, Text, Textarea, Spacer, Button } from '@chakra-ui/react'
import React, {useEffect, useState} from 'react'
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { addTableStorage } from '../../utils/localStorage/localStorage';

function AddQuestionForm() {

  //question ID auto generated
  // Question Title Question Description Question Category Question Complexit
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  let nagivator = useNavigate()

  

  const onSubmit = data => {addTableStorage(data.title, data.categories, data.description, data.complexity); nagivator('/')};

  return (
    
    <Box >
      <Container maxW={'60%'} pb={20}>
        <Heading>Add Question</Heading>
      </Container>

      <Container maxW={'60%'} mb={100}>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question Title</Text>
          <Input {...register("title", { required: true })}/>
          {errors.title && <p style={{color: 'red'}}>This field is required</p>}
          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question Category</Text>
          <Input {...register("categories", { required: true })}/>
          {errors.categories && <p style={{color: 'red'}}>This field is required</p>}
          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question Complexity</Text>
          
          <FormControl>
          <Controller
              control={control}
              rules={{ required: "This field is required" }}
              name="complexity"
              defaultValue={"Easy"}
              render={({ field }) => (
          <RadioGroup {...field} >
            <Stack direction='row' spacing={16}>
              <Radio size='md' value='Easy'>Easy</Radio>
              <Radio size='md' value='Medium'>Medium</Radio>
              <Radio size='md' value='Hard'>Hard</Radio>
            </Stack>
          </RadioGroup>
              )}
          />
          </FormControl>
          
          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question Description</Text>
          <Textarea {...register("description", { required: true })}/>
          {errors.description && <p style={{color: 'red'}}>This field is required</p>}
          <Box display={'flex'} justifyContent={'flex-end'} py={16}>
          <Button type='submit' >Submit</Button>
          </Box>
        </form>
      </Container>
    

    </Box>
  )
}

export default AddQuestionForm