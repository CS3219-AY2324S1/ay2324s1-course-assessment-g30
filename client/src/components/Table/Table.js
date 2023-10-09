import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Table.css';
import { Box, Button } from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons'
import { getTableStorage } from '../../utils/localStorage/localStorage';

function Table() {

    // Question Id
    // Question Title
    // Question Category
    // Question Complexity
    const navigator = useNavigate();
    const [table, setTable] = useState([]);
    
    
    useEffect(() => {
      if (table.length === 0) {
        setTable(getTableStorage())
      }
    }, [])


  return (
    <>
    <Box>
      
    </Box>
    <Box style={{display: 'flex', justifyContent: 'flex-end'}}>
    <Button onClick={() => navigator('/add_question')} leftIcon={<AddIcon />}>Add Question</Button>
    </Box>
    <div class="container">
      <h2 id='title'>Leetcode Questions</h2>
      <ul class="responsive-table">
        <li class="table-header">
          <div class="col-1">Question Id</div>
          <div class="col-2">Question Title</div>
          <div class="col-3">Question Category</div>
          <div class="col-4">Question Complexity</div>
        </li>
        {table.map(val => {
          return (
            <li class="table-row" id={val.question_id} onClick={() => {navigator('/question/' + val.question_id)}}>
              <div class="col col-1" data-label="Job Id">{val.question_id}</div>
              <div class="col col-2" data-label="Customer Name">{val.question_title}</div>
              <div class="col col-3" data-label="Amount">{val.question_categories.reduce((a,b) => a + ' * ' + b, "")}</div>
              <div class="col col-4" data-label="Payment Status">{val.question_complexity}</div>
            </li>
          )
        })}
        
      </ul>
    </div>
    </>
  )
}

export default Table