import React, { useEffect, useState } from 'react'
import { getQuestionById, deleteTableEntry, getQuestionInfoById } from '../../utils/localStorage/localStorage';
import { Button, Heading, Tabs, TabList, TabPanels, TabPanel, Tab, Container, HStack, Box, Text, Textarea, Spacer, Card, CardBody, CardHeader } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function IndividualQuestionPage() {

    const url = window.location.pathname;
    const question_idx = Number(url.match(/\/(\d+)$/)[1]);
    console.log(question_idx)

    const [question, setQuestion] = useState([]);

    const [info, setInfo] = useState([]);

    useEffect(() => {
        if (question.length === 0) {
            setQuestion(getQuestionById(question_idx)[0]);
        }

        if (info.length === 0) {
          setInfo(getQuestionInfoById(question_idx)[0]);
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
     
      <Box padding={'10px'} borderRight={'1px'} borderColor={'#D3D3D3'} w={'55vw'} h={'100vh'}>
      
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
        <Button maxWidth={'90%'} onClick={() => {deleteTableEntry(question.question_id); navigator('/')}}>Delete Question</Button>
        </HStack>
        <Card mb={10}>
          <CardBody>
            <Heading fontSize={'lg'}>{question.question_id}. {question.question_title}</Heading>
            <Text>{question.question_categories}</Text>
            <Text>{question?.question_description}</Text>
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