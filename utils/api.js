import axios from "axios";

const goalgetterApi = axios.create({
  baseURL: "https://goalgetter-backend.herokuapp.com/api",
});

/*
Drafted endpoints may not match back end so change where needed
*/

export const getGoals = () => {
  return goalgetterApi.get("/goals").then(({ data }) => {
    return data.goals;
  });
};

export const getGoalsByUser = (username) => {
  return goalgetterApi.get(`/users/${username}/goals`).then(({ data }) => {
    return data.goals;
  });
};

export const getSubGoalsByUser = (username) => {
  return goalgetterApi.get(`/users/${username}/subgoals`).then(({ data }) => {
    return data.subgoals;
  });
};

export const patchSubGoalbyId = (subgoal_id) => {
  return goalgetterApi
    .patch(`/subgoals/${subgoal_id}/progress`)
    .then(({ data }) => {
      return data;
    });
};

export const getUser = (username) => {
  return goalgetterApi.get(`/users/${username}`).then(({ data }) => {
    return data.user;
  });
};

export const deleteSocialMediaPost = (post_id) => {
  return goalgetterApi.delete(`/post/${post_id}`).then(({ data }) => {
    return data;
  });
};

export const postGoal = (goalProperties, owner = "jeff") => {
  goalProperties.owner = owner;
  goalProperties.start_date = new Date(goalProperties.start_date);
  goalProperties.end_date = new Date(goalProperties.end_date);
  console.log(goalProperties);
  return goalgetterApi
    .post("/goals", goalProperties)
    .then(({ data }) => {
      return data.goal.goal_id;
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const postSubgoal = (subgoal, goal_id, owner = "jeff") => {
  subgoal.owner = owner;
  if (subgoal.start_date) {
    subgoal.start_date = new Date(subgoal.start_date);
  }
  subgoal.end_date = new Date(subgoal.end_date);
  console.log(subgoal);
  return goalgetterApi
    .post(`/goals/${goal_id}/subgoals`, subgoal)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      console.log(err.response);
    });
};
