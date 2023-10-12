import { Box, Button, Container, Toast, Spinner, Divider, FormControl, Heading, Input, Radio, RadioGroup, Stack, Text, Textarea, useToast } from '@chakra-ui/react';
import React, {useState} from 'react';
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { addQuestion } from '../../api/QuestionServices';

function AddQuestionForm() {

  //question ID auto generated
  // Question Title Question Description Question Category Question Complexit
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  let navigator = useNavigate()

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = data => {
    setLoading(true);
    addQuestion(data.title, data.categories, data.complexity, data.link, data.description)
    .then(() => {navigator('/dashboard'); setLoading(false)})
    .catch((e) => {
      toast({
        title: 'Unable to submit',
        description: 'Please use a valid link',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      setLoading(false);
    }); 
    };
  // const onSubmit = data => {addQuestion(data.title, data.categories, data.complexity, data.link, data.description); navigator('/dashboard')};

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
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question link</Text>
          <Input {...register("link", { required: true })}/>
          {errors.link && <p style={{color: 'red'}}>This field is required</p>}
          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question Description</Text>
          <Textarea {...register("description")}/>
          <Box display={'flex'} justifyContent={'flex-end'} py={16}>
          {!loading && <Button type='submit' >Submit</Button>}
          {loading && <Spinner />}
          </Box>
        </form>
      </Container>
    

    </Box>
  )
}

export default AddQuestionForm