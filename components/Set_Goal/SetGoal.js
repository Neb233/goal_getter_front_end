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
import React, { useState } from "react";
import Card from "../../shared/card";
import SubGoalForm from "./SubGoalForm";
import { HideableView } from "../../shared/HideableView";
import { postGoal } from "../../utils/api";

const SetGoal = ({ navigation, route }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [subGoals, setSubGoals] = useState([
    {
      title: "Learn F Major Chord",
      objective: "Learn where to put fingers on fretbaord",
      start_date: "12/04/2022",
      end_date: "13/04/2022",
      type: "music",
      status: "in progress",
      owner: "Bob",
    },
    {
      title: "Learn C Major",
      start_date: "12/04/2022",
      end_date: "13/04/2022",
      type: "music",
      status: "in progress",
      owner: "Bob",
    },
  ]);

  const { goalProperties } = route.params;

  const addSubGoal = (subGoal) => {
    setSubGoals((currentSubGoals) => {
      return [...currentSubGoals, subGoal];
    });
    setModalOpen(false);
  };

  const handleAddGoal = () => {
    postGoal(goalProperties);
    navigation.navigate("Feed");
  };

  return (
    <SafeAreaView>
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Button
            title="Close"
            onPress={() => {
              setModalOpen(false);
            }}
          ></Button>
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
      <HideableView hidden={goalProperties.target_value === ""}>
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
              onPress={() => navigation.navigate("SubGoalDetails", item)}
            >
              <Card>
                <Text>{item.title}</Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      </View>
      <View>
        <Button
          title="Add Subgoal"
          onPress={() => {
            setModalOpen(true);
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
  },
});

export default SetGoal;
