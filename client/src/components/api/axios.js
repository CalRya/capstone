import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:5177", // Ensure this is correct
    headers: { "Content-Type": "application/json" }
});

export default API;
