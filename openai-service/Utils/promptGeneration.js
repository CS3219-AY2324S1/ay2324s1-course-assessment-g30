function explainQuestionPrompt(question) {
    const prompt = `As a coding interviewee, I want to know how to approach the following question delimited by '@@':
1. Summarize the context and concepts tested in the question concisely in less than 3 sentences.

2. Understand each test case found inside the question and outline any edge cases.

3. Provide a subtle hint to the user on how to approach the question in one sentence.

Please separate each section with a blank line.

Question:
@@${question}>@@
`
    return prompt;
}

function suggestOptimalAnsPrompt(question) {
    const prompt = `
Act as an algorithm expert and brainstorm all possible unique coding solutions to the following question delimited by '@@'. Consider a range of factors, including time and space complexity. Use the results here for the following parts:

Consider the solution that optimizes both time and space complexity and provide a comprehensive analysis.

Desired Output:
Best Solution: Explain why this solution is efficient in terms of space or runtime.
Time Complexity:
Space Complexity:

${
    "If possible, identify an alternative solution with either much better time or space complexity and explore the trade-offs. If not possible to find such a solution, simply omit this section."
}

Desired Output:
Alternative Solution Description: Briefly explain the solution and its trade-offs.
Time Complexity:
Space Complexity:

Question:
@@${question}>@@
    `;
    return prompt;
}

function debugUserCodePrompt(language, question, userCode) {
    const prompt = `
Follow these steps to debug and improve your code:

Step 1:
Let's start by generating our own solution to the problem in ${language}. 
Please provide your solution line by line within triple quotes (""") and include expected outputs and rationales for each line.

Step 2:
Now, compare your solution to the provided user code delimited by '##' and evaluate its correctness in terms of logic, ${language} syntax, and efficiency. 
Enclose your evaluation within triple quotes (""").

Step 3:
If you identify any errors or areas for improvement in the user's code, provide detailed explanations of the issues, line by line, and suggest potential bug fixes. 
For each bug encountered,

- Bug Description: Briefly explain the bug and issues associated with it.
- Bug Fix: Provide a potential bug fix in ${language} syntax.

In the event that you cannot identify any bugs, simply omit this section and ask users to try other means to debug.

Question:
@@${question}@@

User's Code:
##${userCode}##
`
    return prompt;
}


function generatePseudocodePrompt(question, language) {
    const prompt = `
Write pseudocode for the following problem delimited by '@@' and provide a concise explanation in ${language} programming sytax:
    
Problem:
${question}

Pseudocode:
- Your pseudocode solution here

Elaboration:
- Explain the key steps and logic of your pseudocode solution.

Your pseudocode and explanation can be in the format:

\`\`\`
Pseudocode:
BEGIN
    Your pseudocode logic here in ${language} syntax
END

Elaboration:
Explain the pseudocode logic here in at most 3 sentences.
\`\`\`
    `;
    return prompt;
}




module.exports = {explainQuestionPrompt, suggestOptimalAnsPrompt, generatePseudocodePrompt, debugUserCodePrompt}