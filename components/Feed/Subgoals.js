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
    <View >
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
      <View style={styles.page}>
       {/* pagingEnabled={true} */}
        <ScrollView horizontal={true}  >
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
                    <View style={[styles.progress, styles.checkBox]}>
                      {/* <Text>Complete?</Text> */}
                      <BouncyCheckbox
                        text={goal.objective}
                        textStyle={{
                          color: "white",
                          fontSize: 24,
                          fontWeight: "bold",
                        }}
                        style={styles.checkBox}
                        onPress={() => handleCheckBoxClick(goal)}
                      />
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

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    backgroundColor: "white",
    height: 350,
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
    color: '#3e4d6e',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  page: {
    // height: 260,
    // width: 335,
    // marginLeft: 5,
    // marginRight: 5,
    // backgroundColor: "white",
    // borderRadius: 5,
  },
  subGoal: {
    flex: 1,
    
    backgroundColor: "#5b72a4",
    height: 250,
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
    // flex: 1,
    // height: 260,
    // maxWidth: 400,
    // minWidth: 330,
    // marginLeft: 10,
    // marginRight: 5,
    // backgroundColor: "#158e9e",
    // alignItems: 'center',
    // justifyContent: 'center'
    // borderRadius: 5,
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
    // alignItems: "center",
    // justifyContent: "center",
    // position: "relative",
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
    color: "white",
  },
  duedate: {
    color: "white",
    marginLeft: -30,
    marginRight: 5,
    marginBottom: 2,
  },
  checkBox: {
    flexDirection: "column",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    margin: 40,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 70,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    margin: 5,
  },
});
