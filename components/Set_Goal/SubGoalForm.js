import React from "react";
import { StyleSheet, Button, TextInput, View, Text } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";

const ReviewSchema = yup.object({
  title: yup.string().required().min(4),
  objective: yup.string().required().min(10),
});

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
        validationSchema={ReviewSchema}
      >
        {(props) => (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="SubGoal Title"
              onChangeText={props.handleChange("title")}
              value={props.values.title}
            />
            <Text style={styles.errorText}>
              {props.touched.title && props.errors.title}
            </Text>

            <TextInput
              style={styles.input}
              multiline
              placeholder="Objective"
              onChangeText={props.handleChange("objective")}
              value={props.values.objective}
            />
            <Text style={styles.errorText}>
              {props.touched.objective && props.errors.objective}
            </Text>

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
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
  },
});

export default SubGoalForm;
