import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedBack,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Card from "../../shared/card";
import SubGoalForm from "./SubGoalForm";
import { HideableView } from "../../shared/HideableView";
import { postGoal, postSubgoal } from "../../utils/api";
import SubGoalDetails from "./SubGoalDetails";
import { KeyboardAvoidingView } from "react-native-web";

const SetGoal = ({ navigation, route }) => {
  const currentUser = "jeff";
  if (!route.params) {
    route.params = { goalProperties: {}, clickCounter: 0 };
  }

  let { goalProperties } = route.params;

  const [addSubGoalModalOpen, setAddSubGoalModalOpen] = useState(false);

  const [subGoals, setSubGoals] = useState([]);
  const [showSubGoalDetails, setShowSubGoalDetails] = useState(
    subGoals.map(() => {
      return false;
    })
  );

  useEffect(() => {
    if (!route.params) {
      route.params = { goalProperties: {}, clickCounter: 0 };
    } else {
      console.warn(route.params.goalProperties.target_value);

      if (route.params.goalProperties.target_value !== "") {
        route.params.goalProperties.target_value = parseFloat(
          route.params.goalProperties.target_value
        );
      }

      if (route.params.goalProperties.subgoalPeriod !== "") {
        route.params.goalProperties.subgoalPeriod = parseFloat(
          route.params.goalProperties.subgoalPeriod
        );
      }
      if (!route.params.goalProperties.subgoals) {
        route.params.goalProperties.subgoals = [];
      }
    }
    goalProperties = route.params.goalProperties;
    console.log(goalProperties);
    setSubGoals([]);
    if (goalProperties.target_value) {
      const goalNumberOfDays =
        Math.round(
          (goalProperties.end_date.getTime() -
            goalProperties.start_date.getTime()) /
            86400000
        ) + 1;
      let subgoalPeriod = 7;
      if (goalProperties.subgoalPeriod) {
        subgoalPeriod = goalProperties.subgoalPeriod;
      }
      const noOfCompleteSubgoals = Math.floor(goalNumberOfDays / subgoalPeriod);
      let finalSubgoalPeriod = goalNumberOfDays % subgoalPeriod;
      for (let i = 0; i < noOfCompleteSubgoals; i++) {
        const target_value =
          Math.round(
            (100 * (goalProperties.target_value * subgoalPeriod)) /
              goalNumberOfDays
          ) / 100;
        setSubGoals((oldSubgoals) => {
          const newSubgoals = [...oldSubgoals];
          const newSubgoal = {
            start_date: new Date(goalProperties.start_date).setDate(
              goalProperties.start_date.getDate() + i * subgoalPeriod
            ),
            end_date: new Date(goalProperties.start_date).setDate(
              goalProperties.start_date.getDate() +
                i * subgoalPeriod +
                (subgoalPeriod - 1)
            ),
            owner: currentUser,
            target_value: target_value,
            unit: goalProperties.unit,
          };
          if (
            goalProperties.objective.includes(
              goalProperties.target_value.toString()
            )
          ) {
            newSubgoal.objective = goalProperties.objective.replace(
              goalProperties.target_value.toString(),
              target_value.toString()
            );
          } else {
            newSubgoal.objective =
              target_value.toString() + " " + goalProperties.unit;
          }
          newSubgoals.push(newSubgoal);
          return newSubgoals;
        });
      }
      if (finalSubgoalPeriod > 0) {
        const target_value =
          Math.round(
            (100 * goalProperties.target_value * finalSubgoalPeriod) /
              goalNumberOfDays
          ) / 100;
        setSubGoals((oldSubgoals) => {
          const newSubgoals = [...oldSubgoals];
          const newSubgoal = {
            start_date: new Date(goalProperties.start_date).setDate(
              goalProperties.start_date.getDate() +
                noOfCompleteSubgoals * subgoalPeriod
            ),
            end_date: goalProperties.end_date,
            owner: currentUser,
            target_value: target_value,
            unit: goalProperties.unit,
            core: true,
          };
          if (
            goalProperties.objective.includes(
              goalProperties.target_value.toString()
            )
          ) {
            newSubgoal.objective = goalProperties.objective.replace(
              goalProperties.target_value.toString(),
              target_value.toString()
            );
          } else {
            newSubgoal.objective =
              target_value.toString() + " " + goalProperties.unit;
          }
          newSubgoals.push(newSubgoal);
          return newSubgoals;
        });
      }
    } else {
      setSubGoals([
        {
          objective: goalProperties.objective,
          end_date: goalProperties.end_date,
          owner: currentUser,
          core: true,
        },
      ]);
    }
  }, [route.params.clickCounter]);

  useEffect(() => {
    setShowSubGoalDetails(
      subGoals.map(() => {
        return false;
      })
    );
  }, [subGoals]);

  const addSubGoal = (subGoal) => {
    setSubGoals((currentSubGoals) => {
      return [...currentSubGoals, subGoal];
    });
    setAddSubGoalModalOpen(false);
  };

  const handleAddGoal = () => {
    console.log(subGoals);
    console.log(goalProperties);
    postGoal(goalProperties)
      .then((goal_id) => {
        subGoals.forEach((subgoal) => {
          postSubgoal(subgoal, goal_id);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    navigation.navigate("Feed");
  };

  return (
    <ScrollView>
      <Modal visible={addSubGoalModalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Button
            style={styles.closebutton}
            title="Close"
            onPress={() => {
              setAddSubGoalModalOpen(false);
            }}
          />
          <SubGoalForm
            addSubGoal={addSubGoal}
            setShowSubGoalDetails={setShowSubGoalDetails}
            goalEndDate={goalProperties.end_date}
          />
        </View>
      </Modal>

      <Text>Goal Details</Text>
      <Text>Objective - {goalProperties.objective}</Text>
      <Text>Description - {goalProperties.description}</Text>
      <Text>
        Start Date -
        {` ${new Date(goalProperties.start_date).getFullYear()}-${
          new Date(goalProperties.start_date).getMonth() + 1
        }-${new Date(goalProperties.start_date).getDate()}`}
      </Text>
      <Text>
        End Date -
        {` ${new Date(goalProperties.end_date).getFullYear()}-${
          new Date(goalProperties.end_date).getMonth() + 1
        }-${new Date(goalProperties.end_date).getDate()}`}
      </Text>
      {goalProperties.target_value ? (
        <View>
          <Text>Target Value - {goalProperties.target_value}</Text>
          <Text>Unit - {goalProperties.unit}</Text>
        </View>
      ) : null}
      <Button
        title="Edit Goal"
        onPress={() => {
          goalProperties.target_value = "";
          goalProperties.unit = "";
          goalProperties.subgoalPeriod = "";
          navigation.navigate("SetGoalIntro", {
            goalProperties,
          });
        }}
      ></Button>
      <Text>Subgoals:</Text>
      <View>
        <FlatList
          data={subGoals}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setShowSubGoalDetails((showSubGoalDetails) => {
                  const newState = showSubGoalDetails.map((boolean, index) => {
                    return subGoals.indexOf(item) === index;
                  });
                  return newState;
                });
              }}
            >
              <Modal
                visible={showSubGoalDetails[subGoals.indexOf(item)] === true}
                animationType="fade"
              >
                <View>
                  <Button
                    title="Close"
                    onPress={() => {
                      setShowSubGoalDetails((showSubGoalDetails) => {
                        const newState = showSubGoalDetails.map(() => {
                          return false;
                        });
                        return newState;
                      });
                    }}
                  ></Button>
                  <SubGoalDetails
                    setSubGoals={setSubGoals}
                    setShowSubGoalDetails={setShowSubGoalDetails}
                    showSubGoalDetails={showSubGoalDetails}
                    subGoals={subGoals}
                    item={item}
                  />
                </View>
              </Modal>
              <Card>
                <Text style={styles.text}>{item.objective}</Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      </View>
      <View>
        <Button
          title="Add SubGoal"
          onPress={() => {
            setAddSubGoalModalOpen(true);
          }}
        ></Button>

        <Button
          title="Add Goal"
          onPress={() => {
            handleAddGoal();
          }}
        ></Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
    padding: 10,
  },
  text: {
    fontWeight: "bold",
  },
  closebutton: {
    marginBottom: 40,
  },
  subgoalscontainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default SetGoal;
