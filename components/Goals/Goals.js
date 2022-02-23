import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect} from "react";

const Goals = () => {
const [goals, setGoals] = useState([]);

useEffect(() => {});

  return (
    <View>
      <View style={styles.goalContainer}>
          {/* map goals by owner data here and pass to PatchGoals component*/}
      </View>
    </View>
  );
};
export default Goals;

const styles = StyleSheet.create({
  goalContainer: {
    flex: 1,
    padding: 50,
    backgroundColor: "#abbabe",
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
