//u can define info like: <UserLoginDTO> in //component/user/dto 
// import axios from "axios";
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL_API;

export const dictionaryService = {
  search: async (key): Promise<string> => {
    const response = await axios.get(`${BASE_URL}/dictionary`, {params:{
      word:key.word,
      language:key.language,
    }});
    return response.data.access_token;
  },
  
};
