import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { getSubgoalsByGoalId } from "../utils/api";
const ProgressBar = ({ progress, target_value, subgoals, color }) => {
  console.log(progress);
  if (target_value) {
    const progressRatio = Math.min(
      1,
      (!progress[0] ? 0 : progress[progress.length - 1][1]) / target_value
    );
    return (
      <View style={{ flexDirection: "row", marginTop: 15 }}>
        <Progress.Bar
          style={styles.flex}
          progress={progressRatio}
          width={250}
          height={20}
          color={color}
        />
        <Text style={{ color: color, marginLeft: 10 }}>
          {Math.round(progressRatio * 100)}%
        </Text>
      </View>
    );
  } else {
    const completedSubgoals = subgoals.filter((subgoal) => {
      return subgoal.status === "completed";
    });
    const progressRatio =
      subgoals.length === 0 ? 1 : completedSubgoals.length / subgoals.length;
    return (
      <View style={{ flexDirection: "row", marginTop: 15 }}>
        <Progress.Bar
          style={styles.flex}
          progress={progressRatio}
          width={250}
          height={20}
          color={color}
        />
        <Text style={{ color: color, marginLeft: 10 }}>
          {Math.round(progressRatio * 100)}%
        </Text>
      </View>
    );
  }
};
export default ProgressBar;

const styles = StyleSheet.create({
  progress: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 4,
  },
});
