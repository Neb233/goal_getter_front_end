import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { getSubgoalsByGoalId } from "../utils/api";
const ProgressBar = ({ progress, target_value, subgoals }) => {
  console.log(progress, target_value, subgoals);
  if (target_value) {
    const progressRatio = Math.min(
      1,
      (progress.length === 0 ? 0 : progress[progress.length - 1][1]) /
        target_value
    );
    return (
      <View style={styles.progress}>
        <Progress.Bar
          style={styles.flex}
          progress={progressRatio}
          width={300}
          height={15}
        />
        <Text style={styles.flex}>{Math.round(progressRatio * 100)}%</Text>
      </View>
    );
  } else {
    const completedSubgoals = subgoals.filter((subgoal) => {
      return subgoal.status === "completed";
    });
    const progressRatio =
      subgoals.length === 0 ? 1 : completedSubgoals.length / subgoals.length;
    return (
      <View style={styles.progress}>
        <Progress.Bar
          style={styles.flex}
          progress={progressRatio}
          width={300}
          height={15}
        />
        <Text style={styles.flex}>{Math.round(progressRatio * 100)}%</Text>
      </View>
    );
  }
};
export default ProgressBar;

const styles = StyleSheet.create({
  progress: { flexDirection: "row", justifyContent: "space-evenly" },
});
