import React from "react";
import { StyleSheet, View, Text, TextInput, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getGoalsByUser } from "../../utils/api";

const PatchGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("jeff");
  const { owner } = useParams();

  useEffect(() => {
    getGoalsByUser("jeff").then((res) => {
      setGoals(res);
    });
  }, [loggedInUser]);

  //  console.warn(goals)

  return (
    <View style={styles.cont}>
      <Text style={styles.text}>Current goals:</Text>
      <ScrollView horizontal={true} pagingEnabled={true}>
        {goals.map((goal) => {
          return (
            <View style={styles.page}>
              <Text style={styles.pageText}>{goal.objective}</Text>
              <Text style={styles.pageText}>{goal.description}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PatchGoals;

const styles = StyleSheet.create({
  cont: {
    backgroundColor: "white",
    height: 400,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
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
  text: {
    padding: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  page: {
    height: 340,
    width: 335,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#abbabe",
    borderRadius: 5,
  },
  pageText: {
    padding: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
