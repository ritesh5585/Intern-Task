import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; 

const generateUrl = async (userName, companyName, video) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/generate-url`, {
            userName,
            companyName,
            video
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to generate URL");
    }
}