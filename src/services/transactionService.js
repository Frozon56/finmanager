export const getTransactions = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/getTransaction`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.transactions;
    } catch (error) {
        return error.response.data;
    }
};
