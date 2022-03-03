import React from "react";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";

import { TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Card from "../../shared/card";
import {
  getCommentsByPost,
  getSubgoalBySubgoalId,
  getGoalByGoalId,
  getReactionsByPost,
  postReaction,
  deleteReaction,
  postComment,
  getSubgoalsByGoalId,
  getUser,
} from "../../utils/api";
import { formatDatetime } from "../../utils/format";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import ProgressBar from "../../shared/ProgressBar";
import { matchRoutes } from "react-router-dom";
import { Avatar } from "react-native-paper";
import { auth } from "../../firebase";

let friendPosts = [];

const getReactionCount = (reactions) => {
  const reactionCount = {
    awesome: 0,
    congrats: 0,
    encourage: 0,
    proud: 0,
  };

  reactions.forEach((reaction) => {
    switch (reaction.reaction) {
      case "Awesome!":
        reactionCount.awesome++;
        break;
      case "Congratulations!":
        reactionCount.congrats++;
        break;
      case "Keep on going":
        reactionCount.encourage++;
        break;
      case "I'm proud of you":
        reactionCount.proud++;
        break;
    }
  });
  return reactionCount;
};

const Social = (props) => {
  const navigation = useNavigation();
  const [isShowing, setIsShowing] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState("");
  const [associatedGoal, setAssociatedGoal] = useState({});
  const [reactionCount, setReactionCount] = useState({
    awesome: 0,
    congrats: 0,
    encourage: 0,
    proud: 0,
  });
  const [currentUserReaction, setCurrentUserReaction] = useState();
  const [subgoals, setSubgoals] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(
    "https://firebasestorage.googleapis.com/v0/b/goalgetter-4937c.appspot.com/o/blank%20avatar.png?alt=media&token=b003fca8-e6ca-4c55-a378-3ead9db94f0d"
  );

  let { currentUser } = props;

  if (props.friendPosts) {
    friendPosts = props.friendPosts;
  }

  const {
    owner,
    datetime,
    message,
    associated_data_type,
    associated_id,
    post_id,
    progress_point,
  } = props.postDetails;

  useEffect(() => {
    setAssociatedGoal({});
    if (associated_data_type === "subgoal") {
      getSubgoalBySubgoalId(associated_id).then((subgoal) => {
        setAssociatedGoal(subgoal);
      });
    } else {
      getGoalByGoalId(associated_id).then((goal) => {
        setAssociatedGoal(goal);
      });
      getSubgoalsByGoalId(associated_id).then((subgoals) => {
        setSubgoals(subgoals);
      });
    }
    getCommentsByPost(post_id).then((comments) => {
      setComments(comments);
    });
    getReactionsByPost(post_id).then((reactions) => {
      const reactionCount = getReactionCount(reactions);
      setReactionCount(reactionCount);
      reactions.forEach((reaction) => {
        if (reaction.owner === currentUser) {
          switch (reaction.reaction) {
            case "Awesome!":
              setCurrentUserReaction(["awesome", reaction.reaction_id]);
              break;
            case "Congratulations!":
              setCurrentUserReaction(["congrats", reaction.reaction_id]);
              break;
            case "Keep on going":
              setCurrentUserReaction(["encourage", reaction.reaction_id]);
              break;
            case "I'm proud of you":
              setCurrentUserReaction(["proud", reaction.reaction_id]);
              break;
          }
        }
      });
    });
    getUser(owner).then((user) => {
      setAvatarUrl(user[0].avatar_url);
    });
  }, [owner, friendPosts]);

  const handleCommentClick = () => {
    setIsShowing((currValue) => {
      return !currValue;
    });
  };

  const handleAddComment = () => {
    postComment(post_id, currentUser, currentComment).then((comment) => {
      setComments((oldComments) => {
        const newComments = [...oldComments];
        newComments.push(comment);
        return newComments;
      });
    });
    setCurrentComment("");
  };

  const handlePostReaction = (value) => {
    setReactionCount((oldReactionCount) => {
      const newReactionCount = { ...oldReactionCount };
      newReactionCount[value] = newReactionCount[value] + 1;
      return newReactionCount;
    });
    postReaction(post_id, value, currentUser).then((reaction_id) => {
      setCurrentUserReaction([value, reaction_id]);
    });
  };

  const handleUnreact = () => {
    setReactionCount((oldReactionCount) => {
      const newReactionCount = { ...oldReactionCount };
      newReactionCount[currentUserReaction[0]] =
        newReactionCount[currentUserReaction[0]] - 1;
      return newReactionCount;
    });
    deleteReaction(currentUserReaction[1]);
    setCurrentUserReaction(undefined);
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.goalContainer}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: avatarUrl,
              headers: {
                Accept: "*/*",
              },
            }}
            style={{
              backgroundColor: "white",
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />

          <Text
            style={styles.postUsername}
            onPress={() => {
              navigation.navigate("Calendar");
              navigation.navigate("UserPage", {
                user: owner,
              });
            }}
          >
            {owner}
          </Text>
        </View>
        <View style={styles.post}>
          <View style={styles.boxed}>
            <Text
              style={styles.objective}
              onPress={() => {
                navigation.navigate("GoalPage", {
                  goal_id: associatedGoal.goal_id,
                });
              }}
            >
              {associatedGoal.objective +
                (associatedGoal.type === "boolean" && associatedGoal.subgoal_id
                  ? " - COMPLETED"
                  : "")}
            </Text>
            {progress_point !== null &&
            Object.keys(associatedGoal).length !== 0 ? (
              <View>
                <Text
                  onPress={() => {
                    navigation.navigate("GoalPage", {
                      goal_id: associatedGoal.goal_id,
                    });
                  }}
                >
                  {associatedGoal.progress &&
                  associatedGoal.progress[parseInt(progress_point)]
                    ? `Added ${
                        Math.round(
                          100 *
                            associatedGoal.progress[
                              parseInt(progress_point)
                            ][1] -
                            (parseInt(progress_point) > 0
                              ? 100 *
                                associatedGoal.progress[
                                  parseInt(progress_point) - 1
                                ][1]
                              : 0)
                        ) / 100
                      } ${associatedGoal.unit} to ${
                        Math.round(100 * associatedGoal.target_value) / 100
                      } ${associatedGoal.unit} target`
                    : null}
                </Text>
                <Text
                  onPress={() => {
                    navigation.navigate("GoalPage", {
                      goal_id: associatedGoal.goal_id,
                    });
                  }}
                >
                  {associatedGoal.progress &&
                  associatedGoal.progress[parseInt(progress_point)]
                    ? `New progress: ${
                        Math.round(
                          100 * associatedGoal.progress[progress_point][1]
                        ) / 100
                      } ${associatedGoal.unit}`
                    : null}
                </Text>
              </View>
            ) : null}
            {Object.keys(associatedGoal).length !== 0 &&
            (!associatedGoal.subgoal_id || associatedGoal.type !== "boolean") &&
            associatedGoal.progress &&
            associatedGoal.progress[parseInt(progress_point)] ? (
              <ProgressBar
                style={styles.progress}
                progress={
                  associatedGoal.progress
                    ? associatedGoal.progress.slice(0, progress_point + 1)
                    : null
                }
                target_value={associatedGoal.target_value}
                subgoals={subgoals}
                color="#5b72a4"
              />
            ) : null}
          </View>

          <Text style={styles.message}>{message}</Text>
          <Text>{formatDatetime(datetime)}</Text>
        </View>
        <View style={styles.flexRow}>
          {reactionCount.awesome > 0 ? (
            <View style={styles.reaction}>
              {/* <View style={styles.awesome} /> */}
              <Text style={styles.awesome}>⭐</Text>
              {currentUserReaction && currentUserReaction[0] === "awesome" ? (
                <View style={styles.redCircle}>
                  <Text style={styles.count}>{reactionCount.awesome}</Text>
                </View>
              ) : (
                <View style={styles.redCircle}>
                  <Text style={styles.count}>{reactionCount.awesome}</Text>
                </View>
              )}
            </View>
          ) : null}
          {reactionCount.congrats > 0 ? (
            <View style={styles.reaction}>
              {/* <View style={styles.congrats} /> */}
              <Text style={styles.congrats}>🥳</Text>
              {currentUserReaction && currentUserReaction[0] === "congrats" ? (
                <View style={styles.redCircle}>
                  <Text style={styles.count}>{reactionCount.congrats}</Text>
                </View>
              ) : (
                <View style={styles.redCircle}>
                  <Text style={styles.count}>{reactionCount.congrats}</Text>
                </View>
              )}
            </View>
          ) : null}
          {reactionCount.encourage > 0 ? (
            <View style={styles.reaction}>
              {/* <View style={styles.encourage} /> */}
              <Text style={styles.encourage}>🏆</Text>
              {currentUserReaction && currentUserReaction[0] === "encourage" ? (
                <View style={styles.redCircle}>
                  <Text style={styles.count}>{reactionCount.encourage}</Text>
                </View>
              ) : (
                <View style={styles.redCircle}>
                  <Text style={styles.count}>{reactionCount.encourage}</Text>
                </View>
              )}
            </View>
          ) : null}
          {reactionCount.proud > 0 ? (
            <View style={styles.reaction}>
              {/* <View style={styles.proud} /> */}
              <Text style={styles.proud}>👏</Text>
              {currentUserReaction && currentUserReaction[0] === "proud" ? (
                <View style={styles.redCircle}>
                  <Text style={styles.count}>{reactionCount.proud}</Text>
                </View>
              ) : (
                <View style={styles.redCircle}>
                  <Text style={styles.count}>{reactionCount.proud}</Text>
                </View>
              )}
            </View>
          ) : null}
        </View>
        <View style={styles.interact}>
          {currentUserReaction ? (
            <TouchableOpacity
              style={styles.unreact}
              onPress={() => {
                handleUnreact();
              }}
            >
              <Text style={styles.comment}>Unreact</Text>
            </TouchableOpacity>
          ) : (
            <MenuProvider
              style={{
                flexDirection: "column",
                paddingTop: 30,
                paddingBottom: 30,
              }}
            >
              <Menu onSelect={handlePostReaction}>
                <MenuTrigger style={styles.react}>
                  <Text style={{ color: "white" }}>React</Text>
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption value="awesome" text="Awesome!" />
                  <MenuOption value="congrats" text="Congrats!" />
                  <MenuOption value="encourage" text="Keep on going" />
                  <MenuOption value="proud" text="I'm proud of you" />
                </MenuOptions>
              </Menu>
            </MenuProvider>
          )}

          <TouchableOpacity
            style={styles.comButton}
            onPress={() => {
              handleCommentClick();
            }}
          >
            <Text style={styles.comment}>Comment</Text>
          </TouchableOpacity>
        </View>

        <View>
          {isShowing ? (
            <TextInput
              style={styles.input}
              placeholder="leave a positive comment"
              onChangeText={(comment) => setCurrentComment(comment)}
              value={currentComment}
              onSubmitEditing={handleAddComment}
            />
          ) : null}
        </View>
        <View>
          {comments.length > 0 ? (
            <FlatList
              data={comments}
              renderItem={({ item }) => (
                <Card>
                  <Text
                    style={styles.username}
                    onPress={() => {
                      navigation.navigate("Calendar");
                      navigation.navigate("UserPage", {
                        user: item.owner,
                      });
                    }}
                  >
                    {item.owner}
                  </Text>
                  <Text style={styles.text}>{item.message}</Text>
                  <Text
                    style={{
                      fontSize: 8,
                      color: "white",
                      marginTop: 5,
                      alignSelf: "flex-end",
                    }}
                  >
                    {formatDatetime(item.datetime)}
                  </Text>
                </Card>
              )}
              keyExtractor={(item) => item.comment_id}
            />
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#00ffdd",
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 10,
  },
  goalContainer: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,

    elevation: 5,
  },

  username: {
    color: "white",
    marginBottom: 15,
    fontWeight: "bold",
    // margin: 10,
  },
  postUsername: {
    color: "black",
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 20,
    margin: 10,
  },
  progress: {
    backgroundColor: "green",
  },
  interact: {
    flexDirection: "row",
    borderRadius: 10,
  },
  message: {
    margin: 15,
    fontSize: 20,
  },
  awesome: {
    // height: 30,
    // width: 30,
    // backgroundColor: "blue",
    borderRadius: 15,
    marginRight: 2,
    fontSize: 35,
  },
  congrats: {
    // height: 30,
    // width: 30,
    // backgroundColor: "yellow",
    // borderRadius: 15,
    // marginRight: 8,
    fontSize: 35,
  },
  encourage: {
    // height: 30,
    // width: 30,
    // backgroundColor: "green",
    // borderRadius: 15,
    // marginRight: 8,
    fontSize: 35,
  },
  proud: {
    // height: 30,
    // width: 30,
    // backgroundColor: "pink",
    // borderRadius: 15,
    // marginRight: 8,
    fontSize: 35,
  },

  profilePic: {
    height: 40,
    width: 40,
    backgroundColor: "grey",
    borderRadius: 50,
  },
  userInfo: {
    flexDirection: "row",
  },
  post: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  goal: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  react: {
    backgroundColor: "#468705",
    borderRadius: 8,
    marginTop: 10,
    color: "white",
    padding: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  unreact: {
    backgroundColor: "red",
    borderRadius: 8,
    marginTop: 40,
    marginBottom: 30,
    padding: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#468705",
    borderRadius: 8,
    marginTop: 20,
  },
  comButton: {
    backgroundColor: "#4892b7",
    borderRadius: 8,

    marginTop: 40,
    marginLeft: 10,
    marginBottom: 30,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  flexRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  comment: {
    color: "white",
  },
  input: {
    padding: 7,
    marginTop: 15,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 50,
  },

  redText: {
    //   color: "red",
    // },
    // blueText: {
    //   color: "blue",
    //   fontWeight: "bold",
  },
  boxed: {
    // borderWidth: 1,
    // borderColor: "black",
  },
  objective: {
    fontWeight: "bold",
    color: "#00b12c",
    fontSize: 18,
    marginBottom: 8,
    alignSelf: "center",
  },
  reaction: {
    // paddingLeft: 5,
    // paddingRight: 5,
    // flexDirection: "row",
    // alignItems: "center",
  },
  redCircle: {
    height: 18,
    width: 20,
    backgroundColor: "blue",
    borderRadius: 50,
  },
  count: {
    alignSelf: "center",
    color: "white",
  },
  text: {
    color: "white",
  },
});

export default Social;
