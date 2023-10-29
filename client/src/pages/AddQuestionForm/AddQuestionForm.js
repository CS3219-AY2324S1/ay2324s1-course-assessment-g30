import { Box, Button, Container, InputGroup, InputLeftAddon, Divider, FormControl, Heading, Input, Radio, RadioGroup, Spinner, Stack, Text, Textarea, Tooltip, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { addQuestion } from '../../api/QuestionServices';

function AddQuestionForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors
  } = useForm();

  const navigator = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [questionLink, setQuestionLink] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');

  const onSubmit = (data) => {

    setLoading(true);
  
    const trimmedData = {
      ...data,
      title: data.title.trim(),
      complexity: data.complexity.trim(),
      link: data.link.trim().length === 0 ? "" : "https://leetcode.com/problems/" + data.link.trim(),
      description: data.description.trim(),
    };
  
    if (!trimmedData.link && !trimmedData.description) {
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
  
      const categoriesArray = trimmedData.categories
        .split(',')
        .map((category) => category.trim())
        .filter((category) => category.length > 0);
  
      addQuestion(
        trimmedData.title,
        categoriesArray, 
        trimmedData.complexity,
        trimmedData.link,
        trimmedData.description
      )
        .then(() => {
          navigator('/dashboard');
          setLoading(false);
        })
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
  

  const handleLinkChange = (e) => {
    setQuestionLink(e.target.value);
    if (e.target.value) {
      setQuestionDescription('');
    }
  };

  const handleDescriptionChange = (e) => {
    setQuestionDescription(e.target.value);
    if (e.target.value) {
      setQuestionLink('');
    }
  };

  return (
    <Box>
      <Container maxW={'60%'} pb={20}>
        <Heading>Add Question</Heading>
      </Container>

      <Container maxW={'60%'} mb={100}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Text mb="20px" fontSize={'lg'} fontWeight={'semibold'}>
            Question Title
          </Text>
          <Input {...register("title", { required: true })} />
          {errors.title && <p id='form error' style={{ color: 'red' }}>This field is required</p>}
          <Divider my={10} />
          <Text mb="20px" fontSize={'lg'} fontWeight={'semibold'}>
            Question Category
          </Text>
          <Input placeholder='Example: data structures, array, dynamic programming' {...register("categories", { required: true })} />
          
          {errors.categories && <p style={{ color: 'red' }}>This field is required</p>}

          <Divider my={10} />
          <Text mb="20px" fontSize={'lg'} fontWeight={'semibold'}>
            Question Complexity
          </Text>

          <FormControl>
            <Controller
              control={control}
              rules={{ required: "This field is required" }}
              name="complexity"
              defaultValue={"Easy"}
              render={({ field }) => (
                <RadioGroup {...field}>
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
                {...register("link")}
                disabled
              />
              </InputGroup>
            </Tooltip>
          ) : (
            <InputGroup size='md'>
            <InputLeftAddon children='https://leetcode.com/problems/' />
            <Input
              {...register("link")}
              onChange={handleLinkChange}
              value={questionLink}
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
              value={questionDescription}
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
  );
}

export default AddQuestionForm;
