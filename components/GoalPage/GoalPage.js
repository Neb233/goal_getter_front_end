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
  Modal,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import dateFormat, { masks } from "dateformat";
import {
  getGoalByGoalId,
  getSubgoalsByGoalId,
  patchSubgoalStatusById,
  patchGoalStatusById,
} from "../../utils/api";
import ProgressBar from "../../shared/ProgressBar";
import PatchSubGoal from "../Feed/PatchSubgoals";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import PostStatus from "../Feed/PostStatus";
import { useFocusEffect } from "@react-navigation/native";

const GoalPage = ({ navigation, route }) => {
  const [goal, setGoal] = useState();
  const [subgoals, setSubgoals] = useState([]);
  const currentUser = "jeff";
  const { goal_id } = route.params;

  const [isChecked, setIsChecked] = useState(false);
  const [congratsModalVisible, setCongratsModalVisible] = useState(false);
  const [goalObjective, setGoalObjective] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      getGoalByGoalId(goal_id).then((goal) => {
        setGoal(goal);
      });
      getSubgoalsByGoalId(goal_id).then((subgoals) => {
        subgoals.sort((a, b) => {
          return (
            new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
          );
        });
        setSubgoals(subgoals);
      });
    }, [route.params])
  );

  const handleCheckBoxClick = (subgoal) => {
    console.log(subgoal);
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
            if (allSubgoalsCompleted && supergoal.type === "boolean") {
              console.log("adsadsdasads");
              setCongratsModalVisible(true);
              return patchGoalStatusById(supergoal.goal_id, "completed");
            }
            return null;
          })
          .then((patchedGoal) => {
            if (!patchedGoal) {
              navigation.navigate("SetGoalIntro");
              navigation.navigate("GoalPage", { goal_id: goal.goal_id });
            }
          });
      });
  };

  const handleCongratsMessageSubmit = () => {
    setCongratsModalVisible(!congratsModalVisible);
    navigation.navigate("SetGoalIntro");
    navigation.navigate("GoalPage", { goal_id: goal.goal_id });
  };
  return (
    <ScrollView style={styles.background}>
      <Modal
        animaitonType="slide"
        transparent={true}
        visible={congratsModalVisible}
        onRequestClose={() => {
          setCongratsModalVisible(!congratsModalVisible);
        }}
        style={styles.congratsModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.congratsText}>
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
      <View>
        <View style={[styles.item, styles.mainItem]}>
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
                        : Math.round(
                            100 * goal.progress[goal.progress.length - 1][1]
                          ) / 100
                    } / ${Math.round(100 * goal.target_value) / 100} ${
                      goal.unit
                    }`}
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
            ) : null}
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
                        : Math.round(
                            100 * item.progress[item.progress.length - 1][1]
                          ) / 100
                    } / ${Math.round(100 * item.target_value) / 100} ${
                      item.unit
                    }`}
                  </Text>
                  <ProgressBar
                    progress={item.progress}
                    target_value={item.target_value}
                  />
                  {currentUser === item.owner &&
                  Date.now() > new Date(item.start_date).getTime() &&
                  Date.now() <
                    new Date(
                      new Date(item.end_date).setDate(
                        new Date(item.end_date).getDate() + 1
                      )
                    ).getTime() ? (
                    <View style={styles.progress}>
                      <Text style={styles.unit}>Made progress?</Text>
                      <PatchSubGoal
                        goal={item}
                        goalUnit={item.unit}
                        goalPageId={item.goal_id}
                      />
                      <Text style={styles.unit}>{item.unit}</Text>
                    </View>
                  ) : null}
                </View>
              ) : item.status === "completed" ? (
                <Text style={styles.duedate}>COMPLETED</Text>
              ) : (
                <Text style={styles.duedate}>Incomplete</Text>
              )}
              {currentUser === item.owner &&
              item.type === "boolean" &&
              item.status === "active" &&
              Date.now() <
                new Date(
                  new Date(item.end_date).setDate(
                    new Date(item.end_date).getDate() + 1
                  )
                ).getTime() ? (
                <View style={styles.progress}>
                  <BouncyCheckbox
                    text={item.objective}
                    textStyle={styles.duedate}
                    style={styles.checkBox}
                    onPress={() => handleCheckBoxClick(item)}
                    fillColor={"#015c53"}
                  />
                  <PostStatus
                    goal={item}
                    subgoal={item.subgoal_id}
                    ownerP={item.owner}
                  />
                </View>
              ) : null}
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
    backgroundColor: "#034c52",
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#017075",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainItem: {
    borderColor: "#f48079",
    borderWidth: 2,
    width: "95%",
    margin: "auto",
  },
  item: {
    backgroundColor: "#ffc0b4",
    borderRadius: 5,
    flex: 1,
    margin: 2,
    marginTop: 10,
    shadowColor: "#f48d79",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: 5,
    borderColor: "#f48079",
    borderWidth: 1,
  },
  title: {
    fontWeight: "bold",
    marginTop: 15,
    margin: 5,
    color: "#034c52",
  },
  duedate: {
    marginLeft: 130,
    marginRight: 5,
    marginBottom: 2,
    color: "#034c52",
  },
  currentgoals: {
    fontWeight: "bold",
    margin: 5,
    color: "white",
  },
  header: {
    backgroundColor: "#034c52",
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
  progress: {
    flexDirection: "column",
    margin: 20,
  },
  unit: {
    marginLeft: 5,
    padding: 3,
    fontWeight: "bold",
    color: "green",
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
  checkBox: { color: "#015c53" },
  congratsModal: {},
  congratsText: {},
  background: { backgroundColor: "#015c53" },
});
