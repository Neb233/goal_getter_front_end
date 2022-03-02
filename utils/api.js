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

export const patchSubGoalbyId = (subgoal_id, patchObject) => {
  patchObject.date = new Date(patchObject.date);
  return goalgetterApi
    .patch(`/subgoals/${subgoal_id}/progress`, patchObject)
    .then(({ data }) => {
      return data.subgoal;
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const patchGoalbyId = (goal_id, patchObject) => {
  patchObject.date = new Date(patchObject.date);
  return goalgetterApi
    .patch(`/goals/${goal_id}/progress`, patchObject)
    .then(({ data }) => {
      return data.goal;
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const patchSubgoalStatusById = (subgoal_id, status) => {
  const currentTime = new Date(Date.now());
  const currentDate = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate()
  );
  const patchObject = {
    status,
    date: currentDate,
  };
  return goalgetterApi
    .patch(`/subgoals/${subgoal_id}/status`, patchObject)
    .then(({ data }) => {
      return data;
    });
};

export const patchGoalStatusById = (goal_id, status) => {
  const currentTime = new Date(Date.now());
  const currentDate = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate()
  );
  const patchObject = {
    status,
    date: currentDate,
  };
  return goalgetterApi
    .patch(`/goals/${goal_id}/status`, patchObject)
    .then(({ data }) => {
      return data;
    });
};

export const getUser = (username) => {
  return goalgetterApi.get(`/users/${username}`).then(({ data }) => {
    return data.user;
  });
};

export const postStatus = (body) => {
  return goalgetterApi.post(`/posts`, body).then(({ data }) => {
    return data;
  });
};

export const getCurrentStatus = (owner) => {
  return goalgetterApi.get(`/posts/${owner}`).then(({ data }) => {
    return data.posts;
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
      console.log("API", res.data);
      return res.data;
    });
};

export const deleteFriendship = (loggedInUser, userToDelete) => {
  console.log("DELETEPARAMs", loggedInUser, userToDelete);
  //FRIENDSHIPS ARE STORED AS IDs
  return goalgetterApi
    .get(`/users/${loggedInUser}/friendships`)
    .then((friendships) => {
      console.log("HERE", friendships.data.friendships[0]["user_1"]);
      for (let i = 0; friendships.data.friendships.length; i++) {
        if (
          friendships.data.friendships[i]["user_1"] === userToDelete ||
          friendships.data.friendships[i]["user_2"] === userToDelete
        ) {
          return friendships.data.friendships[i]["friendship_id"];
        }
      }
    })
    .then((friendship_id) => {
      console.log(friendship_id, "friendship id to delete");
      return goalgetterApi.delete(`/friendships/${friendship_id}`);
    })
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

export const deleteSocialMediaPost = (post_id) => {
  return goalgetterApi.delete(`/post/${post_id}`).then(({ data }) => {
    return data;
  });
};

export const postGoal = (goalProperties, owner = "jeff") => {
  goalProperties.owner = owner;
  goalProperties.start_date = new Date(goalProperties.start_date);
  goalProperties.end_date = new Date(goalProperties.end_date);
  return goalgetterApi
    .post("/goals", goalProperties)
    .then(({ data }) => {
      return data.goal.goal_id;
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const getPostsByUser = (user) => {
  return goalgetterApi.get(`/posts/${user}`).then(({ data }) => {
    return data.posts;
  });
};

export const postSubgoal = (subgoal, goal_id, owner = "jeff") => {
  subgoal.owner = owner;
  if (subgoal.start_date) {
    subgoal.start_date = new Date(subgoal.start_date);
  }
  subgoal.end_date = new Date(subgoal.end_date);
  return goalgetterApi
    .post(`/goals/${goal_id}/subgoals`, subgoal)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const getGoalByGoalId = (goal_id) => {
  return goalgetterApi.get(`/goals/${goal_id}`).then(({ data }) => {
    return data.goal;
  });
};

export const getSubgoalBySubgoalId = (subgoal_id) => {
  return goalgetterApi.get(`/subgoals/${subgoal_id}`).then(({ data }) => {
    return data.subgoal;
  });
};

export const getSubgoalsByGoalId = (goal_id) => {
  return goalgetterApi.get(`/goals/${goal_id}/subgoals`).then(({ data }) => {
    return data.subgoals;
  });
};

export const getCommentsByPost = (post_id) => {
  return goalgetterApi.get(`/posts/${post_id}/comments`).then(({ data }) => {
    return data.comments;
  });
};

export const getReactionsByPost = (post_id) => {
  return goalgetterApi.get(`/posts/${post_id}/reactions`).then(({ data }) => {
    return data.reactions;
  });
};

export const postReaction = (post_id, reactionValue, owner) => {
  let reaction = undefined;

  switch (reactionValue) {
    case "awesome":
      reaction = "Awesome!";
      break;
    case "congrats":
      reaction = "Congratulations!";
      break;
    case "encourage":
      reaction = "Keep on going";
      break;
    case "proud":
      reaction = "I'm proud of you";
      break;
  }

  const postObject = { reaction, owner };
  return goalgetterApi
    .post(`/posts/${post_id}/reactions`, postObject)
    .then(({ data }) => {
      return data.reaction.reaction_id;
    });
};

export const deleteReaction = (reaction_id) => {
  return goalgetterApi.delete(`/reactions/${reaction_id}`);
};

export const postComment = (post_id, owner, message) => {
  const datetime = new Date(Date.now());
  const postObject = { owner, message, datetime };
  return goalgetterApi
    .post(`/posts/${post_id}/comments`, postObject)
    .then(({ data }) => {
      return data.comment[0];
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
