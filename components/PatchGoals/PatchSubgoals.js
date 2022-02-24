import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { patchSubGoalbyId } from "../../utils/api";

const PatchSubGoal = ({ goal, goals }) => {
  const [progress, setProgress] = useState(0);


  const submitTime = new Date(Date.now())
  
  const submitDate = new Date(submitTime.getYear(), submitTime.getMonth(), submitTime.getDate())

  const patchObject = {
      date: submitDate,
      value: progress
  }
  
  const onSubmit = () => {
      patchSubGoalbyId(goal.subgoal_id, patchObject)
      console.warn(goal)
  }

  return (
    <View>
      <View>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="completed..."
          onChangeText={setProgress}
          value={progress}
        />
      </View>
      <View>
        <TouchableOpacity style={styles.update}
       onPress={onSubmit}
        >
          <Text style={styles.updateText}>Submit progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PatchSubGoal;

const styles = StyleSheet.create({
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
    margin: 10,
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
  input: {
    backgroundColor: "white",
    flexDirection: "column",
    marginLeft: 5,
    borderRadius: 10,
    padding: 3,
  },
});
