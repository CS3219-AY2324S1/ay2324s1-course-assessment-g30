import { Box, Button, Container, Divider, InputGroup, InputLeftAddon, FormControl, Heading, Input, Radio, RadioGroup, Spinner, Stack, Text, Textarea, Tooltip, useToast } from '@chakra-ui/react';
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

  let prev_data = location.state;
  prev_data.description = prev_data.description.replace(/<div.*?>|<\/div>/g, '');
  prev_data.description = prev_data.description.replace(/<p.*?>|<\/p>/g, '');
  if (typeof(prev_data.question_categories) == typeof([])) {
    prev_data.question_categories = prev_data.question_categories.join(', ');
  }
  if (prev_data.question_link) {
    prev_data.question_link = String(prev_data.question_link).split('/');
    prev_data.question_link = prev_data.question_link[prev_data.question_link.length - 1];
  }

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
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({defaultValues: prev_data});

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [questionLink, setQuestionLink] = useState(prev_data.question_link.length === 0 ? '' : prev_data.question_link);
  const [questionDescription, setQuestionDescription] = useState(prev_data.description.length === 0 ? '' : prev_data.question_description);


  let navigator = useNavigate()
    
  const onSubmit = (data, event) => {
    setLoading(true);

    const trimmedData = {
      ...data,
      question_title: data.question_title.trim(),
      question_complexity: data.question_complexity.trim(),
      question_link: data.question_link.trim().length === 0 ? "" : `https://leetcode.com/problems/${data.question_link.trim()}`,
      question_description: data.question_description.trim(),
      question_categories: data.question_categories
      .split(',')
      .map((category) => category.trim())
      .filter((category) => category.length > 0)
    };

    if (!trimmedData.question_link.length  && !trimmedData.description ) {
      setError("link", {
        type: "manual",
        message: "Please provide a question link or description",
      });
  
      setError("description", {
        type: "manual",
        message: "Please provide a question link or description",
      });
  
      setLoading(false);
    } else {
      clearErrors("link");
      clearErrors("description");

      updateQuestion(trimmedData)
      .then((data) => {navigator('/dashboard'); console.log("submitted"); setLoading(false);})
      .catch((e) => {
        toast({
          title: 'Unable to submit',
          description: e.response.data.message !== null ? e.response.data.message : "",
          status: 'warning',
          duration: 4000,
          isClosable: true,
        });
        setLoading(false);
      });
    }
    
  }

  // const handleQuestionLinkChange = (e) => {
  //   setQuestionLinkInput(!!e.target.value);
  // };

  // const handleQuestionDescriptionChange = (e) => {
  //   setQuestionDescriptionInput(!!e.target.value);
  // };

  const handleLinkChange = (e) => {
    if (errors.link) {
      clearErrors("link");
      clearErrors("description");
    }
    setQuestionLink(e.target.value);
    if (e.target.value) {
      setQuestionDescription('');
    }
  };
  
  const handleDescriptionChange = (e) => {
    if (errors.link) {
      clearErrors("link");
      clearErrors("description");
    }
    setQuestionDescription(e.target.value);
    if (e.target.value) {
      setQuestionLink('');
    }
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
          <Text mb='20px' fontSize={'lg'} fontWeight={'semibold'} >Question Category</Text>
          <Input placeholder='Example: data structures, array, dynamic programming' defaultValue={prev_data.question_categories} {...register("question_categories", { required: true })}/>
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
          <Text mb="20px" fontSize={'lg'} fontWeight={'semibold'}>
            Question Link
          </Text>
          {questionDescription.trim() ? (
            <Tooltip hasArrow label="This field is disabled because the Question Description has content">
              <InputGroup size='md'>
                <InputLeftAddon children='https://leetcode.com/problems/' />
                <Input
                  {...register("question_link")}
                  disabled
                />
              </InputGroup>
            </Tooltip>
          ) : (
            <InputGroup size='md'>
              <InputLeftAddon children='https://leetcode.com/problems/' />
              <Input
                {...register("question_link")}
                onChange={handleLinkChange}
                defaultValue={prev_data.question_link}
                placeholder='leetcode-problem-name'
              />
            </InputGroup>
          )}
          {errors.link && <p style={{ color: 'red' }}>Either Question Link or Question Description must be filled</p>}

          <Divider my={10} />

          <Text mb="20px" fontSize={'lg'} fontWeight={'semibold'}>
            Question Description
          </Text>
          {questionLink.trim() ? (
            <Tooltip hasArrow label="This field is disabled because the Question Link has content">
              <Textarea
                {...register("description")}
                disabled
              />
            </Tooltip>
          ) : (
            <Textarea
              {...register("description")}
              onChange={handleDescriptionChange}
              defaultValue={prev_data.description}
            />
          )}
          {errors.link && <p style={{ color: 'red' }}>Either Question Link or Question Description must be filled</p>}
          <p style={{ color: 'gray', fontSize: '14px', marginTop: 20}}>
            Note: Either Question Link or Question Description must be filled
          </p>

          
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