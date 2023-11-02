import {
  getQuestions,
  getQuestionsDescription,
} from "../../api/QuestionServices";
import React, { useState, useEffect } from "react";
import { Box, Heading } from "@chakra-ui/react";

function QuestionContainer({ questionId }) {
  const [question, setQuestion] = useState([]);

  const [info, setInfo] = useState([]);

  useEffect(() => {
    if (info.length === 0) {
      getQuestionsDescription(questionId)
        .then((data) => setInfo(data))
        .catch((error) => {
          console.error("Error fetching question description:", error);
        });
    }

    if (question.length === 0) {
      getQuestions()
        .then((data) =>
          setQuestion(
            data.filter((val) => {
              return val.question_id === questionId;
            })[0]
          )
        )
        .catch((error) => {
          // Handle any errors from the API call
          console.error("Error fetching questions:", error);
        });
    }
  }, []);

  const parser = new DOMParser();

  function formatQuestionInfo() {
    let html = null;
    if (info.question_description) {
      html = parser.parseFromString(info.question_description, "text/html");
    } else if (info.description !== null || info.description.length !== 0) {
      html = parser.parseFromString(info.description, "text/html");
    }

    const formattedHtml = html.documentElement.innerHTML;
    return formattedHtml;
  }
  return (
    <Box overflowY="scroll" height="100%" textAlign="left" padding={5}>
      {question !== undefined ? (
        <>
          <Heading as="h1" size="2xl" mb={5}>
            {question.question_id}. {question.question_title}
          </Heading>
          <div dangerouslySetInnerHTML={{ __html: formatQuestionInfo() }}></div>
        </>
      ) : (
        <Heading as="h1" size="2xl" mb={5}>
          Sorry, question not found!
        </Heading>
      )}
    </Box>
  );
}

export default QuestionContainer;
