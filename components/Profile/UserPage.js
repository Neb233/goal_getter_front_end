import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import {
  getGoalsByUser,
  getPostsByUser,
  getSubgoalsByGoalId,
  getUser,
} from "../../utils/api";
import dateFormat, { masks } from "dateformat";
import Social from "../Feed/Social";
import ProgressBar from "../../shared/ProgressBar";

const Goals = ({ navigation, route }) => {
  const [goals, setGoals] = useState([]);
  const [oldGoals, setOldGoals] = useState();
  const [futureGoals, setFutureGoals] = useState();
  const [userDetails, setUserDetails] = useState({ username: "", profile: "" });
  const [userPosts, setUserPosts] = useState([]);
  const [showGoals, setShowGoals] = useState(false);
  const [subgoals, setSubgoals] = useState({});
  const { user } = route.params;

  useEffect(() => {
    setSubgoals({});
    setGoals([]);
    setFutureGoals([]);
    setOldGoals([]);
    setShowGoals(false);
    getGoalsByUser(user).then((goals) => {
      goals.forEach((goal) => {
        getSubgoalsByGoalId(goal.goal_id).then((subgoals) => {
          setSubgoals((oldSubgoals) => {
            const newSubgoals = { ...oldSubgoals };
            newSubgoals[goal.goal_id] = subgoals;
            return newSubgoals;
          });
        });
      });

      setGoals(
        goals.filter((goal) => {
          return (
            new Date(goal.end_date).getTime() > Date.now() &&
            new Date(goal.start_date).getTime() < Date.now()
          );
        })
      );
      setOldGoals(
        goals.filter((goal) => {
          return new Date(goal.end_date).getTime() < Date.now();
        })
      );
      setFutureGoals(
        goals.filter((goal) => {
          return new Date(goal.start_date).getTime() > Date.now();
        })
      );
    });
    getPostsByUser(user).then((posts) => {
      setUserPosts(posts);
    });
    getUser(user).then((userDetails) => {
      setUserDetails(userDetails[0]);
    });
  }, [user]);

  return (
    <ScrollView>
      <View style={styles.header}>
        <Image source={""} style={styles.profPic} />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.userName}>{user}</Text>
            <Text>{userDetails.profile}</Text>
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShowGoals((oldShowGoals) => {
              return !oldShowGoals;
            });
          }}
        >
          <Text>{showGoals ? "Show Social Feed" : "Show Goals"}</Text>
        </TouchableOpacity>
      </View>
      {showGoals ? (
        <View>
          <View style={styles.goalContainer}>
            <Text style={styles.currentgoals}>Current Goals:</Text>
            <FlatList
              data={goals}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("GoalPage", {
                        goal_id: item.goal_id,
                      });
                    }}
                  >
                    <View>
                      <Text style={styles.title}>{item.objective}</Text>
                    </View>
                    <View>
                      <Text>{item.description}</Text>
                      <Text style={styles.duedate}>
                        Start date:{" "}
                        {dateFormat(item.start_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      <Text style={styles.duedate}>
                        End date:{" "}
                        {dateFormat(item.end_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      {item.type === "progress" ? (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {`${
                            item.progress.length === 0
                              ? 0
                              : item.progress[item.progress.length - 1][1]
                          } / ${item.target_value} ${item.unit}`}
                        </Text>
                      ) : (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {subgoals[item.goal_id]
                            ? `${
                                subgoals[item.goal_id].filter((subgoal) => {
                                  return subgoal.status === "completed";
                                }).length
                              } / ${
                                subgoals[item.goal_id].length
                              } subgoals achieved`
                            : null}
                        </Text>
                      )}
                      {item.progress || subgoals[item.goal_id] ? (
                        <ProgressBar
                          progress={item.progress}
                          target_value={item.target_value}
                          subgoals={subgoals[item.goal_id]}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View style={styles.goalContainer}>
            <Text style={styles.currentgoals}>Past Goals:</Text>
            <FlatList
              data={oldGoals}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("GoalPage", {
                        goal_id: item.goal_id,
                      });
                    }}
                  >
                    <View>
                      <Text style={styles.title}>{item.objective}</Text>
                    </View>
                    <View>
                      <Text>{item.description}</Text>
                      <Text style={styles.duedate}>
                        Start date:{" "}
                        {dateFormat(item.start_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      <Text style={styles.duedate}>
                        End date:{" "}
                        {dateFormat(item.end_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      {item.type === "progress" ? (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {`${
                            item.progress.length === 0
                              ? 0
                              : item.progress[item.progress.length - 1][1]
                          } / ${item.target_value} ${item.unit}`}
                        </Text>
                      ) : (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {subgoals[item.goal_id]
                            ? `${
                                subgoals[item.goal_id].filter((subgoal) => {
                                  return subgoal.status === "completed";
                                }).length
                              } / ${
                                subgoals[item.goal_id].length
                              } subgoals achieved`
                            : null}
                        </Text>
                      )}
                      {item.progress || subgoals[item.goal_id] ? (
                        <ProgressBar
                          progress={item.progress}
                          target_value={item.target_value}
                          subgoals={subgoals[item.goal_id]}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View style={styles.goalContainer}>
            <Text style={styles.currentgoals}>Upcoming Goals:</Text>
            <FlatList
              data={futureGoals}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("GoalPage", {
                        goal_id: item.goal_id,
                      });
                    }}
                  >
                    <View>
                      <Text style={styles.title}>{item.objective}</Text>
                    </View>
                    <View>
                      <Text>{item.description}</Text>
                      <Text style={styles.duedate}>
                        Start date:{" "}
                        {dateFormat(item.start_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      <Text style={styles.duedate}>
                        End date:{" "}
                        {dateFormat(item.end_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      {item.type === "progress" ? (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {`${
                            item.progress.length === 0
                              ? 0
                              : item.progress[item.progress.length - 1][1]
                          } / ${item.target_value} ${item.unit}`}
                        </Text>
                      ) : (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {subgoals[item.goal_id]
                            ? `${
                                subgoals[item.goal_id].filter((subgoal) => {
                                  return subgoal.status === "completed";
                                }).length
                              } / ${
                                subgoals[item.goal_id].length
                              } subgoals achieved`
                            : null}
                        </Text>
                      )}
                      {item.progress || subgoals[item.goal_id] ? (
                        <ProgressBar
                          progress={item.progress}
                          target_value={item.target_value}
                          subgoals={subgoals[item.goal_id]}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      ) : (
        <View>
          <FlatList
            data={userPosts}
            renderItem={({ item }) => <Social postDetails={item} />}
          />
        </View>
      )}
    </ScrollView>
  );
};
export default Goals;

const styles = StyleSheet.create({
  goalContainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    backgroundColor: "#abbabe",
    borderRadius: 5,
    flex: 1,
    margin: 2,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    color: "white",
    marginTop: 15,
    margin: 5,
  },
  duedate: {
    color: "white",
    marginLeft: 130,
    marginRight: 5,
    marginBottom: 2,
  },
  currentgoals: {
    fontWeight: "bold",
    margin: 5,
  },
  header: {
    backgroundColor: "#5df542",
    height: 100,
  },
  profPic: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 30,
  },
  userName: {
    fontSize: 22,
    color: "#fc03ba",
    fontWeight: "600",
    marginBottom: 40,
  },
  body: {
    marginTop: 150,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "90%",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
    marginTop: 200,
  },
});
