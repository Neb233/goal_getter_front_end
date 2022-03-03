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
import { auth } from "../../firebase";

const GoalPage = ({ navigation, route }) => {
  const [goal, setGoal] = useState();
  const [subgoals, setSubgoals] = useState([]);
  const currentUser = auth.currentUser.displayName;
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
    <ScrollView style={{ backgroundColor: "#fdf9e6" }}>
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
                      goal.progress[0].length !== 2
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
                  color="#fdf9e6"
                />
              </View>
            ) : null}
          </View>
        </View>
      </View>
      <View style={styles.goalContainer}>
        <Text style={styles.subGoalTitle}>Your goal break down:</Text>
        <FlatList
          data={subgoals}
          renderItem={({ item }) => (
            <View style={styles.subgoalItem}>
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
                      !item.progress[0]
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
                    color="#fdf9e6"
                  />
                  {currentUser === item.owner &&
                  Date.now() > new Date(item.start_date).getTime() &&
                  Date.now() <
                    new Date(
                      new Date(item.end_date).setDate(
                        new Date(item.end_date).getDate() + 1
                      )
                    ).getTime() ? (
                    <View style={{ marginTop: 15, marginBottom: 0 }}>
                      {/* <Text style={styles.unit}>Made progress?</Text> */}
                      <PatchSubGoal
                        goal={item}
                        goalUnit={item.unit}
                        goalPageId={item.goal_id}
                      />
                      {/* <Text style={styles.unit}>{item.unit}</Text> */}
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
                    fillColor="#7FAF50"
                    unfillColor="#FFFFFF"
                    iconStyle={{ borderColor: "#7FAF50" }}
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
  goalContainer: {},
  item: {
    backgroundColor: "#3e4d6e",
    borderRadius: 5,
    flex: 1,
    margin: 2,
    marginTop: 10,
    padding: 15,
  },
  subgoalItem: {
    backgroundColor: "#5b72a4",
    borderRadius: 5,
    flex: 1,
    margin: 2,
    marginTop: 10,
    padding: 15,
  },
  title: {
    fontWeight: "bold",
    margin: 5,
    fontSize: 18,
    color: "white",
  },
  duedate: {
    margin: 5,
    color: "white",
  },

  subGoalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    marginTop: 10,
    color: "#3e4d6e",
  },
  checkBox: { color: "#015c53" },
  congratsModal: {},
  congratsText: {},
  background: { backgroundColor: "#015c53" },
});
