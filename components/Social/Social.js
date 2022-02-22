import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { TouchableOpacity } from "react-native";

const Social = (props) => {
  return (
    <View style={styles.goalContainer}>
      <Text style={styles.goalInfo}>{props.text}</Text>
      <Progress.Bar
        style={styles.progress}
        progress={props.progress}
        width={300}
      />
      <View style={styles.interact}>
        <TouchableOpacity>
          <Text style={styles.descrip}>Congratulate</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.update}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.update}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  progress: {
    marginTop: 10,
  },
  interact: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: 15,
  },
  descrip: {
    padding: 4,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  update: {
    padding: 4,

    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Social;
