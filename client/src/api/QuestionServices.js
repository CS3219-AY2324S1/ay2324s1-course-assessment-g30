import axios from "axios";
import { questionServiceURL } from "./config";

const BASE_URL = questionServiceURL;

export const getQuestions = async () => {
    const url = BASE_URL + "/readQuestions/";

    try {
        const res = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = res.data;
        console.log(data)
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed.
    }
};


export const getQuestionsDescription = async (id) => {
    const url = BASE_URL + "/readQuestionDescription/";

    const config = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            question_id: id
        })
    }

    try {
        const res = await axios(config);
        const data = res.data;
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed.
    }
};

export const addQuestion = async (title, category, complexity, link) => {
    const url = BASE_URL + "/addQuestion/";

    const config = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            title: title,
            category: [category],
            complexity: complexity,
            link: link
        })
    }

    try {
        const res = await axios(config);
        const data = res.data;
        console.log(data)
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed.
    }
};

export const deleteQuestion = async (id) => {
    const url = BASE_URL + "/deleteQuestion/";

    const config = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            question_id: id
        })
    }

    try {
        const res = await axios(config);
        const data = res.data;
        console.log(data)
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed.
    }
};

export const updateQuestion = async (data) => {
    const url = BASE_URL + "/updateQuestion/";

    const d = data;
    const config = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            question_id: d.question_id,
            title: d.question_title,
            category: d.question_categories,
            complexity: d.question_complexity,
            link: d.question_link
        })
    }

    try {
        const res = await axios(config);
        const data = res.data;
        console.log(data)
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed.
    }
};

