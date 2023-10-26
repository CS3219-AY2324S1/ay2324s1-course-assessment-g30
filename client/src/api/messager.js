import axios from "axios";

export const getProjects = async () => {
    try {
        const config = {
            method: 'get',
            url: "http://localhost:3001/",
            headers: {
                'Content-Type': 'application/json',
                
            }
        }
        const res = await axios(config)
        const data = res.data
        console.log(data)
    } catch(e) {
        console.log(e);
    }
}