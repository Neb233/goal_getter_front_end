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
import dateFormat, { masks } from "dateformat";
import { getGoalByGoalId, getSubgoalsByGoalId } from "../../utils/api";
import ProgressBar from "../../shared/ProgressBar";

const GoalPage = ({ navigation, route }) => {
  const [goal, setGoal] = useState();
  const [subgoals, setSubgoals] = useState([]);
  const { goal_id } = route.params;

  useEffect(() => {
    getGoalByGoalId(goal_id).then((goal) => {
      setGoal(goal);
    });
    getSubgoalsByGoalId(goal_id).then((subgoals) => {
      subgoals.sort((a, b) => {
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
      });
      setSubgoals(subgoals);
    });
  }, [goal_id]);

  return (
    <ScrollView>
      <View style={styles.header}>
        <View style={styles.item}>
          <View>
            <Text style={styles.title}>{goal ? goal.objective : ""}</Text>
          </View>
          <View>
            {goal ? (
              <View>
                <Text style={styles.duedate}>{goal.description}</Text>
                <Text style={styles.duedate}>
                  Start date:{" "}
                  {dateFormat(goal.start_date, "dddd, mmmm dS, yyyy")}
                </Text>
                <Text style={styles.duedate}>
                  End date: {dateFormat(goal.end_date, "dddd, mmmm dS, yyyy")}
                </Text>
                {goal.type === "progress" ? (
                  <Text style={styles.duedate}>
                    Current Progress:{" "}
                    {`${
                      goal.progress.length === 0
                        ? 0
                        : goal.progress[goal.progress.length - 1][1]
                    } / ${goal.target_value} ${goal.unit}`}
                  </Text>
                ) : (
                  <Text style={styles.duedate}>
                    Current Progress:{" "}
                    {`${
                      subgoals.filter((subgoal) => {
                        return subgoal.status === "completed";
                      }).length
                    } / ${subgoals.length} subgoals achieved`}
                  </Text>
                )}
                <ProgressBar
                  progress={goal.progress}
                  target_value={goal.target_value}
                  subgoals={subgoals}
                />
              </View>
            ) : (
              ""
            )}
          </View>
        </View>
      </View>
      <View style={styles.goalContainer}>
        <Text style={styles.currentgoals}>Subgoals:</Text>
        <FlatList
          data={subgoals}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View>
                <Text style={styles.title}>{item.objective}</Text>
              </View>
              <View>
                <View>
                  {item.start_date ? (
                    <Text style={styles.duedate}>
                      Start date:{" "}
                      {dateFormat(item.start_date, "dddd, mmmm dS, yyyy")}
                    </Text>
                  ) : null}
                  <Text style={styles.duedate}>
                    End date: {dateFormat(item.end_date, "dddd, mmmm dS, yyyy")}
                  </Text>
                </View>
              </View>
              {item.type === "progress" ? (
                <View>
                  <Text style={styles.duedate}>
                    Current Progress:{" "}
                    {`${
                      item.progress.length === 0
                        ? 0
                        : item.progress[item.progress.length - 1][1]
                    } / ${item.target_value} ${item.unit}`}
                  </Text>
                  <ProgressBar
                    progress={item.progress}
                    target_value={item.target_value}
                  />
                </View>
              ) : item.status === "completed" ? (
                <Text style={styles.duedate}>COMPLETED</Text>
              ) : (
                <Text style={styles.duedate}>Incomplete</Text>
              )}
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};
export default GoalPage;

const styles = StyleSheet.create({
  goalContainer: {
    flex: 1,
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
    height: 160,
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
