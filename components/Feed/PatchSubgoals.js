import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  getGoalByGoalId,
  patchSubgoalStatusById,
  patchSubGoalbyId,
  patchGoalStatusById,
  patchGoalbyId,
} from "../../utils/api";
import { useNavigation } from "@react-navigation/native";

import PostStatus from "./PostStatus";
const PatchSubGoal = ({ goal, goals, goalUnit, setFriendPosts }) => {
  const [progress, setProgress] = useState(0);
  const [congratsModalVisible, setCongratsModalVisible] = useState(false);
  const [goalObjective, setGoalObjective] = useState("");

  const navigation = useNavigation();

  const submitTime = new Date(Date.now());

  const submitDate = new Date(
    submitTime.getFullYear(),
    submitTime.getMonth(),
    submitTime.getDate()
  );

  let patchObject = {
    date: submitDate,
    value: 0,
  };

  useEffect(() => {
    patchObject = {
      date: submitDate,
      value: parseFloat(progress),
    };
    getGoalByGoalId(goal.goal_id).then((supergoal) => {
      setGoalObjective(supergoal.objective);
    });
  }, [progress]);

  const onSubmit = () => {
    if (!isNaN(parseFloat(progress)) && progress > 0) {
      const patchObject = {
        date: new Date(
          new Date(Date.now()).getFullYear(),
          new Date(Date.now()).getMonth(),
          new Date(Date.now()).getDate()
        ),
        value: parseFloat(progress),
      };
      patchSubGoalbyId(goal.subgoal_id, patchObject)
        .then((subgoal) => {
          if (
            subgoal.progress[subgoal.progress.length - 1][1] >=
              subgoal.target_value &&
            subgoal.status === "active"
          ) {
            return patchSubgoalStatusById(subgoal.subgoal_id, "completed");
          }
          return;
        })
        .then(() => {
          return getGoalByGoalId(goal.goal_id);
        })
        .then((supergoal) => {
          if (supergoal.type === "progress" && goal.unit === supergoal.unit) {
            return patchGoalbyId(goal.goal_id, patchObject);
          }
          return;
        })
        .then((patchedGoal) => {
          setProgress("");
          if (
            patchedGoal &&
            patchedGoal.progress[patchedGoal.progress.length - 1][1] >=
              patchedGoal.target_value &&
            patchedGoal.status === "active"
          ) {
            console.log("hello");
            setCongratsModalVisible(true);
            return patchGoalStatusById(patchedGoal.goal_id, "completed");
          }
          return;
        });
    }
  };

  const handleCongratsMessageSubmit = () => {
    setCongratsModalVisible(!congratsModalVisible);
  };

  return (
    <View>
      <Modal
        animaitonType="slide"
        transparent={true}
        visible={congratsModalVisible}
        onRequestClose={() => {
          setCongratsModalVisible(!congratsModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>
              Congratulations! You completed your goal "{goalObjective}"!
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleCongratsMessageSubmit}
            >
              <Text style={styles.textStyle}>Great News!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="completed..."
          onChangeText={setProgress}
          value={progress.toString()}
        />
      </View>
      <View>
        <TouchableOpacity style={styles.update} onPress={onSubmit}>
          <Text style={styles.updateText}>Submit progress</Text>
        </TouchableOpacity>

        <PostStatus
          goal={goal}
          progress={progress}
          subgoal={goal.subgoal_id}
          ownerP={goal.owner}
          goalUnit={goalUnit}
          setFriendPosts={setFriendPosts}
        />
      </View>
    </View>
  );
};

export default PatchSubGoal;

const styles = StyleSheet.create({
  subGoal: {
    height: 200,
    maxWidth: 400,
    minWidth: 330,
    marginLeft: 10,
    marginRight: 5,
    backgroundColor: "#abbabe",
    borderRadius: 5,
  },
  // page: {
  //     height: 170,
  //     width: 200,
  //     margin: 10
  // },
  update: {
    backgroundColor: "#4892b7",
    borderRadius: 8,
    padding: 5,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  updateText: {
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  pageContent: {
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  goalObj: {
    flexDirection: "column",
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  goalDescription: {
    flexDirection: "column",
    padding: 10,
    fontSize: 24,
    color: "white",
  },

  updateText: {
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  progress: {
    flexDirection: "row",
    margin: 20,
  },
  input: {
    backgroundColor: "white",
    flexDirection: "column",
    marginLeft: 5,
    borderRadius: 10,
    padding: 3,
  },
  unit: {
    marginLeft: 5,
    padding: 3,
    fontWeight: "bold",
    color: "green",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    margin: 40,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 70,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    margin: 5,
  },
});
