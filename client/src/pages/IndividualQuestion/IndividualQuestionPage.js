import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box, Button,
  Card, CardBody, HStack, Heading,
  Menu, MenuButton,
  MenuItem,
  MenuList,
  Tab, TabList, TabPanel, TabPanels, Tabs, Text,
  useToast
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteQuestion, getQuestions, getQuestionsDescription, testUpdateQuestion } from '../../api/QuestionServices';

function IndividualQuestionPage() {

    const url = window.location.pathname;
    const question_idx = Number(url.match(/\/(\d+)$/)[1]);

    const [question, setQuestion] = useState([]);

    const [info, setInfo] = useState([]);

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (info.length === 0) {
            getQuestionsDescription(question_idx).then((data) => setInfo(data)).then(() => setIsLoading(false)).catch((e) => console.log(e));
        }

        if (question.length === 0) {
          getQuestions().then(data => setQuestion(data.filter(val => {return val.question_id === question_idx})[0])).then(() => setIsLoading(false)).catch((e) => console.log(e));
        }
    }, [])

    const parser = new DOMParser();
    
    function formatQuestionInfo() {
      let html = null;
      if (info.question_description) {
        html = parser.parseFromString(info.question_description, 'text/html'); 
      } else if (info.description !== null || info.description.length !== 0) {
        html = parser.parseFromString(info.description, 'text/html')
      }
      
      const formattedHtml = html.documentElement.innerHTML;
      return formattedHtml;
    }
    
    const navigator = useNavigate()

    const handleDelete = (qid) => {
      deleteQuestion(qid)
        .then(() => {
          navigator('/dashboard');
        })
        .catch((e) => {
          toast({
            title: 'Not Allowed',
            description: "You can only delete questions that belong to you",
            status: 'warning',
            duration: 4000,
            isClosable: true,
          })
          console.log(e.response);
        });
    };

    const handleEdit = (qid) => {
      testUpdateQuestion(qid)
        .then(() => {
          console.log('this', Object.assign({}, info, question))
          navigator('/edit_question/' + question.question_id, {state: Object.assign({}, info, question)})
        })
        .catch((e) => {
          toast({
            title: 'Not Allowed',
            description: "You can only edit questions that belong to you",
            status: 'warning',
            duration: 4000,
            isClosable: true,
          })
          console.log(e.response);
        });
    };
    

  return (
    <>
    <HStack maxW={'100%'}>
     
      <Box padding={'10px'} borderRight={'1px'} borderColor={'#D3D3D3'} w={'50vw'} >
      
      <Tabs>
      <TabList>
        <Tab>Description</Tab>

      </TabList>

      <TabPanels>
        <TabPanel>
        {isLoading ? (
          <p>Loading...</p>
        ) :<div style={{overflow: 'scroll', height: '80vh'}} >
          <div dangerouslySetInnerHTML={{ __html: formatQuestionInfo() }}></div>
        </div>}
        </TabPanel>
      </TabPanels>
    </Tabs>
     
      
      </Box>
      <Box padding={'10px'} pl={'10'} display={'flex'} flexDir={'column'} alignSelf={'flex-start'}>
        <HStack display={'flex'} alignItems={'flex-start'} spacing={'20'}>
        <Heading mb={10}>Question</Heading>
        <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Settings
        </MenuButton>
        <MenuList>
        <MenuItem onClick={() => {handleEdit(question.question_id)}}>Edit Question</MenuItem>
        <MenuItem onClick={() => {handleDelete(question.question_id); }}>Delete Question</MenuItem>
        </MenuList>
        </Menu>
        {/* <Button maxWidth={'90%'} >Delete Question</Button> */}
        </HStack>
        <Card mb={10}>
          <CardBody>
            <Heading fontSize={'lg'}>{question?.question_id}. {question?.question_title}</Heading>
            <Text>{question?.question_categories?.map(
              val => {
                return " " + val + ' | '
              }
            )}</Text>
            <Text>{question?.question_complexity}</Text>
          </CardBody>
        </Card>
        
        

      </Box>
      
    </HStack>
    
    </>
  )
}

export default IndividualQuestionPage