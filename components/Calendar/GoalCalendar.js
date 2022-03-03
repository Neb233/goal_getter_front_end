import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { useState, useEffect } from "react";
import { Card } from "react-native-paper";
import { auth } from "../../firebase";

import { getGoalsByUser, getSubGoalsByUser } from "../../utils/api";
import {
  formatGoalsForCalendar,
  formatSubgoalsForCalendar,
} from "../../utils/FormatDates";
import Nav from "../Nav/Nav";

const GoalCalendar = () => {
  let user = auth.currentUser;
  const [items, setItems] = useState({});

  const [goals, setGoals] = useState({});

  useEffect(() => {
    getSubGoalsByUser(user.displayName)
      .then((subgoals) => {
        const formattedSubgoals = formatSubgoalsForCalendar(subgoals);
        setItems(formattedSubgoals);
        return getGoalsByUser(user.displayName);
        // console.warn(formattedSubgoals)
      })
      .then((goals) => {
        const formattedGoals = formatGoalsForCalendar(goals);
        setItems((formattedSubgoals) => {
          const combinedGoalsObject = { ...formattedSubgoals };
          const formattedGoalsDates = Object.keys(formattedGoals);
          formattedGoalsDates.forEach((date) => {
            if (combinedGoalsObject.hasOwnProperty(date)) {
              combinedGoalsObject[date].push(...formattedGoals[date]);
            } else {
              combinedGoalsObject[date] = formattedGoals[date];
            }
          });

          return combinedGoalsObject;
        });
      });
  }, []);

  const renderItem = (items) => {
    return (
      <Card style={{ marginTop: 35 }}>
        <Card.Content>
          <Text>{items.name}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 0 }}>
      <Agenda
        selected={"2022-02-25"}
        items={items}
        renderItem={renderItem}
        pastScrollRange={12}
        futureScrollRange={12}
      />
    </View>
  );
};

export default GoalCalendar;

const styles = StyleSheet.create({
  calContainer: {
    backgroundColor: "#abbabe",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 15,
  },
  calendar: {
    marginTop: 15,
  },
  subGoalDetails: {
    height: 100,
    width: "95%",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
});
