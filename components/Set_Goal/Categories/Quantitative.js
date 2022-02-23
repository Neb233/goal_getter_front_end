import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import SubGoalForm from "../SubGoalForm";

const Quantitative = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(event.target);
    setShowStartDate(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const showStartDatePicker = (event) => {
    console.log(event.target);
    setShowStartDate(true);
  };

  return (
    <SafeAreaView>
      <Button
        title="Return"
        onPress={() => navigation.navigate("SetGoal")}
      ></Button>
      <Text>Quantitative</Text>
      <TextInput type="text" placeholder="Goal Name" style={styles.input} />
      <TextInput type="text" placeholder="0" style={styles.input} />
      <TextInput type="text" placeholder="Unit" style={styles.input} />

      <View>
        <View style={{ margin: 20 }}>
          <Button title="StartDatePicker" onPress={showStartDatePicker} />
        </View>
        {showStartDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24HOUR={true}
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Quantitative;
