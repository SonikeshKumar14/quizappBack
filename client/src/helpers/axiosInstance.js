import Axios from 'axios';

const axiosInstance = Axios.create({
	baseURL: 'http://localhost:5000/api/v1',
});

export default axiosInstance;
