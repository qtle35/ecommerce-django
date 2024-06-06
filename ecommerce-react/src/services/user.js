

import axios from "axios";

const baseUrl = 'http://localhost:8000/user';


const userService = {
    signIn: (email, password) => {
        return axios.post(baseUrl + `/login/api/`, {email: email, password: password});
    },
    getUser: (id) => {
        return axios.get(baseUrl + `/api/user-info/${id}/`);
    },
    storeImage: (id, imageFile, type) => {
        const formData = new FormData();
        formData.append(type, imageFile);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        return axios.put(baseUrl + `/api/user-info/${id}/update-avatar-banner/`, formData, config);
    },
    updateProfile: (id, updates) =>{
        return axios.put(baseUrl + `/api/user-info/${id}/`, updates);
    },
};

export default userService;