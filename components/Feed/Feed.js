import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

import Goals from "../Profile/UserPage";
import Social from "./Social";
import Subgoals from "./Subgoals";
import { TouchableOpacity, FlatList } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SetGoal from "../Set_Goal/SetGoal";
import Nav from "../Nav/Nav";
import GoalStatus from "./GoalStatus";

import { getFriends, getPostsByUser } from "../../utils/api";

const Feed = ({ navigation }) => {
  const currentUser = "jeff";

  const [friendPosts, setFriendPosts] = useState([]);

  useEffect(() => {
    getFriends(currentUser)
      .then((friends) => {
        friends.push(currentUser);
        const postPromises = friends.map((friend) => {
          return getPostsByUser(friend);
        });
        return Promise.all(postPromises);
      })
      .then((posts) => {
        let combinedPostArray = [];
        posts.forEach((userPosts) => {
          combinedPostArray = [...combinedPostArray, ...userPosts];
        });
        combinedPostArray.sort((a, b) => {
          return (
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
          );
        });
        setFriendPosts(combinedPostArray);
      });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Subgoals setFriendPosts={setFriendPosts} />
      <View style={styles.personalWrapper}>
        {/* <Text style={styles.sectionTitle}>Goal Status:</Text>
        <View style={styles.status}><GoalStatus /></View> */}

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
          <FlatList
            data={friendPosts}
            renderItem={({ item }) => <Social postDetails={item} />}
          />
        </View>
      </View>
      {/* <Nav /> */}
    </ScrollView>
    
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#abbabe",
  },
  personalWrapper: {
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
