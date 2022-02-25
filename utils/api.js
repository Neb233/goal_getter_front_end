import axios from "axios";

const goalgetterApi = axios.create({
  baseURL: "https://goalgetter-backend.herokuapp.com/api",
});

/*
Drafted endpoints may not match back end so change where needed
*/

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

export const searchUsers = (userSearch) => {
  return goalgetterApi.get(`/users?search=${userSearch}`).then(({ data }) => {
    return data.users;
  });
};

export const addFriend = (loggedInUser, userToAdd) => {
  return goalgetterApi
    .post(`/friendships`, { user_1: loggedInUser, user_2: userToAdd })
    .then((res) => {
      console.log(res.data);
      return res.data;
    });
};

export const getFriends = (user) => {
  return goalgetterApi.get(`/users/${user}/friendships`).then((res) => {
    const { friendships } = res.data;
    const friends = friendships.map((friendship) => {
      if (friendship.user_1 === user) {
        return friendship.user_2;
      }
      return friendship.user_1;
    });
    return friends;
  });
};
