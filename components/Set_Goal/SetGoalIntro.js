import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  Pressable,
  TouchableWithoutFeedBack,
  Keyboard,
  ScrollView,
  Switch,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import React, { useState } from "react";
import SetGoalGuide from "./SetGoalGuide";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { HideableView } from "../../shared/HideableView";
import DatePicker from "../../shared/DatePicker";
import dateFormat from "dateformat";

const GoalSchema = yup.object({
  objective: yup.string().required(),
  description: yup.string(),
  target_value: yup.number().moreThan(0),
  unit: yup.string(),
  subgoalPeriod: yup.number().moreThan(0),
});

const SetGoalIntro = ({ navigation, route }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [clickCounter, setClickCounter] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [hideProgressOptions, setHideProgressOptions] = useState(!isEnabled);

  const handleCheckboxCheck = (isChecked) => {
    setHideProgressOptions(!isChecked);
  };

  if (route.params) {
    console.log(route.params.goalProperties.target_value);
  }
  return (
    <ScrollView style={styles.page}>
      <SafeAreaView>
        <Modal visible={modalOpen} animationType="slide" style={styles.page}>
          <View style={styles.page}>
            <IconButton
              icon="close"
              color="black"
              size={20}
              onPress={() => {
                setModalOpen(false);
              }}
            ></IconButton>
            <SetGoalGuide />
          </View>
        </Modal>
        <View>
          <View style={[styles.goalContainer, { margin: 15 }]}>
            <Text style={styles.text_footer_small}>
              Tell us what you'd like to achieve it by filling out the form
              below.
            </Text>
            <Text style={styles.text_footer_small}>
              You'll be able to break this task down into smaller subgoals later
              on. Here, try to think of the bigger picture.
            </Text>
            <Text style={styles.text_footer_small}>
              Good goals should follow the SMART principle: they should be
              specific, measurable, achievable, relevant, and time-restricted.
            </Text>
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              setModalOpen(true);
            }}
            style={[styles.addgoalbutton, { marginTop: 15 }]}
          >
            <Text style={styles.buttontext}>Get More Info</Text>
          </TouchableOpacity> */}
          <Formik
            initialValues={{
              objective: route.params
                ? route.params.goalProperties.objective
                : "",
              description: route.params
                ? route.params.goalProperties.description
                : "",
              target_value: "",
              unit: "",
              start_date: route.params
                ? route.params.goalProperties.start_date
                : new Date(
                    new Date(Date.now()).getFullYear(),
                    new Date(Date.now()).getMonth(),
                    new Date(Date.now()).getDate()
                  ),
              end_date: route.params
                ? route.params.goalProperties.end_date
                : new Date(
                    new Date(Date.now()).getFullYear(),
                    new Date(Date.now()).getMonth() + 1,
                    new Date(Date.now()).getDate()
                  ),
              subgoalPeriod: "",
            }}
            onSubmit={(values) => {
              console.log(values.target_value);
              console.warn(values);
              // values.start_date = new Date(2022, 0, 1);
              // values.end_date = new Date(2022, 11, 31);
              // const goalProperties = { ...values };
              // goalProperties.subgoals = [];
              // if (route.params && route.params.subgoals) {
              //   goalProperties.subgoals = route.params.subgoals;
              // }
              setClickCounter((oldClickCounter) => {
                return oldClickCounter + 1;
              });
              navigation.navigate("SetGoal", {
                goalProperties: values,
                clickCounter,
              });
            }}
            validationSchema={GoalSchema}
            validateOnChange={true}
          >
            {(props) => (
              <View>
                <View style={styles.container}>
                  <Text style={[styles.text_footer, { marginTop: 15 }]}>
                    What is your final objective?
                  </Text>
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
                      return (
                        <Text style={styles.error}>Objective is required</Text>
                      );
                    }}
                  </ErrorMessage>
                  <Text style={styles.text_footer}>Enter a description</Text>
                  <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Description"
                    onChangeText={props.handleChange("description")}
                    value={props.values.description}
                  />
                  <Text style={styles.text_footer}>
                    When do you plan on starting working towards you goal?
                  </Text>
                  <View style={styles.switchcontainer}>
                    <DatePicker
                      color="#5b72a4"
                      name="start_date"
                      type={"Start"}
                      value={props.values.end_date}
                      style={styles.addgoalbutton}
                    />
                    <Text style={styles.text_footer}>
                      {dateFormat(props.values.start_date, "dd/mm/yyyy")}
                    </Text>
                  </View>
                  <Text style={styles.text_footer}>
                    When do you aim to complete your goal by?
                  </Text>
                  <View style={styles.switchcontainer}>
                    <DatePicker
                      name="end_date"
                      type={"End"}
                      value={props.values.start_date}
                      style={styles.addgoalbutton}
                    />
                    <Text style={styles.text_footer}>
                      {dateFormat(props.values.end_date, "dd/mm/yyyy")}
                    </Text>
                  </View>
                  <View style={styles.goalContainer}>
                    <Text style={styles.text_footer_small}>
                      If your final goal has a numeric target value attached to
                      it, that you plan to contribute to gradually (e.g. saving
                      money, or running a total distance over a long period),
                      then flick the switch below. This will help us give you a
                      wider range of tools to track and keep on top of your
                      goals, such as progress bars to see progress, and making
                      smaller milestones.
                    </Text>

                    <Switch
                      onValueChange={(isChecked) => {
                        setIsEnabled((previousState) => !previousState);
                        handleCheckboxCheck(isChecked);
                      }}
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={isEnabled ? "#3e4d6e" : "#f4f3f4"}
                      disabled={
                        (props.values.target_value !== "" ||
                          props.values.unit !== "" ||
                          props.values.subgoalPeriod !== "") &&
                        !hideProgressOptions
                      }
                      value={isEnabled}
                      style={{ marginBottom: 15, marginRight: 15 }}
                    />
                  </View>
                  <HideableView hidden={hideProgressOptions}>
                    <Text style={styles.text_footer}>
                      What final value are you aiming for?
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      multiline
                      placeholder="Target Value"
                      onChangeText={props.handleChange("target_value")}
                      value={props.values.target_value}
                      keyboardType="numeric"
                      name="target_value"
                    />
                    <ErrorMessage name="target_value">
                      {() => {
                        return (
                          <Text style={styles.error}>
                            Target value must be a number
                          </Text>
                        );
                      }}
                    </ErrorMessage>
                    <Text style={styles.text_footer}>
                      What units are the above values measured in?
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      multiline
                      placeholder="Units"
                      onChangeText={props.handleChange("unit")}
                      value={props.values.unit}
                      autoCapitalize="none"
                    />
                    <Text style={styles.text_footer}>
                      We'll break this goal up into subgoals with shorter
                      periods? How many days long would you like these periods
                      to be?
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TextInput
                        style={[
                          styles.textInput,
                          { width: "40%", marginTop: 15 },
                        ]}
                        multiline
                        placeholder="Subgoal Period"
                        onChangeText={props.handleChange("subgoalPeriod")}
                        value={props.values.subgoalPeriod}
                        keyboardType="numeric"
                        name="subgoalPeriod"
                      />
                      <Text style={[styles.text_footer, { marginLeft: 15 }]}>
                        days
                      </Text>
                    </View>
                    <ErrorMessage name="subgoalPeriod">
                      {() => {
                        return (
                          <Text style={styles.error}>
                            Subgoal period must be a number
                          </Text>
                        );
                      }}
                    </ErrorMessage>
                  </HideableView>
                </View>
                <TouchableOpacity
                  title="Add SubGoals"
                  onPress={props.handleSubmit}
                  style={styles.addgoalbutton}
                >
                  <Text style={styles.buttontext}>Add Subgoals</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
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
  page: {
    backgroundColor: "#FDF9E6",
  },

  container: {
    marginLeft: 20,
    marginRight: 20,
  },
  addgoalbutton: {
    margin: 10,
    padding: 10,
    height: 50,
    // width: "100%",
    backgroundColor: "#5b72a4",
    marginTop: 10,
    marginBottom: 20,
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
    fontFamily: "Helvetica",
    elevation: 5,
  },
  buttontext: {
    color: "white",
    fontWeight: "bold",
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
  },
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
  },
  goalContainer: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    marginTop: 5,
    paddingBottom: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    marginBottom: 20,
    elevation: 5,
  },
  switchcontainer: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    backgroundColor: "white",
    padding: 5,
    textAlign: "center",
    borderRadius: 5,
    alignItems: "center",
    paddingBottom: 15,
  },
  error: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default SetGoalIntro;
