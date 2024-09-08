

import axios from "axios";

const BASE_URL = 'https://geminiapi-6j2u.onrender.com/api/apigemini';

const getGeminiApi = (userMsg: string) => axios.get(BASE_URL + "?input=" + userMsg);

export default {
    getGeminiApi
};
