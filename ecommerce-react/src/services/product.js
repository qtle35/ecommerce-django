// File: services/scheduleService.js
// import { BASE_URL } from '@/config/config';
// import { store } from '@/redux/store/store';
// import { BASE_API } from './BaseApi';

import axios from "axios";

const baseUrl = 'http://localhost:8000/product';
// const token = store.getState().authReducer.access_token;
// console.log(token)

// const axiosConfig = {
//     headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//     },
// };

const productService = {
    fetchBooks: () => {
        return axios.get(baseUrl + `/api/books/`);
    },
    getSingleBook: (id) => {
        return axios.get(baseUrl + `/api/books/${id}/`);
    },
    fetchMobiles: () => {
        return axios.get(baseUrl + `/api/mobiles/`);
    },
    getSingleMobile: (id) => {
        return axios.get(baseUrl + `/api/mobiles/${id}/`);
    },
};
export default productService;