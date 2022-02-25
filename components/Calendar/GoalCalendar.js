import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { useState, useEffect } from "react";
import { Card } from "react-native-paper";
import { getSubGoalsByUser } from "../../utils/api";

// const dateToString = (time) => {
//   const date = new Date(time);
//   return date.toISOString().split("T")[0];
// };


const GoalCalendar = () => {
  const [items, setItems] = useState({'2022-02-25': [{name: 'objective'}]})

  const [subgoals, setSubgoals] = useState({})

  const subgoalsArray = [{...subgoals}]
  const itemFormat = subgoalsArray.map((subgoal, index) => {
    
  })
  

  useEffect(() => {
    getSubGoalsByUser('jeff').then((res) => {
      setSubgoals(res)
    })
  }, ['jeff']);
  
const renderItem = (items) => {
  return (
    <View style={{margin: 50}}>
      <Text>{items.name}</Text>
    </View>
  )
}
  return (
    <View style={{ flex: 1, marginTop: 0 }}>

      <Agenda
      selected={"2022-02-25"}
      items={items}
      renderItem={renderItem}/>
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
