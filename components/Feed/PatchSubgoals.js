import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import {
  getGoalByGoalId,
  patchSubgoalStatusById,
  patchSubgoalbyId,
  patchGoalStatusById,
  patchGoalbyId,
} from "../../utils/api";
import { useNavigation } from "@react-navigation/native";

import PostStatus from "./PostPost";
const PatchS = ({ goal, goalUnit, setFriendPosts, goalPageId }) => {
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
      patchSubgoalbyId(goal.subgoal_id, patchObject)
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
            setCongratsModalVisible(true);
            return patchGoalStatusById(patchedGoal.goal_id, "completed");
          }
          return;
        })
        .then(() => {
          if (goalPageId) {
            navigation.navigate("SetGoal");
            navigation.navigate("GoalPage", { goal_id: goalPageId });
          }
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
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.madeProgress}>Made progress?</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="completed..."
          onChangeText={setProgress}
          value={progress.toString()}
        />
        <Text style={styles.goalUnit}>{goal.unit}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.update} onPress={onSubmit}>
          <Text style={styles.updateText}>Submit privately</Text>
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

export default PatchS;

const styles = StyleSheet.create({
  s: {},
  madeProgress: {
    marginLeft: 5,
    padding: 3,
    fontWeight: "bold",
    color: "white",
  },
  goalUnit: {
    marginLeft: 5,
    padding: 3,
    fontWeight: "bold",
    color: "white",
  },
  update: {
    borderRadius: 8,
    padding: 5,
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5b72a4",
  },
  updateText: {
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    flexDirection: "column",
    marginLeft: 5,
    borderRadius: 10,
    padding: 3,
    width: 50,
  },
});
