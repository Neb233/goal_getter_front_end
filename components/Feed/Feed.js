import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Social from "./Social";
import Subgoals from "./Subgoals";
import { TouchableOpacity, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { auth } from "../../firebase";
import { getFriends, getPostsByUser } from "../../utils/api";

const Feed = ({ navigation }) => {
  const currentUser = auth.currentUser.displayName;

  const [friendPosts, setFriendPosts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
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
    }, [])
  );

  const HeaderComponent = () => {
    return (
      <View>
        <Subgoals setFriendPosts={setFriendPosts} />
        <View>
          <View>
            <TouchableOpacity
              style={styles.takeToCalendar}
              onPress={() => navigation.navigate("Calendar")}
            >
              <Text style={styles.buttonText}>Check out your calendar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.friends}>What have your friends been up to?</Text>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={<HeaderComponent />}
      data={friendPosts}
      renderItem={({ item }) => (
        <Social
          friendPosts={friendPosts}
          postDetails={item}
          currentUser={currentUser}
        />
      )}
    />
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fdf9e6",
  },
  personalWrapper: {
    borderRadius: 10,
  },
  sectionTitle: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  friends: {
    color: "#3e4d6e",
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: "center",
  },
  status: {
    height: 100,
    width: "100%",
    backgroundColor: "#4892b7",
    borderRadius: 5,
    marginTop: 5,
  },
  takeToCalendar: {
    margin: 10,
    padding: 10,
    height: 50,
    backgroundColor: "#5b72a4",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
