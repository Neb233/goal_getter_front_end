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
} from "react-native";
import React, { useState } from "react";
import SetGoalGuide from "./SetGoalGuide";
import { Formik } from "formik";
import * as yup from "yup";

const ReviewSchema = yup.object({
  objective: yup.string().required(),
});

const SetGoalIntro = ({ navigation, setConstructedGoal }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
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
          Good goals should follow the SMART principle. Please make what you are
          aiming for specific and measurable, and set a date you'd like to
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
            objective: "",
            description: "",
            start_date: "",
            end_date: "",
            target_value: "",
            unit: "",
          }}
          onSubmit={(values) => {
            setConstructedGoal(values);
            navigation.navigate("SetGoal");
          }}
          validationSchema={ReviewSchema}
        >
          {(props) => (
            <View>
              <View style={styles.container}>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Objective"
                  onChangeText={props.handleChange("objective")}
                  value={props.values.objective}
                />
              </View>
              <Text style={styles.errorText}>
                {props.touched.title && props.errors.title}
              </Text>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
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
