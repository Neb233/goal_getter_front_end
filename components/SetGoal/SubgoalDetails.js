import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import dateFormat from "dateformat";

const SubgoalDetails = ({
  subgoals,
  setSubgoals,
  item,
  setShowSubgoalDetails,
}) => {
  const deleteS = (objective) => {
    const newSubgoals = subgoals.map((subgoal) => {
      return { ...subgoal };
    });

    setSubgoals(
      newSubgoals.filter((subgoal) => {
        return subgoal.objective != objective;
      })
    );
    setShowSubgoalDetails((showSubgoalDetails) => {
      const newState = showSubgoalDetails.map(() => {
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
            style={styles.deleteS}
            onPress={() => {
              deleteS(item.objective);
            }}
          >
            <Text style={styles.deleteSText}>Delete Subgoal</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default SubgoalDetails;

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
  deleteS: {
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
  deleteSText: {
    color: "white",
    fontWeight: "bold",
  },
});
