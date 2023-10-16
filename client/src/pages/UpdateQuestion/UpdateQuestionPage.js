import { Box, Button, Container, Divider, FormControl, Heading, Input, Radio, RadioGroup, Spinner, Stack, Text, Textarea, Tooltip, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuestions, updateQuestion } from '../../api/QuestionServices';


function UpdateQuestionPage() {
  const location = useLocation();
  const url = window.location.pathname;
  const question_idx = Number(url.match(/\/(\d+)$/)[1]);

  //question ID auto generated
  // Question Title Question Description Question Category Question Complexit
  const [info, setInfo] = useState([]);

  const prev_data = location.state;
  prev_data.description = prev_data.description.replace(/<div.*?>|<\/div>/g, '');
  prev_data.description = prev_data.description.replace(/<p.*?>|<\/p>/g, '');
  const [questionLinkInput, setQuestionLinkInput] = useState(!!prev_data.question_link);
  const [questionDescriptionInput, setQuestionDescriptionInput] = useState(!!prev_data.description);

  useEffect(() => {
    if (info.length === 0) {
      getQuestions().then(data => setInfo(data.filter(val => {return val.question_id === question_idx})[0]));
    }
    }, [])

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors }
  } = useForm({defaultValues: prev_data});

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [bothFieldsEmpty, setBothFieldsEmpty] = useState(false);
  let navigator = useNavigate()
    
  const onSubmit = (data, event) => {
    setLoading(true);

    if (!data.question_link && !data.description) {
      setBothFieldsEmpty(true);
      setLoading(false);
      return;
    }


    setBothFieldsEmpty(false);

    updateQuestion(data)
    .then((data) => {navigator('/dashboard'); console.log("submitted"); setLoading(false);})
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
    
  }

  const handleQuestionLinkChange = (e) => {
    setQuestionLinkInput(!!e.target.value);
  };

  const handleQuestionDescriptionChange = (e) => {
    setQuestionDescriptionInput(!!e.target.value);
  };

  return (
    <Box >
      <Container maxW={'60%'} pb={20}>
        <Heading>Edit Question: <br/> {info.question_title}</Heading>
      </Container>

      <Container maxW={'60%'} mb={100}>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question Title</Text>
          <Input defaultValue={prev_data.question_title} {...register("question_title", { required: true })}/>
          {errors.question_title && <p style={{color: 'red'}}>This field is required</p>}
          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question Category</Text>
          <Input defaultValue={prev_data.question_categories} {...register("question_categories", { required: true })}/>
          {errors.question_categories && <p style={{color: 'red'}}>This field is required</p>}
          <Divider my={10} />
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question Complexity</Text>
          
          <FormControl>
          <Controller
              control={control}
              name="question_complexity"
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
          {/* Question Link input field */}
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question Link</Text>
          <Input
            defaultValue={prev_data.question_link}
            {...register("question_link")}
            disabled={questionDescriptionInput} 
            onChange={handleQuestionLinkChange}
          />
          {errors.question_link && <p style={{color: 'red'}}>This field is required</p>}

          {/* Tooltip for disabled Question Link */}
          {questionDescriptionInput && (
            <Tooltip hasArrow label="This field is disabled because the Question Description has content">
              <Text color="gray">Question Link (disabled)</Text>
            </Tooltip>
          )}
          {bothFieldsEmpty && (
            <Text color="red">Either Question Link or Question Description must be filled</Text>
          )}

          <Divider my={10} />

          {/* Question Description textarea field */}
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'}>Question Description</Text>
          <Textarea
            defaultValue={prev_data.description}
            {...register("description")}
            disabled={questionLinkInput} 
            onChange={handleQuestionDescriptionChange}
          />
          

          {/* Tooltip for disabled Question Description */}
          {questionLinkInput && (
            <Tooltip label="Question Link is already provided">
              <Text color="gray">Question Description (disabled)</Text>
            </Tooltip>
          )}

          {bothFieldsEmpty && (
            <Text color="red">Either Question Link or Question Description must be filled</Text>
          )}
          <Box display={'flex'} justifyContent={'flex-end'} py={16}>
          {!loading && <Button type='submit'>Submit</Button>}
          {loading && <Spinner />}
          </Box>
        </form>
      </Container>
    

    </Box>
  )
}

export default UpdateQuestionPage