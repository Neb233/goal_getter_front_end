import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { useState } from "react";
import { Card } from "react-native-paper";

const dateToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};


const GoalCalendar = () => {
  const [items, setItems] = useState({});

  const loadItems = (day) => {
    // setTimeout(() => {
    for (let i = -15; i < 85; i++) {
      const date = day.timestamp + i * 24 * 60 * 60 * 1000;

      const strDate = dateToString(date);

      if (!items[strDate]) {
        items[strDate] = [];

        items[strDate].push({
          name: "Item for " + strDate,
        });
      }
    }
    const newItems = {};
    Object.keys(items).forEach((key) => {
      newItems[key] = items[key];
    });

    setItems(newItems);
    // }, 1000);
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={{ marginTop: 35, width: 300 }}>
        <Card>
          <Card.Content>
            <View>
              <Text>{item.name}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={"2022-02-16"}
        renderItem={renderItem}
        //   renderItem={this.renderItem}
        //   renderEmptyDate={this.renderEmptyDate}
        //   rowHasChanged={this.rowHasChanged}
        //   showClosingKnob={true}
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

//   <Calendar
//     style={styles.calendar}
//     // minDate={'2022-02-22'}
//     onDayPress={(day) => {
//       console.warn("selected day", day);
//       setExpandSubGoal(true);
//     }}
//     hideExtraDays={true}
//     enableSwipeMonths={true}
//     markingType="multi-period"
//     markedDates={subGoalDates}
//   />
// </View>
// <View>
//   {expandSubGoal ? (
//     <View style={styles.subGoalDetails}>
//       {/*Here will display subGoal component of click of the active subgoals on the pressed calendar day */}
//       <Text>SubGoal details</Text>
//     </View>
//   ) : null}
