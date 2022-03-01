import {
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  patchSubGoalbyId,
  postStatus,
  patchGoalbyId,
  patchSubgoalStatusById,
  getGoalByGoalId,
  patchGoalStatusById,
  getSubgoalsByGoalId,
} from "../../utils/api";
import { useNavigation } from "@react-navigation/native";

const PostStatus = ({
  goal,
  subgoal,
  ownerP,
  progress,
  goalUnit,
  setFriendPosts,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [congratsModalVisible, setCongratsModalVisible] = useState(false);
  const [goalObjective, setGoalObjective] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    getGoalByGoalId(goal.goal_id).then((supergoal) => {
      setGoalObjective(supergoal.objective);
    });
  }, []);

  const handleSubmit = () => {
    if (
      goal.type === "progress" &&
      !isNaN(parseFloat(progress)) &&
      progress > 0
    ) {
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
        .then((patchedGoal) => {
          return postStatus({
            associated_data_type: "subgoal",
            associated_id: subgoal,
            owner: ownerP,
            datetime: new Date(Date.now()),
            progress_point: goal.progress.length,
            message: message,
          }).then(() => {
            return patchedGoal;
          });
        })
        .then((patchedGoal) => {
          if (!patchedGoal) {
            navigation.navigate("SetGoalIntro");
            navigation.navigate("Feed");
          }
        });
    } else if (goal.type === "boolean") {
      patchSubgoalStatusById(subgoal, "completed")
        .then(() => {
          const subgoalPromise = getSubgoalsByGoalId(goal.goal_id);
          const goalPromise = getGoalByGoalId(goal.goal_id);
          return Promise.all([subgoalPromise, goalPromise]);
        })
        .then(([subgoals, supergoal]) => {
          let allSubgoalsCompleted = true;
          for (const subgoal of subgoals) {
            if (subgoal.status === "active") {
              allSubgoalsCompleted = false;
            }
          }
          if (allSubgoalsCompleted && goal.type === "boolean") {
            console.log("adsadsdasads");
            setCongratsModalVisible(true);
            return patchGoalStatusById(supergoal.goal_id, "completed");
          }
          return null;
        })
        .then((patchedGoal) => {
          return postStatus({
            associated_data_type: "subgoal",
            associated_id: subgoal,
            owner: ownerP,
            datetime: new Date(Date.now()),
            message: message,
          }).then(() => {
            return patchedGoal;
          });
        })
        .then((patchedGoal) => {
          if (!patchedGoal) {
            navigation.navigate("SetGoalIntro");
            navigation.navigate("Feed");
          }
        });
    }
    setModalVisible(!modalVisible);
  };

  const handleCongratsMessageSubmit = () => {
    navigation.navigate("SetGoalIntro");
    setCongratsModalVisible(!congratsModalVisible);
    navigation.navigate("Feed");
  };

  //   ${ownerP} completed ${progress} ${goalUnit} of ${subgoal.objective}  ${message}`

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.modalText}
              placeholder="enter your message here"
              value={message}
              onChangeText={setMessage}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleSubmit}
            >
              <Text style={styles.textStyle}>Make Status</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancel Post</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>
          Submit progress and share it with your friends
        </Text>
      </Pressable>
    </View>
  );
};

export default PostStatus;

const styles = StyleSheet.create({
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
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "wrap",
    width: 150,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    backgroundColor: '#f7f7fa',
    color: 'white',
    borderRadius: 20,
    padding: 5,
    width: '150%'
  },
});
