import axios from "axios";
import { getLS, removeLS } from "../LocalStorage/index";

const API_URL =
  process.env.NEXT_PUBLIC_ENVIORNMENT === "prod"
    ? "https://api.savemyform.tk"
    : process.env.NEXT_PUBLIC_ENVIORNMENT === "pro-dev"
    ? "http://localhost:8080"
    : "https://dev-api.savemyform.tk";

const getAccessToken = () => {
  return getLS("secret");
};

const getHeaders = (token) => {
  if (!token) token = getAccessToken();
  if (token) {
    return {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return {
    headers: {
      Accept: "application/json",
    },
  };
};

const post = async (endpoint, body, token = null, form = false) => {
  let options = getHeaders(token);
  if (form) {
    options.headers["Content-Type"] = "multipart/form-data";
  }
  try {
    const response = await axios.post(API_URL + endpoint, body, options);
    return response;
  } catch (err) {
    console.error(err?.response?.data || err);
    if (err?.response?.status === 401) {
      console.log("Wrong password");
      removeLS("secret");
    } else if (err?.response?.status === 404) {
      console.log("404 Error");
      removeLS("secret");
    }
    return err?.response?.data || err;
  }
};

const get = async (endpoint, token = null) => {
  try {
    const response = await axios.get(API_URL + endpoint, getHeaders(token));
    return response;
  } catch (err) {
    console.error(err?.response?.data || err);
    if (err?.response?.status === 401) {
      console.log("Wrong password");
      removeLS("secret");
    }
    return err?.response?.data || err;
  }
};

const patch = async (endpoint, body, token = null) => {
  try {
    const response = await axios.patch(
      API_URL + endpoint,
      body,
      getHeaders(token)
    );
    return response.data;
  } catch (err) {
    console.error(err?.response?.data || err);
    if (err?.response?.status === 401) {
      console.log("Wrong password");
      removeLS("secret");
    }
    return err?.response?.data || err;
  }
};

const remove = async (endpoint, body, token = null) => {
  try {
    let conf = getHeaders(token);
    conf["data"] = body;
    const response = await axios.delete(API_URL + endpoint, conf);
    return response.data;
  } catch (err) {
    console.log(err);

    console.error(err?.response?.data || err);
    if (err?.response?.status === 401) {
      console.log("Wrong password");
      removeLS("secret");
    }
    return err?.response?.data || err;
  }
};

export { getAccessToken, post, get, patch, remove, API_URL };
