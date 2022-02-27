import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { TouchableOpacity } from "react-native";

import { useState } from "react";
import { KeyboardAvoidingView } from "react-native";

const Social = (props) => {
  const [isShowing, setIsShowing] = useState(false);
  const [comments, setComments] = useState([]);

  const handleCommentClick = () => {
    setIsShowing((currValue) => {
      return !currValue;
    });
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.goalContainer}>
        <View style={styles.userInfo}>
          <View style={styles.profilePic} />
          <Text style={styles.goalInfo}>{props.text}</Text>
        </View>
        <View style={styles.post}>
          <Text>"{props.upload}"</Text>
        </View>
        <View style={styles.interact}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.congratulate}>Congratulate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.comButton}
            onPress={() => {
              handleCommentClick();
            }}
          >
            <Text style={styles.comment}>Comment</Text>
          </TouchableOpacity>
        </View>

        <View>
          {isShowing ? (
            <TextInput
              style={styles.input}
              placeholder="leave a positive comment"
              onChangeText={(comment) => setComments(comment)}
              defaultValue={comments}
            />
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#00ffdd",
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 10,
  },
  goalContainer: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,

    elevation: 5,
  },
  goalInfo: {
    color: "black",
    marginBottom: 15,
    fontWeight: "bold",
    margin: 10,
  },
  progress: {
    marginTop: 10,
  },
  interact: {
    flexDirection: "row",
    borderRadius: 10,
  },
  profilePic: {
    height: 40,
    width: 40,
    backgroundColor: "grey",
    borderRadius: 50,
  },
  userInfo: {
    flexDirection: "row",
  },
  post: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  congratulate: {
    color: "white",
    padding: 2,
  },
  button: {
    backgroundColor: "#468705",
    borderRadius: 8,
    marginTop: 20,
  },
  comButton: {
    backgroundColor: "#4892b7",
    borderRadius: 8,
    marginTop: 20,
    marginLeft: 10,
    padding: 2,
  },
  comment: {
    color: "white",
  },
  input: {
    padding: 7,
    marginTop: 15,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 50,
  },
});

export default Social;
