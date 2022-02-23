import axios from "axios";

const goalgetterApi = axios.create({
  baseURL: "https://goalgetter-backend.herokuapp.com/api",
});

/*
Drafted endpoints may not match back end so change where needed
*/

export const getGoalsByUser = (owner) => {
  return goalgetterApi.get(`/users/${owner}/goals`).then(({ data }) => {
    return data.goals;
  });
};

export const getUsers = () => {
  return goalgetterApi.get("/users").then(({ data }) => {
    return data.users;
  });
};

export const postUser = (body) => {
  return goalgetterApi.post("/users", body).then(({ data }) => {
    return data;
  });
};

export const postSocialMediaPost = (body) => {
  return goalgetterApi.post("/post", body).then(({ data }) => {
    return data;
  });
};

export const deleteSocialMediaPost = (post_id) => {
  return goalgetterApi.delete(`/post/${post_id}`).then(({ data }) => {
    return data;
  });
};