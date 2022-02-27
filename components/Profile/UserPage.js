import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { getGoalsByUser } from "../../utils/api";
import dateFormat, { masks } from "dateformat";

const Goals = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const user = "jeff";

  useEffect(() => {
    getGoalsByUser(user).then((goals) => {
      setGoals(goals);
    });
  }, [user]);

  return (
    <View style={styles.goalContainer}>
      <Text style={styles.currentgoals}>Current Goals:</Text>
      <FlatList
        data={goals}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity onPress={navigation.navigate}>
              <View>
                <Text style={styles.title}>{item.objective}</Text>
              </View>
              <View>
                <Text style={styles.duedate}>
                  End date: {dateFormat(item.end_date, "dddd, mmmm dS, yyyy")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};
export default Goals;

const styles = StyleSheet.create({
  goalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    backgroundColor: "#abbabe",
    borderRadius: 5,
    flex: 1,
    margin: 2,
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
  title: {
    fontWeight: "bold",
    color: "white",
    marginTop: 15,
    margin: 5,
  },
  duedate: {
    color: "white",
    marginLeft: 130,
    marginRight: 5,
    marginBottom: 2,
  },
  currentgoals: {
    fontWeight: "bold",
    margin: 5,
  },
});
