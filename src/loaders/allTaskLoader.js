import axios from 'axios';

export async function allTaskLoader() {
    try {
        const response = await axios.get(`https://688f6c68f21ab1769f8927ce.mockapi.io/tasks`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to load all tasks");
    }
}
