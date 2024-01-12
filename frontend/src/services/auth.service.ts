//u can define info like: <UserLoginDTO> in //component/user/dto 
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const authService = {
  login: async (info): Promise<string> => {
    console.log(">>email: " + info.email);
    console.log(">>password: " + info.password);
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email:info.email,
      password:info.password,
    });
    console.log(response.data);
    return response.data.access_token;
  },
};
