import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getSubGoalsByUser,
  getGoalByGoalId,
  getSubgoalsByGoalId,
  patchSubgoalStatusById,
  patchGoalStatusById,
} from "../../utils/api";
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
  const [congratsModalVisible, setCongratsModalVisible] = useState(false);
  const [goalObjective, setGoalObjective] = useState("");

  useEffect(() => {
    getSubGoalsByUser(loggedInUser).then((subgoals) => {
      const currentSubgoals = subgoals.filter((subgoal) => {
        const currentDate = new Date(Date.now());
        const endDate = new Date(subgoal.end_date);
        if (subgoal.type === "boolean") {
          return (
            endDate.getDate() === currentDate.getDate() &&
            endDate.getMonth() === currentDate.getMonth() &&
            endDate.getFullYear() === currentDate.getFullYear() &&
            subgoal.status === "active"
          );
        } else {
          const startDate = new Date(subgoal.start_date);
          const dayAfterEndDate = new Date(
            new Date(endDate).setDate(endDate.getDate() + 1)
          );
          return (
            startDate.getTime() < Date.now() &&
            dayAfterEndDate.getTime() > Date.now()
          );
        }
      });
      setGoals(currentSubgoals);
    });
  }, [loggedInUser]);

  const handleCheckBoxClick = (subgoal) => {
    setIsChecked((currVal) => !currVal);
    getGoalByGoalId(subgoal.goal_id)
      .then((supergoal) => {
        setGoalObjective(supergoal.objective);
      })
      .then(() => {
        patchSubgoalStatusById(subgoal.subgoal_id, "completed")
          .then(() => {
            const subgoalPromise = getSubgoalsByGoalId(subgoal.goal_id);
            const goalPromise = getGoalByGoalId(subgoal.goal_id);
            return Promise.all([subgoalPromise, goalPromise]);
          })
          .then(([subgoals, supergoal]) => {
            let allSubgoalsCompleted = true;
            for (const subgoal of subgoals) {
              if (subgoal.status === "active") {
                allSubgoalsCompleted = false;
              }
            }
            if (allSubgoalsCompleted) {
              console.log("adsadsdasads");
              setCongratsModalVisible(true);
              return patchGoalStatusById(supergoal.goal_id, "completed");
            }
            return null;
          });
      });
  };

  const handleCongratsMessageSubmit = () => {
    setCongratsModalVisible(!congratsModalVisible);
  };

  return (
    // style={styles.cont}
    <View>
      <Modal
        animaitonType="slide"
        transparent={true}
        visible={congratsModalVisible}
        onRequestClose={() => {
          setCongratsModalVisible(!congratsModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>
              Congratulations! You completed your goal "{goalObjective}"!
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleCongratsMessageSubmit}
            >
              <Text style={styles.textStyle}>Great News!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text style={styles.text}>Tell us what progress you've made today</Text>
      <View style={{ flex: 1 }}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          style={{ flex: 1, flexDirection: "row", padding: 5 }}
        >
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
                      {/* <ProgressBar
                        progress={goal.progress}
                        target_value={goal.target_value}
                      /> */}
                      <View style={styles.progress}>
                        {/* <Text style={styles.unit}>Made progress?</Text> */}
                        <PatchSubGoal
                          goals={goals}
                          setGoals={setGoals}
                          goal={goal}
                          goalUnit={goal.unit}
                          setFriendPosts={setFriendPosts}
                        />
                        {/* <Text style={styles.unit}>{goal.unit}</Text> */}
                      </View>
                    </View>
                  ) : (
                    // <View style={[styles.progress, styles.checkBox]}>
                    <View>
                    <View style={{ flexDirection: "column" }}>
                      {/* <Text>Complete?</Text> */}
                      <BouncyCheckbox
                        text={goal.objective}
                        size={30}
                        fillColor="#19e63b"
                        unfillColor="#FFFFFF"
                        iconStyle={{ borderColor: "blue" }}
                        textStyle={{
                          color: "white",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                        style={{marginBottom: 30, flexDirection: 'row'}}
                        // style={styles.checkBox}
                        onPress={() => handleCheckBoxClick(goal)}
                      />
                        </View>
                      <PostStatus
                        goal={goal}
                        subgoal={goal.subgoal_id}
                        ownerP={goal.owner}
                        setFriendPosts={setFriendPosts}
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

const { width } = Dimensions.get("screen");
const subgoalWidth = width * 1;

const styles = StyleSheet.create({
  text: {
    padding: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#3e4d6e",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  subGoal: {
    padding: 15,
    width: subgoalWidth,
    backgroundColor: "#3e4d6e",
    borderRadius: 10,
  },
  pageContent: {
    marginTop: 10,
    alignItems: "center",
  },
  goalObj: {
    flexDirection: "column",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
  },
  progress: {
    flexDirection: "row",
    margin: 5,
    padding: 10,
  },
  duedate: {
    color: "white",
  },
});
