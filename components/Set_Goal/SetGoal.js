import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedBack,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import Card from "../../shared/card";
import SubGoalForm from "./SubGoalForm";





const SetGoal = ({ navigation }) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [subGoals, setSubGoals] = useState([
    {
      title: "Learn F Major Chord",
      objective: "Learn where to put fingers on fretbaord",
      start_date: "12/04/2022",
      end_date: "13/04/2022",
      type: "music",
      status: "in progress",
      owner: "Bob",
    },
    {
      title: "Learn C Major",
      objective:
        "Learn where to put fingers on fretboard + transition from F to C",
      start_date: "12/04/2022",
      end_date: "13/04/2022",
      type: "music",
      status: "in progress",
      owner: "Bob",
    },
  ]);

  const addSubGoal = (subGoal) => {
    setSubGoals((currentSubGoals) => {
      return [...currentSubGoals, subGoal];
    });
    setModalOpen(false);
  };



  return (
    <SafeAreaView>
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Button
          title="Close"
            onPress={() => {
              setModalOpen(false);
            }}
          >
          <SubGoalForm addSubGoal={addSubGoal} />
        </View>
      </Modal>

     
      <Text>Subgoals:</Text>
      <View>
      <FlatList
        data={subGoals}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("SubGoalDetails", item)}>
            <Card>
              <Text>{item.title}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
      </View>
      <View>
      <Button
      title="Add SubGoal"
        onPress={() => {
          setModalOpen(true);
        }}
        
      >
     

      </Button>
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

export default SetGoal;
