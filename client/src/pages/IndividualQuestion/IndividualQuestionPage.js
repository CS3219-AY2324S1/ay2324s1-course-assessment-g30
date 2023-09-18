import { Box,  Button,   Menu,   MenuButton,   MenuList,   MenuItem,   MenuItemOption,   MenuGroup,   MenuOptionGroup,   MenuDivider, Card, CardBody, HStack, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteQuestion, getQuestions, getQuestionsDescription } from '../../api/QuestionServices';
import { ChevronDownIcon } from '@chakra-ui/icons';

function IndividualQuestionPage() {

    const url = window.location.pathname;
    const question_idx = Number(url.match(/\/(\d+)$/)[1]);

    const [question, setQuestion] = useState([]);

    const [info, setInfo] = useState([]);

    useEffect(() => {
        if (info.length === 0) {
            getQuestionsDescription(question_idx).then((data) => setInfo(data));
        }

        if (question.length === 0) {
          getQuestions().then(data => setQuestion(data.filter(val => {return val.question_id === question_idx})[0]));
        }
    }, [])



    const parser = new DOMParser();
    
    function formatQuestionInfo() {
      const html = parser.parseFromString(info.question_description, 'text/html'); 
      const formattedHtml = html.documentElement.innerHTML;
      return formattedHtml;
    }
    
    const navigator = useNavigate()

  return (
    <>
    <HStack maxW={'100%'}>
     
      <Box padding={'10px'} borderRight={'1px'} borderColor={'#D3D3D3'} w={'50vw'} h={'100vh'}>
      
      <Tabs>
      <TabList>
        <Tab>Description</Tab>
        <Tab>Solution</Tab>
        <Tab>Peer programming</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
        <div style={{overflow: 'scroll', height: '80vh'}} >
          <div dangerouslySetInnerHTML={{ __html: formatQuestionInfo() }}></div>
        </div>
        </TabPanel>
        <TabPanel>
          <p>Solution</p>
        </TabPanel>
        <TabPanel>
          <p>Peer Programming</p>
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
        <MenuItem onClick={() => navigator('/edit_question/' + question.question_id, {state: question})}>Edit Question</MenuItem>
        <MenuItem onClick={() => {deleteQuestion(question.question_id); navigator('/dashboard')}}>Delete Question</MenuItem>
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
        
        
        <Textarea minH={'500px'}placeholder='Enter Code Here' resize={'vertical'}/>
      </Box>
      
    </HStack>
    
    
    
    </>
  )
}

export default IndividualQuestionPage