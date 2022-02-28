import {
  StyleSheet,
  Text,
  View,
  Button,
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
import React, { useState } from "react";
import SetGoalGuide from "./SetGoalGuide";
import { Formik } from "formik";
import * as yup from "yup";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { HideableView } from "../../shared/HideableView";
import DatePicker from "../../shared/DatePicker";

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
    <ScrollView>
      <SafeAreaView>
        <Modal visible={modalOpen} animationType="slide">
          <View style={styles.modalContainer}>
            <Button
              title="Close"
              onPress={() => {
                setModalOpen(false);
              }}
            ></Button>
            <SetGoalGuide />
          </View>
        </Modal>

        <Text>Set Goal</Text>
        <View>
          <Text>
            Tell us what you'd like to achieve it by filling out the form below.
          </Text>
          <Text>
            You'll be able to break this task down into smaller sub-goals later
            on. Here, try to think of the bigger picture.
          </Text>
          <Text>
            Good goals should follow the SMART principle. Please make what you
            are aiming for specific and measurable, and set a date you'd like to
            achieve it by.
          </Text>
          <Text>
            You can find some ideas for goals, and get some more info about the
            SMART principle, by pressing the button below.
          </Text>
          <Button
            title="Get More Info"
            onPress={() => {
              setModalOpen(true);
            }}
          ></Button>
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
                : "",
              end_date: route.params
                ? route.params.goalProperties.end_date
                : "",
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
          >
            {(props) => (
              <View>
                <View style={styles.container}>
                  <Text>What is your final objective?</Text>
                  <TextInput
                    style={styles.input}
                    multiline
                    placeholder="Objective"
                    onChangeText={props.handleChange("objective")}
                    value={props.values.objective}
                  />
                  <Text>Enter a description</Text>
                  <TextInput
                    style={styles.input}
                    multiline
                    placeholder="Description"
                    onChangeText={props.handleChange("description")}
                    value={props.values.description}
                  />
                  <Text>
                    When do you plan on starting working towards you goal?
                  </Text>
                  <DatePicker name="start_date" type={"Start"} />
                  <Text>When do you aim to complete your goal by?</Text>
                  <DatePicker name="end_date" type={"End"} />
                  <Text>
                    If your final goal has a numeric target value attached to
                    it, that you plan to contribute to gradually (e.g. saving
                    money, or running a total distance over a long period), then
                    check the box below. This will help us give you a wider
                    range of tools to track and keep on top of your goals, such
                    as graphing progress, and making smaller milestones.
                  </Text>
                  <Switch
                    onValueChange={(isChecked) => {
                      setIsEnabled((previousState) => !previousState);
                      handleCheckboxCheck(isChecked);
                    }}
                    disabled={
                      (props.values.target_value !== "" ||
                        props.values.unit !== "" ||
                        props.values.subgoalPeriod !== "") &&
                      !hideProgressOptions
                    }
                    value={isEnabled}
                  />
                  <HideableView hidden={hideProgressOptions}>
                    <Text>What final value are you aiming for?</Text>
                    <TextInput
                      style={styles.input}
                      multiline
                      placeholder="Target Value"
                      onChangeText={props.handleChange("target_value")}
                      value={props.values.target_value}
                    />
                    <Text>What units are the above values measured in?</Text>
                    <TextInput
                      style={styles.input}
                      multiline
                      placeholder="Units"
                      onChangeText={props.handleChange("unit")}
                      value={props.values.unit}
                    />
                    <Text>
                      We'll break this goal up into subgoals with shorter
                      periods? How many days long would you like these periods
                      to be?
                    </Text>
                    <TextInput
                      style={styles.input}
                      multiline
                      placeholder="Subgoal Period"
                      onChangeText={props.handleChange("subgoalPeriod")}
                      value={props.values.subgoalPeriod}
                    />
                    <Text>days</Text>
                  </HideableView>
                </View>
                <Text style={styles.errorText}>
                  {props.touched.title && props.errors.title}
                </Text>
                <Button
                  title="Add SubGoals"
                  color="maroon"
                  onPress={props.handleSubmit}
                />
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
});

export default SetGoalIntro;
