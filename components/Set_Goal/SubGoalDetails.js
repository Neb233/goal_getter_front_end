import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import dateFormat from "dateformat";

const SubGoalDetails = ({
  subGoals,
  setSubGoals,
  item,
  setShowSubGoalDetails,
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
    <ScrollView>
      <View style={styles.fieldcontainer}>
        <Text style={styles.title}>Objective</Text>
        <Text style={styles.value}>{item.objective}</Text>
      </View>
      {item.start_date ? (
        <View style={styles.fieldcontainer}>
          <Text style={styles.title}>Start date</Text>
          <Text style={styles.value}>
            {dateFormat(item.start_date, "dddd dS mmmm yyyy")}
          </Text>
        </View>
      ) : null}
      <View style={styles.fieldcontainer}>
        <Text style={styles.title}>End date</Text>
        <Text style={styles.value}>
          {dateFormat(item.end_date, "dddd dS mmmm yyyy")}
        </Text>
      </View>
      <View>
        {item.target_value != null && item.unit != null ? (
          <View style={styles.fieldcontainer}>
            <Text style={styles.title}>Target</Text>
            <Text style={styles.value}>
              {item.target_value} {item.unit}
            </Text>
          </View>
        ) : null}
      </View>
      {item.core ? null : (
        <View>
          <TouchableOpacity
            style={styles.deleteSubGoal}
            onPress={() => {
              deleteSubGoal(item.objective);
            }}
          >
            <Text style={styles.deleteSubGoalText}>Delete Subgoal</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
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
    width: "60%",
  },
  title: {
    fontWeight: "bold",
    width: "40%",
  },
  deleteSubGoal: {
    margin: 10,
    padding: 10,
    height: 50,
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
    fontWeight: "bold",
  },
});
