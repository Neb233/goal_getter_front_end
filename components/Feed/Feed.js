import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import Goals from "../Goals/Goals";
import Social from "../Social/Social";
import Subgoals from "../PatchGoals/Subgoals";
import { TouchableOpacity } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SetGoal from "../Set_Goal/SetGoal";
import Nav from "../Nav/Nav";
import GoalStatus from "../GoalStatus/GoalStatus";


const Feed = ({ navigation }) => {


  return (
    <ScrollView style={styles.container}>
      <Subgoals />
      <View style={styles.personalWrapper}>
        <Text style={styles.sectionTitle}>Goal Status:</Text>

        <View style={styles.status}>
         <GoalStatus />
        </View>
        <View>
          <TouchableOpacity
            style={styles.takeToCalendar}
            onPress={() => navigation.navigate("GoalCalendar")}
          >
            <Text>See Calendar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={styles.friends}>Friends feed</Text>

        <View>
          <Social
            text={"Michael Higgins"}
            upload={"Just smashed out a double marathon"}
          />
          <Social
            text={"Andrew Browne"}
            upload={"Man golf is not going well, but Im trying"}
          />
          <Social text={"Ben Bartram"} upload={"Started making the nav bar!"} />
          <Social text={"Joe Valentine"} upload={"Burritos"} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#abbabe",
  },
  personalWrapper: {
    height: 220,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sectionTitle: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  friends: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 20,
    marginLeft: 10,
  },
  status: {
    height: 100,
    width: "100%",
    backgroundColor: "#4892b7",
    borderRadius: 5,
    marginTop: 5,
  },
  takeToCalendar: {
    height: 50,
    width: "100%",
    backgroundColor: "#587274",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
