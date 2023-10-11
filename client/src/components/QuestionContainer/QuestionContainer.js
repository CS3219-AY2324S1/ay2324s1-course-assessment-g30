import { getQuestions, getQuestionsDescription } from '../../api/QuestionServices';
import React, { useState, useEffect } from "react";
import { Box, Card, CardBody, Heading, Text} from '@chakra-ui/react';
import "./QuestionContainer.css";

function QuestionContainer({ questionId }) {

    const [question, setQuestion] = useState([]);

    const [info, setInfo] = useState([]);

    useEffect(() => {
        if (info.length === 0) {
            getQuestionsDescription(questionId).then((data) => setInfo(data));
        }

        if (question.length === 0) {
            getQuestions().then(data => setQuestion(data.filter(val => {return val.question_id === questionId})[0]));
        }
    }, [])

    console.log(info)

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
  return (
      <Box overflowY="scroll" height="10vh" textAlign="left">
          <div dangerouslySetInnerHTML={{ __html: formatQuestionInfo() }}></div>
      </Box>
  );
}

export default QuestionContainer;
