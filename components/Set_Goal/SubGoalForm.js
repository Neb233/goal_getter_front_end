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
  TouchableOpacity
} from "react-native";
import { Formik, useField } from "formik";
import * as yup from "yup";
import DatePicker from "../../shared/DatePicker";
import { prodErrorMap } from "firebase/auth";
import { HideableView } from "../../shared/HideableView";

const ReviewSchema = yup.object({
  objective: yup.string().required(),
  start_date: yup.date(),
  end_date: yup.date(),
  target_value: yup.number(),
  unit: yup.string(),
});

const SubGoalForm = ({ addSubGoal, setShowSubGoalDetails }) => {
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
          end_date: "",
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
              {/* <Text>Objective</Text> */}
              <TextInput
                style={styles.objectiveinput}
                multiline
                placeholder="Objective"
                onChangeText={props.handleChange("objective")}
                value={props.values.objective}
              />
            </View>
            <Text style={styles.errorText}>
              {props.touched.objective && props.errors.end_date}
            </Text>


            <DatePicker name="end_date"
            type={"End"} />
            <View style={styles.switchcontainer}>
              <Text style={styles.header}>Set Numerical Values</Text>
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
               <DatePicker name="start_date"
               type={"Start"} />
            <Text style={styles.errorText}>
              {props.touched.start_date && props.errors.start_date}
            </Text>
            <View style={styles.switchcontainer}>
              <Text>Target Value</Text>
              <TextInput
                style={styles.valueinput}
                multiline
                placeholder="Target Value"
                type="number"
                onChangeText={props.handleChange("target_value")}
                value={props.values.target_value}
                keyboardType="numeric"
              />
              </View>
              <View style={styles.switchcontainer}>
              <Text style={styles.leftlabel}>Units</Text>
              <TextInput
                style={styles.valueinput}
                multiline
                placeholder="Units"
                onChangeText={props.handleChange("unit")}
                value={props.values.unit}
              />
              </View>
            </HideableView>

            <TouchableOpacity
             
            style={styles.addsubgoalbutton}
              onPress={props.handleSubmit}
          ><Text style={styles.addsubgoaltext}>Add Subgoal</Text></TouchableOpacity>
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
  header: {
fontWeight: "bold"
  },
  objectiveinput: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
height: 50,
borderRadius:10,
padding: 5
  },
  input: {
    marginTop: 20,
    marginBottom: 20,
padding: 3,
    backgroundColor: "white",
   
  },
  switchcontainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
  switch: {
    marginLeft: 180,
  },
  HideableView: {
    marginTop: 20,
    marginBottom: 20,
  },
  addsubgoalbutton: {
   
    margin: 10,
    padding: 10,
    height: 50,
    // width: "100%",
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
    fontWeight: "bold"
  },
  valueinput: {
    marginTop: 20,
    marginBottom: 20,

    backgroundColor: "white",
    marginLeft: 150
  },
  leftlabel: {
    textAlignVertical:"center"
  }
});

export default SubGoalForm;
