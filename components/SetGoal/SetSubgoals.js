import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Card from "../../shared/Card";
import SubgoalForm from "./SubgoalForm";
import { postGoal, postSubgoal } from "../../utils/api";
import SubgoalDetails from "./SubgoalDetails";
import { IconButton } from "react-native-paper";
import { auth } from "../../firebase";

const SetSubgoals = ({ navigation, route }) => {
  const currentUser = auth.currentUser.displayName;
  if (!route.params) {
    route.params = { goalProperties: {}, clickCounter: 0 };
  }

  let { goalProperties } = route.params;

  const [addSubgoalModalOpen, setAddSModalOpen] = useState(false);

  const [subgoals, setSubgoals] = useState([]);
  const [showSubgoalDetails, setShowSubgoalDetails] = useState(
    subgoals.map(() => {
      return false;
    })
  );

  useEffect(() => {
    if (!route.params) {
      route.params = { goalProperties: {}, clickCounter: 0 };
    } else {
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
    setSubgoals([]);
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
        setSubgoals((oldSubgoals) => {
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
        setSubgoals((oldSubgoals) => {
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
      setSubgoals([
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
    setShowSubgoalDetails(
      subgoals.map(() => {
        return false;
      })
    );
  }, [subgoals]);

  const addSubgoal = (s) => {
    setSubgoals((currentSubgoals) => {
      return [...currentSubgoals, s];
    });
    setAddSModalOpen(false);
  };

  const handleAddGoal = () => {
    postGoal(goalProperties, auth.currentUser.displayName).then((goal_id) => {
      subgoals.forEach((subgoal) => {
        postSubgoal(subgoal, goal_id, auth.currentUser.displayName);
      });
    });

    navigation.navigate("SetGoal");
    navigation.navigate("Feed");
  };

  return (
    <ScrollView style={styles.container}>
      <Modal
        visible={addSubgoalModalOpen}
        animationType="slide"
        style={styles.subgoalformmodal}
      >
        <ScrollView style={styles.modalContainer}>
          <IconButton
            icon="close"
            color="black"
            size={20}
            onPress={() => {
              setAddSModalOpen(false);
            }}
          ></IconButton>
          <SubgoalForm
            goalEndDate={route.params.goalProperties.end_date}
            goalStartDate={route.params.goalProperties.start_date}
            addSubgoal={addSubgoal}
            setShowSubgoalDetails={setShowSubgoalDetails}
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
          navigation.navigate("SetGoal", {
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
      <Text style={styles.header}>Subgoals</Text>

      {subgoals.length === 0 ? (
        <View>
          <Text>Add some Subgoals!</Text>
        </View>
      ) : (
        <View>
          <FlatList
            data={subgoals}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setShowSubgoalDetails((showSubgoalDetails) => {
                    const newState = showSubgoalDetails.map(
                      (boolean, index) => {
                        return subgoals.indexOf(item) === index;
                      }
                    );
                    return newState;
                  });
                }}
              >
                <Modal
                  visible={showSubgoalDetails[subgoals.indexOf(item)] === true}
                  animationType="fade"
                >
                  <ScrollView style={styles.modalContainer}>
                    <IconButton
                      icon="close"
                      color="black"
                      size={20}
                      onPress={() => {
                        setShowSubgoalDetails((showSubgoalDetails) => {
                          const newState = showSubgoalDetails.map(() => {
                            return false;
                          });
                          return newState;
                        });
                      }}
                    />
                    <SubgoalDetails
                      setSubgoals={setSubgoals}
                      setShowSubgoalDetails={setShowSubgoalDetails}
                      showSubgoalDetails={showSubgoalDetails}
                      subgoals={subgoals}
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

      <View>
        <TouchableOpacity
          style={styles.addsubgoalbutton}
          onPress={() => {
            setAddSModalOpen(true);
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

export default SetSubgoals;
