// ✨ implement axiosWithAuth
import axios from "axios";

export function getAxiosWithAuth() {
  return axios.create({
    headers: {
      Authorization: window.localStorage.getItem("token"),
    },
  });
}

export default getAxiosWithAuth;
