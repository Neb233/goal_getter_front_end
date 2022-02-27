import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSubGoalsByUser } from "../../utils/api";
import PatchSubGoal from "./PatchSubgoals";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import PostStatus from "./PostStatus";
import { useNavigation } from "@react-navigation/native";
import ProgressBar from "../../shared/ProgressBar";
import dateFormat from "dateformat";

const Subgoals = ({ setFriendPosts }) => {
  const navigation = useNavigation();

  const [goals, setGoals] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("jeff");
  const { owner } = useParams();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    getSubGoalsByUser("jeff").then((res) => {
      setGoals(res);
    });
  }, [loggedInUser]);

  return (
    <View style={styles.cont}>
      <Text style={styles.text}>Current subgoals:</Text>
      <View style={styles.page}>
        {/* pagingEnabled={true} */}
        <ScrollView horizontal={true}>
          {goals.map((goal) => {
            const type = goal.type === "progress";
            return (
              <View key={goal.subgoal_id} style={styles.subGoal}>
                <View style={styles.pageContent}>
                  {type ? (
                    <View style={styles.pageContent}>
                      <Text
                        style={styles.goalObj}
                        onPress={() => {
                          navigation.navigate("GoalPage", {
                            goal_id: goal.goal_id,
                          });
                        }}
                      >
                        {goal.objective}
                      </Text>
                      <Text style={styles.duedate}>
                        Start date:{" "}
                        {dateFormat(goal.start_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      <Text style={styles.duedate}>
                        End date:{" "}
                        {dateFormat(goal.end_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      <ProgressBar
                        progress={goal.progress}
                        target_value={goal.target_value}
                      />
                      <View style={styles.progress}>
                        <Text style={styles.unit}>Made progress?</Text>
                        <PatchSubGoal
                          goals={goals}
                          setGoals={setGoals}
                          goal={goal}
                          goalUnit={goal.unit}
                          setFriendPosts={setFriendPosts}
                        />
                        <Text style={styles.unit}>{goal.unit}</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.progress}>
                      {/* <Text>Complete?</Text> */}
                      <BouncyCheckbox
                        text={goal.objective}
                        textStyle={{
                          color: "white",
                          fontSize: 24,
                          fontWeight: "bold",
                        }}
                        style={styles.checkBox}
                        onPress={() => setIsChecked((currVal) => !currVal)}
                      />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default Subgoals;

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    backgroundColor: "white",
    height: 260,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    padding: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  page: {
    height: 200,
    width: 335,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#abbabe",
    borderRadius: 5,
  },
  subGoal: {
    height: 200,
    maxWidth: 400,
    minWidth: 330,
    marginLeft: 10,
    marginRight: 5,
    backgroundColor: "#abbabe",
    borderRadius: 5,
  },
  // page: {
  //     height: 170,
  //     width: 200,
  //     margin: 10
  // },
  update: {
    backgroundColor: "#4892b7",
    borderRadius: 8,
    padding: 5,
    margin: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  updateText: {
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  pageContent: {
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  goalObj: {
    flexDirection: "column",
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  goalDescription: {
    flexDirection: "column",
    padding: 10,
    fontSize: 24,
    color: "white",
  },

  updateText: {
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  progress: {
    flexDirection: "row",
    margin: 20,
  },
  input: {
    backgroundColor: "white",
    flexDirection: "column",
    marginLeft: 5,
    borderRadius: 10,
    padding: 3,
  },
  unit: {
    marginLeft: 5,
    padding: 3,
    fontWeight: "bold",
    color: "green",
  },
  duedate: {
    color: "white",
    marginLeft: -30,
    marginRight: 5,
    marginBottom: 2,
  },
});
