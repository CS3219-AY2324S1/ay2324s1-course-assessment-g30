import axios from "axios";
import Cookies from 'js-cookie';
import { authServiceURL } from "./config";

const baseURL = authServiceURL;


function epochToDays(epochTimestamp) {
    // Convert epoch timestamp to milliseconds if it's in seconds
    const timestampInMilliseconds = epochTimestamp * 1000;
  
    // Get the current timestamp in milliseconds
    const currentTimestamp = Date.now();
  
    // Calculate the time difference in milliseconds
    const timeDifference = currentTimestamp - timestampInMilliseconds;
  
    // Convert milliseconds to days
    const days = timeDifference / (24 * 60 * 60 * 1000);
  
    return Math.abs(Math.floor(days));
}

export const getAuthToken = async (email, password) => {
    try {
        const config = {
            method: 'post',
            url: baseURL + '/auth/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                email: email,
                password: password,
            }
        };
        const response = await axios(config)
        const data = response.data.res
        if (response.status === 200) {
            let curr_user_token = data.accessToken;
            let uuid = data.uuid;
            localStorage.setItem("notAuthenticated", false);
            Cookies.set('uuid', uuid, {expires: epochToDays(data.exp)})
            Cookies.set('token', curr_user_token, { expires: epochToDays(data.exp)})
            return curr_user_token;
        }
        localStorage.setItem("notAuthenticated", true);
        return "No token"
    } catch(e) {
        console.error("Error: Please ensure that backend is connected");
        throw e;
    }
    
    
    // return dispatch(authTokenError('Failed to retrieve token.'))
}

export const createUser = async (input) => {
    
    // {
    //     "username": "test",
    //     "password": "test123",
    //     "email": "test@test.com",
    //     "firstName": "Bart",
    //     "lastName": "Simpson"
       
    //  }
    try {
        const config = {
            method: 'post',
            url: baseURL + '/auth/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                username: input.username,
                password: input.password,
                email: input.email,
                firstName: input.firstName,
                lastName: input.lastName
             }
             
        };
        const response = await axios(config)
        const data = response.data.res
        if (response.status === 200) {
            console.log(data);
        }
    } catch (e) {
        throw e;
    }
    
}

export const deleteToken = async () => {
    Cookies.remove('token');
    localStorage.removeItem("notAuthenticated");
}


export const getUserProfile = async () => {
    var curr_user_token = Cookies.get('token');
    var uuid = Cookies.get('uuid');

    const config = {
        method: 'post',
        url: baseURL + '/user',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${curr_user_token}`
        },
        data: {
            uuid: uuid
        }
    };

    try {
        const response = await axios(config);
        if (response.status === 200) {
            const data = response.data.res;
            return data;
        } else {
            console.error('Failed to retrieve user profile. Status:', response.status);
        }
    } catch (error) {
        console.error('Error while fetching user profile:', error);
    }
}

export const editProfile = async (input) => {
    var curr_user_token = Cookies.get('token');
    var uuid = Cookies.get('uuid');

    const config = {
        method: 'put',
        url: baseURL + '/user',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${curr_user_token}`
        },
        data: {
            uuid: uuid,
            firstName: input.firstName,
            lastName: input.lastName,
            username: input.username
        }
    };

    try {
        const response = await axios(config);
        if (response.status === 200) {
            const data = response.data.res;
            return data;
        } else {
            console.error('Failed to retrieve user profile. Status:', response.status);
        }
    } catch (error) {
        
        throw error;
    }
}

export const deleteProfile = async (input) => {
    var curr_user_token = Cookies.get('token');
    var uuid = Cookies.get('uuid');

    const config = {
        method: 'delete',
        url: baseURL + '/user',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${curr_user_token}`
        },
        data: {
            uuid: uuid,
        }
    };

    try {
        const response = await axios(config);
        if (response.status === 200) {
            const data = response.data.res;
            console.log(data);
        } else {
            console.error('Failed to retrieve user profile. Status:', response.status);
        }
    } catch (error) {
        console.error('Error while fetching user profile:', error);
    }
}

export const getRole = async () => {
    var curr_user_token = Cookies.get('token');

    const config = {
        method: 'post',
        url: baseURL + '/user/role',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            token: curr_user_token,
        }
    };

    try {
        const response = await axios(config);
        if (response.status === 200) {
            const data = response.data.res;
            return data;
        } else {
            console.error('Failed to retrieve user profile. Status:', response.status);
        }
    } catch (error) {
        console.error('Error while fetching user profile:', error);
    }
}
