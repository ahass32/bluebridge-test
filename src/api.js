import axios from "axios";

export const loginApi = async (username, password) => {
  console.log(username, password);
  const res = await axios.post("http://localhost:3001/login", {
    username,
    password,
  });

  return res.data;
};
