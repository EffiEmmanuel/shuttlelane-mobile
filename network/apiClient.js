import axios from "axios";

const baseURL = process.env.API_BASE_URL;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const postRequest = async (endpoint, token, data) => {
  if (token) headers["Authorization"] = token;

  let response = {}

  await axios
    .post(`${baseURL}${endpoint}`, data, headers)
    .then((res) => {
      response = {
        status: res.status,
        data: res.data,
      };
    })
    .catch((err) => {
      response = {
        status: err.response.status,
        error: err.response,
      };
    });

    return response
};

export const getRequest = async (endpoint, token, data) => {
  if (token) headers["Authorization"] = token;

  await axios
    .get(`${baseURL}${endpoint}`, headers)
    .then((res) => {
      return {
        status: res.status,
        data: res.data,
      };
    })
    .catch((err) => {
      return {
        status: err.response.status,
        error: err.response,
      };
    });
};
