import React, { useState } from "react";
import {
  StyleSheet,
  Button,
  TextInput,
  View,
  Text,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { ErrorMessage, Formik, useField } from "formik";
import * as yup from "yup";
import DatePicker from "../../shared/DatePicker";
import { prodErrorMap } from "firebase/auth";
import { HideableView } from "../../shared/HideableView";

const ReviewSchema = yup.object({
  objective: yup.string().required(),
  start_date: yup.date(),
  end_date: yup.date(),
  target_value: yup.number().min(0),
  unit: yup.string(),
});

const SubGoalForm = ({ addSubGoal, setShowSubGoalDetails, goalEndDate }) => {
  const [hideProgressOptions, setHideProgressOptions] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    isEnabled ? setHideProgressOptions(true) : setHideProgressOptions(false);
  };

  return (
    <View>
      <Formik
        initialValues={{
          objective: "",
          start_date: "",
          end_date: new Date(goalEndDate),
          target_value: "",
          unit: "",
        }}
        onSubmit={(values) => {
          addSubGoal(values);
        }}
        validationSchema={ReviewSchema}
      >
        {(props) => (
          <ScrollView>
            <View style={styles.container}>
              <Text>Objective</Text>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Objective"
                onChangeText={props.handleChange("objective")}
                value={props.values.objective}
                name="objective"
              />
              <ErrorMessage name="objective">
                {() => {
                  return <Text>Objective is required</Text>;
                }}
              </ErrorMessage>
            </View>
            <Text style={styles.errorText}>
              {props.touched.objective && props.errors.end_date}
            </Text>

            <Text>End Date</Text>
            <DatePicker name="end_date" value={props.values.end_date} />
            <Text>
              {`${new Date(props.values.end_date).getFullYear()}-${
                new Date(props.values.end_date).getMonth() + 1
              }-${new Date(props.values.end_date).getDate()}`}
            </Text>
            <View style={styles.switchcontainer}>
              <Text>
                If this subgoal has a numerical target value associated with it,
                let us know and we'll help you track your progress.
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={styles.switch}
              />
            </View>

            <HideableView
              hidden={hideProgressOptions}
              style={styles.HideableView}
            >
              <Text>Target Value</Text>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Target Value"
                type="number"
                onChangeText={props.handleChange("target_value")}
                value={props.values.target_value}
                keyboardType="numeric"
                name="target_value"
              />
              <ErrorMessage name="target_value">
                {() => {
                  return <Text>Target value must be a number</Text>;
                }}
              </ErrorMessage>
              <Text>Unit</Text>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Units"
                onChangeText={props.handleChange("unit")}
                value={props.values.unit}
              />
              <Text>Start Date</Text>
              <DatePicker name="start_date" value={props.values.start_date} />
              <Text>
                {props.values.start_date
                  ? `${new Date(props.values.start_date).getFullYear()}-${
                      new Date(props.values.start_date).getMonth() + 1
                    }-${new Date(props.values.start_date).getDate()}`
                  : null}
              </Text>
            </HideableView>

            <Button
              title="Add SubGoal"
              color="maroon"
              onPress={props.handleSubmit}
            />
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: "row",
    // padding: 5,
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
  },
  input: {
    marginTop: 20,
    marginBottom: 20,
  },
  switchcontainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 40,
  },
  switch: {
    marginLeft: 180,
  },
  HideableView: {
    marginTop: 20,
    marginBottom: 20,
  },
  addsubgoalbutton: {
    marginTop: 20,
  },
});

export default SubGoalForm;
