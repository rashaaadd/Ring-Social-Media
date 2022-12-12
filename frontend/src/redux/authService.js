import { USER_API_GET } from '../axios';


export const getUser = async (token) => {
    const response = await USER_API_GET('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}