import { AddIcon, RepeatIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getQuestions
} from "../../api/QuestionServices";
import "./Table.css";

function Table() {
  // Question Id
  // Question Title
  // Question Category
  // Question Complexity
  const navigator = useNavigate();
  const [table, setTable] = useState([    {   
    question_id: 1,
    question_title: "Reverse a String",
    question_categories: ["Strings", "Algorithms"],
    question_complexity: "Easy",
    question_link : "https://leetcode.com/problems/reverse-string/"
}, ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (table.length === 1) {
      getQuestions().then((data) => {setTable(data); setIsLoading(false);}).catch((e) => console.log(e));
    }
  }, []);

  return (
    <>
      <Box></Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Button
          onClick={() => window.location.reload()}
          rightIcon={<RepeatIcon />}
        >
          Refresh
        </Button>
        <Button
          onClick={() => navigator("/add_question")}
          leftIcon={<AddIcon />}
        >
          Add Question
        </Button>
      </Box>
      <div class="container">
        <h2 id="title">Leetcode Questions</h2>
        <ul class="responsive-table">
          <li class="table-header">
            <div class="col-1">Question Id</div>
            <div class="col-2">Question Title</div>
            <div class="col-3">Question Category</div>
            <div class="col-4">Question Complexity</div>
          </li>
          {isLoading ? (
          <p>Loading...</p>
        ) : table?.map((val) => {
            return (
              <li
                class="table-row"
                id={val.question_id}
                onClick={() => {
                  navigator("/question/" + val.question_id);
                }}
              >
                <div class="col col-1" data-label="Question Id">
                  {val.question_id}
                </div>
                <div class="col col-2" data-label="Question Title">
                  {val.question_title}
                </div>
                <div class="col col-3" data-label="Question Categories">
                  {val.question_categories.reduce((a, b) => a + " * " + b, "")}
                </div>
                <div class="col col-4" data-label="Question Complexity">
                  {val.question_complexity}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Table;
