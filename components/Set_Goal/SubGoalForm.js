import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import DatePicker from "../../shared/DatePicker";
import { HideableView } from "../../shared/HideableView";
import dateFormat from "dateformat";

const SubGoalForm = ({
  addSubGoal,
  setShowSubGoalDetails,
  goalStartDate,
  goalEndDate,
}) => {
  const [hideProgressOptions, setHideProgressOptions] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    isEnabled ? setHideProgressOptions(true) : setHideProgressOptions(false);
  };

  const ReviewSchema = yup.object({
    objective: yup.string().required("Objective is a required field"),
    start_date: yup
      .date()
      .min(
        goalStartDate,
        "Subgoal start date can't be earlier than goal start date"
      )
      .max(goalEndDate, "Subgoal start date can't be later than goal end date"),
    end_date: yup
      .date()
      .max(goalEndDate, "Subgoal end date can't be later than goal end date")
      .min(
        goalStartDate,
        "Subgoal end date can't be earlier than goal start date"
      )
      .required("Please select an end date for this subgoal"),
    target_value: yup.number(),
    unit: yup.string(),
  });

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
              <Text style={styles.header}>Set Subgoal</Text>
              <Text style={styles.text_footer}>Objective</Text>

              <TextInput
                style={styles.textInput}
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
              {props.touched.objective && props.errors.objective}
            </Text>
            <View style={styles.switchcontainer}>
              <DatePicker
                name="end_date"
                type={"End"}
                style={styles.datepicker}
              />

              <Text style={styles.text_footer}>
                {dateFormat(props.values.end_date, "dd/mm/yyyy")}
              </Text>
            </View>
            <Text style={styles.errorText}>
              {props.touched.end_date && props.errors.end_date}
            </Text>
            <View style={styles.goalContainer}>
              <Text style={styles.text_footer_small}>
                If this subgoal has a numerical target value associated with it,
                let us know and we'll help you track your progress.
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#3e4d6e" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={styles.switch}
              />
            </View>

            <HideableView
              hidden={hideProgressOptions}
              style={styles.HideableView}
            >
              <View style={styles.switchcontainer}>
                <DatePicker
                  name="start_date"
                  type={"Start"}
                  style={styles.datepicker}
                />
                <Text style={styles.text_footer}>
                  {dateFormat(props.values.start_date, "dd/mm/yyyy")}
                </Text>
              </View>

              <Text style={styles.errorText}>
                {props.touched.start_date && props.errors.start_date}
              </Text>
              <Text style={styles.text_footer}>Target Value</Text>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Target Value"
                type="number"
                onChangeText={props.handleChange("target_value")}
                value={props.values.target_value}
                keyboardType="numeric"
              />
              <Text style={styles.text_footer}>Units</Text>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Units"
                onChangeText={props.handleChange("unit")}
                value={props.values.unit}
                autoCapitalize="none"
              />
            </HideableView>

            <TouchableOpacity
              style={styles.addsubgoalbutton}
              onPress={props.handleSubmit}
            >
              <Text style={styles.addsubgoaltext}>Add Subgoal</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
  },
  header: {
    textAlignVertical: "center",
    fontWeight: "bold",
  },
  objectiveinput: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    height: 50,
    borderRadius: 10,
    padding: 5,
  },
  input: {
    marginTop: 20,
    marginBottom: 20,
    padding: 3,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
  },
  switchcontainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 5,
  },
  switch: {
    marginLeft: 180,
    transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }],
    marginRight: 25,
  },
  HideableView: {
    marginTop: 20,
    marginBottom: 20,
  },
  addsubgoalbutton: {
    margin: 10,
    padding: 10,
    height: 50,
    backgroundColor: "green",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,

    elevation: 5,
  },
  addsubgoaltext: {
    color: "white",
    fontWeight: "bold",
  },
  valueinput: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
    borderRadius: 3,
  },
  leftlabel: {
    textAlignVertical: "center",
  },
  text_footer: {
    color: "#05375a",
    fontSize: 17,
  },
  text_footer_small: {
    color: "#05375a",
    fontSize: 15,
    marginBottom: 15,
  },
  textInput: {
    padding: 5,
    color: "black",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
    marginBottom: 15,
    marginTop: 5,
    paddingLeft: 10,
  },
  header: {
    color: "#3e4d6e",
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: "center",
    marginTop: 0,
  },
  goalContainer: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    marginTop: 5,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    marginBottom: 20,
    elevation: 5,
    alignItems: "flex-end",
  },
  switchcontainer: {
    marginTop: 0,
    marginBottom: 20,
    justifyContent: "center",
    backgroundColor: "white",
    padding: 5,
    paddingBottom: 15,
    textAlign: "center",
    borderRadius: 5,
    paddingBottom: 20,
    alignItems: "center",
  },
});

export default SubGoalForm;
