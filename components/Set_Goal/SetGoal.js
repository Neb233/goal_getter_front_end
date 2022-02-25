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
import SubGoalDetails from "./SubGoalDetails";





const SetGoal = ({ navigation }) => {

  const [addSubGoalModalOpen, setAddSubGoalModalOpen] = useState(false);
  const [subGoalDetailModalOpen, setSubGoalDetailModalOpen] = useState(false)
  const [subGoals, setSubGoals] = useState([
    {
      "subgoal_id": 5,
      "goal_id": 2,
      "objective": "Finish Act 1 of novella",
      "start_date": null,
      "end_date": "2022-02-11T00:00:00.000Z",
      "type": "boolean",
      "status": "completed",
      "owner": "jeff",
      "target_value": null,
      "unit": null,
      "progress": null,
      "finish_date": "2022-02-10T00:00:00.000Z"
    },
    {
      "subgoal_id": 6,
      "goal_id": 2,
      "objective": "Finish Act 2 of novella",
      "start_date": null,
      "end_date": "2022-02-21T00:00:00.000Z",
      "type": "boolean",
      "status": "active",
      "owner": "jeff",
      "target_value": null,
      "unit": null,
      "progress": null,
      "finish_date": null
    },
    {
      "subgoal_id": 7,
      "goal_id": 2,
      "objective": "Finish Act 3 of novella",
      "start_date": null,
      "end_date": "2022-03-01T00:00:00.000Z",
      "type": "boolean",
      "status": "active",
      "owner": "jeff",
      "target_value": null,
      "unit": null,
      "progress": null,
      "finish_date": null
    },
    {
      "subgoal_id": 8,
      "goal_id": 2,
      "objective": "Proof-read novella",
      "start_date": null,
      "end_date": "2022-03-04T00:00:00.000Z",
      "type": "boolean",
      "status": "active",
      "owner": "jeff",
      "target_value": null,
      "unit": null,
      "progress": null,
      "finish_date": null
    }
  ]);

  const addSubGoal = (subGoal) => {
    setSubGoals((currentSubGoals) => {
      return [...currentSubGoals, subGoal];
    });
    setAddSubGoalModalOpen(false);
  };



  return (
    <SafeAreaView>
      <Modal visible={addSubGoalModalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Button
          title="Close"
            onPress={() => {
              setAddSubGoalModalOpen(false);
            }}
          >
          
          </Button>
          <SubGoalForm addSubGoal={addSubGoal} />
        </View>
      </Modal>

     
      <Text>Subgoals:</Text>
      <View>
      <FlatList
        data={subGoals}
        renderItem={({ item }) => (
          
          <TouchableOpacity onPress={() => {setSubGoalDetailModalOpen(true)}}>
            <Modal visible={subGoalDetailModalOpen} animationType="fade">
              <View>
                
              <Button
          title="Close"
            onPress={() => {
              setSubGoalDetailModalOpen(false);
            }}
          ></Button>
         <SubGoalDetails 
         setSubGoals={setSubGoals}
         setSubGoalDetailModalOpen={setSubGoalDetailModalOpen}
         subGoals={subGoals}
         item={item}/>
          </View>
          </Modal>
            <Card>
              <Text style={styles.text}>{item.objective}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
      </View>
      <View>
      <Button
      title="Add SubGoal"
        onPress={() => {
          setAddSubGoalModalOpen(true);
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
    padding: 10
  },
  text: {
    fontWeight: "bold"
  }
});

export default SetGoal;
