

export function getTableStorage() {
    // Get the cookie string
    return JSON.parse(localStorage.getItem("tableData"));
}

export function getQuestionStorage() {
    
    return JSON.parse(localStorage.getItem("questions"));
}


export function getQuestionInfoById(id) {
    
    let question_bank = JSON.parse(localStorage.getItem("questions"));

    return question_bank.filter((a) => a.question_id === id);
}

// tableData
// questions
export function setTableStorage(key, data) {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    
}
  


export function getQuestionById(id) {
    console.log(id)
    let question_bank = JSON.parse(localStorage.getItem("tableData"));

    return question_bank.filter((a) => a.question_id === id);
}


export function addTableStorage(title, cat, des, complexity) {
    let old = JSON.parse(localStorage.getItem("tableData"));

    old.push({
      question_id: old.length + 1,
      question_title: title,
      question_categories: [cat],
      question_complexity: complexity,
      question_link : "https://leetcode.com/problems/chalkboard-xor-game/",
      question_description: des
  })
    const serializedData = JSON.stringify(old);
    localStorage.setItem("tableData", serializedData);
    console.log('data added')
    
}

export function deleteTableEntry(id) {
    let question_bank = JSON.parse(localStorage.getItem("tableData"));
    let deleted_bank = question_bank.filter((a) => a.question_id !== id);

    const serializedData = JSON.stringify(deleted_bank);
    localStorage.setItem("tableData", serializedData);
}