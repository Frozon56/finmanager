import axios from "axios";
const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api/v1";

// User Login
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return response.data; // Returns token & user info
    } catch (error) {
        return error.response.data;
    }
};
