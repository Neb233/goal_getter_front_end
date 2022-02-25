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
import { postStatus } from "../../utils/api";

const PostStatus = ({ goal, subgoal, ownerP, progress, goalUnit }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('')



  

  const handleSubmit =  () => {
      postStatus({
        associated_data_type: "subgoal",
        associated_id: subgoal,
        owner: ownerP,
        datetime: new Date(Date.now()),
        message: ` ${ownerP} completed ${progress} ${goalUnit} of his goal: ${goal.objective} 
        
        ${message}`
   })
   
   .then((res) => {
          console.log(res)
      })

      setModalVisible(!modalVisible)
      
  }

 



//   ${ownerP} completed ${progress} ${goalUnit} of ${subgoal.objective}  ${message}`

  

  return (
    <View style={styles.centeredView}>
      <Modal
        animaitonType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed");
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

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Submit Progress & Post Status</Text>
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
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
