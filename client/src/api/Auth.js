import axios from "axios";
import Cookies from 'js-cookie';
import { authServiceURL } from "./config";

const baseURL = authServiceURL;
export var curr_user_token = null;

export const getAuthToken = async (email, password) => {
    
    const config = {
        method: 'post',
        url: baseURL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            email: email,
            password: password,
        }
    };
    const response = await axios(config)
    const data = response.data
    if (response.status === 200) {
        curr_user_token = data.token
        localStorage.setItem("notAuthenticated", false);
        // decoded = jwt_decode(curr_user_token);
        Cookies.set('token', curr_user_token, { expires: 1 / 24 })
        // console.log(decoded.organisation_id)
        console.log(curr_user_token);
        return curr_user_token;
        // return dispatch(authToken('Token retrieved!'))
    }
    localStorage.setItem("notAuthenticated", true);
    return "No token"
    // return dispatch(authTokenError('Failed to retrieve token.'))
}