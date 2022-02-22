import React from "react";
import { StyleSheet, Button, TextInput, View, Text } from "react-native";
import { Formik } from "formik";

const SubGoalForm = ({ addSubGoal }) => {
  return (
    <View>
      <Formik
        initialValues={{
          title: "",
          objective: "",
        }}
        onSubmit={(values) => {
          addSubGoal(values);
        }}
      >
        {(props) => (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="SubGoal Title"
              onChangeText={props.handleChange("title")}
              value={props.values.Name}
            />

            <TextInput
              style={styles.input}
              multiline
              placeholder="Objective"
              onChangeText={props.handleChange("objective")}
              value={props.values.Description}
            />

            <Button
              title="submit"
              color="maroon"
              onPress={props.handleSubmit}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    margin: 5,
    fontSize: 18,
    borderRadius: 6,
  },
  container: {
    flex: 1,
    padding: 20,
  },
});

export default SubGoalForm;
