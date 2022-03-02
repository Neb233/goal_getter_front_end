import {
  StyleSheet,
  Text,
  View,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Formik, useField } from "formik";
import dateFormat from "dateformat";

const SubGoalDetails = ({
  subGoals,
  setSubGoals,
  item,
  setShowSubGoalDetails,
  showSubGoalDetails,
}) => {
  const deleteSubGoal = (objective) => {
    const newSubGoals = subGoals.map((subgoal) => {
      return { ...subgoal };
    });

    setSubGoals(
      newSubGoals.filter((subgoal) => {
        return subgoal.objective != objective;
      })
    );
    setShowSubGoalDetails((showSubGoalDetails) => {
      const newState = showSubGoalDetails.map(() => {
        return false;
      });
      return newState;
    });
  };

  return (
    // <KeyboardAvoidingView
    //   style={{
    //     flex: 1,
    //     flexDirection: "column",
    //     marginTop: 20,
    //     marginBottom: 20,
    //   }}
    //   behavior="padding"
    //   enabled
    //   keyboardVerticalOffset={100}
    // >
    <ScrollView>
      <View style={styles.fieldcontainer}>
        <Text style={styles.title}>Objective</Text>
        <Text style={styles.value}>{item.objective}</Text>
      </View>
      <View style={styles.fieldcontainer}>
        <Text style={styles.title}>End date</Text>
        <Text style={styles.value}>
          {dateFormat(item.end_date, "dd/mm/yyyy")}
        </Text>
      </View>
      <View>
        {item.target_value != null && item.unit != null ? (
          <View style={styles.fieldcontainer}>
            <Text>Target</Text>
            <Text style={styles.value}>
              {item.target_value} {item.unit}
            </Text>
          </View>
        ) : null}
      </View>
      <View>
        <TouchableOpacity
         style={styles.deleteSubGoal}
          onPress={() => {
            deleteSubGoal(item.objective);
          }}
        ><Text style={styles.deleteSubGoalText}>Delete Subgoal</Text></TouchableOpacity>
      </View>
    </ScrollView>
    // </KeyboardAvoidingView>
  );
};

export default SubGoalDetails;

const styles = StyleSheet.create({
  fieldcontainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "white",
    borderRadius: 5,
   
    padding: 5,
  },
  value: {
    marginLeft: 100,
  },
  title: {
    fontWeight: "bold",
  },
  deleteSubGoal: {
    margin: 10,
    padding: 10,
    height: 50,
    // width: "100%",
    backgroundColor: "red",
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
  deleteSubGoalText: {
    color: "white",
    fontWeight: "bold"
  }
});
