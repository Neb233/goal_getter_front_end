import React from "react";
import { StyleSheet, Button, TextInput, View, Text } from "react-native";

const SetGoalGuide = () => {
  return (
    <View>
      <Text>Put more info</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
  },
  input: {
    borderColor: "black",
    borderRadius: 10,
  },
});

export default SetGoalGuide;
