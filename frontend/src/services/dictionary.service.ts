//u can define info like: <UserLoginDTO> in //component/user/dto 
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL_API;

export const dictionaryService = {
  search: async (info): Promise<string> => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email:info.email,
      password:info.password,
    });
    return response.data.access_token;
  },
  
};
