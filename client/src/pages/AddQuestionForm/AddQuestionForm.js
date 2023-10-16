import { Box, Button, Container, Toast, Spinner, Divider, FormControl, Heading, Input, Radio, RadioGroup, Stack, Text, Textarea, useToast, Tooltip } from '@chakra-ui/react';
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
    console.log(data)
    if (!data.link && !data.description) {
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

      addQuestion(data.title, data.categories, data.complexity, data.link, data.description)
        .then(() => {
          navigator('/dashboard');
          setLoading(false);
        })
        .catch((e) => {
          console.log(e)
          toast({
            title: 'Unable to submit',
            description: 'Please use a valid leetcode link',
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
          {errors.title && <p style={{ color: 'red' }}>This field is required</p>}
          <Divider my={10} />
          <Text mb="20px" fontSize={'lg'} fontWeight={'semibold'}>
            Question Category
          </Text>
          <Input {...register("categories", { required: true })} />
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
              <Input
                {...register("link")}
                disabled
              />
            </Tooltip>
          ) : (
            <Input
              {...register("link")}
              onChange={handleLinkChange}
              value={questionLink}
            />
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
