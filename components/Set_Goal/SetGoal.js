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
} from "react-native";
import React, { useState, useEffect } from "react";
import Card from "../../shared/card";
import SubGoalForm from "./SubGoalForm";
import { HideableView } from "../../shared/HideableView";
import { postGoal, postSubgoal } from "../../utils/api";
import SubGoalDetails from "./SubGoalDetails";
import { KeyboardAvoidingView } from "react-native-web";

const SetGoal = ({ navigation, route }) => {
  if (!route.params) {
    route.params = { goalProperties: {} };
  } else {
    route.params.goalProperties.start_date = new Date(2022, 0, 1);
    route.params.goalProperties.end_date = new Date(2022, 11, 31);
    if (route.params.goalProperties.target_value === "") {
      route.params.goalProperties.target_value = null;
    } else {
      route.params.goalProperties.target_value = parseFloat(
        route.params.goalProperties.target_value
      );
    }
    if (route.params.goalProperties.unit === "") {
      route.params.goalProperties.unit = null;
    }
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [addSubGoalModalOpen, setAddSubGoalModalOpen] = useState(false);

  const [subGoals, setSubGoals] = useState([
    {
      objective: "Finish Act 1 of novella",
      start_date: null,
      end_date: "2022-02-11T00:00:00.000Z",
      target_value: null,
      unit: null,
    },
    {
      objective: "Finish Act 2 of novella",
      start_date: null,
      end_date: "2022-02-21T00:00:00.000Z",
      target_value: null,
      unit: null,
    },
    {
      objective: "Finish Act 3 of novella",
      start_date: null,
      end_date: "2022-03-01T00:00:00.000Z",
      target_value: null,
      unit: null,
    },
    {
      objective: "Proof-read novella",
      start_date: null,
      end_date: "2022-03-04T00:00:00.000Z",
      target_value: null,
      unit: null,
    },
  ]);
  const [showSubGoalDetails, setShowSubGoalDetails] = useState(
    subGoals.map(() => {
      return false;
    })
  );

  useEffect(() => {
    subGoals.map(() => {
      return false;
    });
  }, [subGoals]);

  const { goalProperties } = route.params;

  const addSubGoal = (subGoal) => {
    setSubGoals((currentSubGoals) => {
      return [...currentSubGoals, subGoal];
    });
    setAddSubGoalModalOpen(false);
  };

  const handleAddGoal = () => {
    postGoal(goalProperties).then((goal_id) => {
      subGoals.forEach((subgoal) => {
        postSubgoal(subgoal, goal_id);
      });
    });

    navigation.navigate("Feed");
  };

  return (
    <SafeAreaView>
    
      <Modal visible={addSubGoalModalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Button
            title="Close"
            onPress={() => {
              setAddSubGoalModalOpen(false);
            }}
          />
          <SubGoalForm addSubGoal={addSubGoal} />
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
      <HideableView hidden={goalProperties.target_value === null}>
        <Text>Target Value - {goalProperties.target_value}</Text>
        <Text>
          Unit - {goalProperties.unit ? goalProperties.unit : "None specified"}
        </Text>
      </HideableView>
      <Button
        title="Edit Goal"
        onPress={() => {
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
    </SafeAreaView>
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
});

export default SetGoal;
