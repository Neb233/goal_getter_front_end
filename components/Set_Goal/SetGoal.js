import {
  StyleSheet,
  Text,
  View,
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
import { Button, IconButton } from "react-native-paper";
import { auth } from "../../firebase";

const SetGoal = ({ navigation, route }) => {
  const currentUser = auth.currentUser.displayName;
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
    postGoal(goalProperties, auth.currentUser.displayName)
      .then((goal_id) => {
        subGoals.forEach((subgoal) => {
          postSubgoal(subgoal, goal_id, auth.currentUser.displayName);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    navigation.navigate("SetGoalIntro");
    navigation.navigate("Feed");
  };

  return (
    <ScrollView style={styles.container}>
      <Modal
        visible={addSubGoalModalOpen}
        animationType="slide"
        style={styles.subgoalformmodal}
      >
        <ScrollView style={styles.modalContainer}>
          <IconButton
            icon="close"
            color="black"
            size={20}
            onPress={() => {
              setAddSubGoalModalOpen(false);
            }}
          ></IconButton>
          <SubGoalForm
            goalEndDate={route.params.goalProperties.end_date}
            goalStartDate={route.params.goalProperties.start_date}
            addSubGoal={addSubGoal}
            setShowSubGoalDetails={setShowSubGoalDetails}
            goalEndDate={goalProperties.end_date}
          />
        </ScrollView>
      </Modal>
      <TouchableOpacity
        style={styles.editgoalbutton}
        onPress={() => {
          goalProperties.target_value = "";
          goalProperties.unit = "";
          goalProperties.subgoalPeriod = "";
          navigation.navigate("SetGoalIntro", {
            goalProperties,
          });
        }}
      >
        <Text style={styles.buttontext}>Edit Goal</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Goal Details</Text>
      <View style={styles.goaldetailscontainer}>
        <Text style={styles.goaltext}>
          Objective - {goalProperties.objective}
        </Text>
        <Text style={styles.goaltext}>
          Description - {goalProperties.description}
        </Text>
        <Text style={styles.goaltext}>
          Start Date -
          {` ${new Date(goalProperties.start_date).getFullYear()}-${
            new Date(goalProperties.start_date).getMonth() + 1
          }-${new Date(goalProperties.start_date).getDate()}`}
        </Text>
        <Text style={styles.goaltext}>
          End Date -
          {` ${new Date(goalProperties.end_date).getFullYear()}-${
            new Date(goalProperties.end_date).getMonth() + 1
          }-${new Date(goalProperties.end_date).getDate()}`}
        </Text>
        {goalProperties.target_value ? (
          <View>
            <Text style={styles.goaltext}>
              Target Value - {goalProperties.target_value}
            </Text>
            <Text style={styles.goaltext}>Unit - {goalProperties.unit}</Text>
          </View>
        ) : null}
      </View>
      {/* <TouchableOpacity
      style={styles.editgoalbutton}
        onPress={() => {
          goalProperties.target_value = "";
          goalProperties.unit = "";
          goalProperties.subgoalPeriod = "";
          navigation.navigate("SetGoalIntro", {
            goalProperties,
          });
        }}
      ><Text style={styles.buttontext}>Edit Goal</Text></TouchableOpacity> */}
      <Text style={styles.header}>Subgoals</Text>

      {subGoals.length === 0 ? (
        <View>
          <Text>Add some Subgoals!</Text>
        </View>
      ) : (
        <View>
          <FlatList
            data={subGoals}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setShowSubGoalDetails((showSubGoalDetails) => {
                    const newState = showSubGoalDetails.map(
                      (boolean, index) => {
                        return subGoals.indexOf(item) === index;
                      }
                    );
                    return newState;
                  });
                }}
              >
                <Modal
                  visible={showSubGoalDetails[subGoals.indexOf(item)] === true}
                  animationType="fade"
                >
                  <ScrollView style={styles.modalContainer}>
                    <IconButton
                      icon="close"
                      color="black"
                      size={20}
                      onPress={() => {
                        setShowSubGoalDetails((showSubGoalDetails) => {
                          const newState = showSubGoalDetails.map(() => {
                            return false;
                          });
                          return newState;
                        });
                      }}
                    />
                    <SubGoalDetails
                      setSubGoals={setSubGoals}
                      setShowSubGoalDetails={setShowSubGoalDetails}
                      showSubGoalDetails={showSubGoalDetails}
                      subGoals={subGoals}
                      item={item}
                    />
                  </ScrollView>
                </Modal>
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                  <Card>
                    <Text style={styles.text}>{item.objective}</Text>
                  </Card>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {/* <View>
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
      </View> */}

      <View>
        <TouchableOpacity
          style={styles.addsubgoalbutton}
          onPress={() => {
            setAddSubGoalModalOpen(true);
          }}
        >
          <Text style={styles.buttontext}>Add Subgoal</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.addgoalbuttoncontainer}>
        <TouchableOpacity
          style={styles.addgoalbutton}
          onPress={() => {
            handleAddGoal();
          }}
        >
          <Text style={styles.buttontext}>Submit Goal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDF9E6",
  },
  addgoalbuttoncontainer: {},
  header: {
    color: "#3e4d6e",
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: "center",
  },
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
    backgroundColor: "#FDF9E6",
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
  closebutton: {
    marginBottom: 40,
  },
  subgoalscontainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  editgoalbutton: {
    margin: 10,
    padding: 10,
    height: 50,
    // width: "100%",
    backgroundColor: "#5b72a4",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,

    elevation: 5,
  },
  addsubgoalbutton: {
    margin: 10,
    padding: 10,
    height: 50,
    // width: "100%",
    backgroundColor: "#5b72a4",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,

    elevation: 5,
  },
  addgoalbutton: {
    margin: 10,
    padding: 10,
    height: 50,
    // width: "100%",
    backgroundColor: "green",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttontext: {
    color: "white",
    fontWeight: "bold",
  },
  goaldetailscontainer: {
    flex: 1,

    backgroundColor: "white",
    margin: 5,
    padding: 5,
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
  goaltext: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  subgoalformmodal: {
    margin: 10,
  },
});

export default SetGoal;
