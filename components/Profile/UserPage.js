import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { getGoalsByUser, getPostsByUser, getUser } from "../../utils/api";
import dateFormat, { masks } from "dateformat";
import Social from "../Feed/Social";

const Goals = ({ navigation, route }) => {
  const [goals, setGoals] = useState([]);
  const [userDetails, setUserDetails] = useState({ username: "", profile: "" });
  const [userPosts, setUserPosts] = useState([]);
  const [showGoals, setShowGoals] = useState(false);
  const { user } = route.params;

  useEffect(() => {
    getGoalsByUser(user).then((goals) => {
      goals.filter((goal) => {
        return (
          new Date(goal.end_date).getTime() > Date.now() &&
          new Date(goal.start_date).getTime() < Date.now()
        );
      });
      setGoals(goals);
    });
    getPostsByUser(user).then((posts) => {
      setUserPosts(posts);
    });
    getUser(user).then((userDetails) => {
      setUserDetails(userDetails[0]);
    });
  }, [user]);

  return (
    <ScrollView>
      <View style={styles.header}>
        <Image source={""} style={styles.profPic} />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.userName}>{user}</Text>
            <Text>{userDetails.profile}</Text>
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShowGoals((oldShowGoals) => {
              return !oldShowGoals;
            });
          }}
        >
          <Text>{showGoals ? "Show Social Feed" : "Show Goals"}</Text>
        </TouchableOpacity>
      </View>
      {showGoals ? (
        <View style={styles.goalContainer}>
          <Text style={styles.currentgoals}>Current Goals:</Text>
          <FlatList
            data={goals}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity onPress={navigation.navigate}>
                  <View>
                    <Text style={styles.title}>{item.objective}</Text>
                  </View>
                  <View>
                    <Text style={styles.duedate}>
                      End date:{" "}
                      {dateFormat(item.end_date, "dddd, mmmm dS, yyyy")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ) : (
        <View>
          <FlatList
            data={userPosts}
            renderItem={({ item }) => <Social postDetails={item} />}
          />
        </View>
      )}
    </ScrollView>
  );
};
export default Goals;

const styles = StyleSheet.create({
  goalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    backgroundColor: "#abbabe",
    borderRadius: 5,
    flex: 1,
    margin: 2,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    color: "white",
    marginTop: 15,
    margin: 5,
  },
  duedate: {
    color: "white",
    marginLeft: 130,
    marginRight: 5,
    marginBottom: 2,
  },
  currentgoals: {
    fontWeight: "bold",
    margin: 5,
  },
  header: {
    backgroundColor: "#5df542",
    height: 100,
  },
  profPic: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 30,
  },
  userName: {
    fontSize: 22,
    color: "#fc03ba",
    fontWeight: "600",
    marginBottom: 40,
  },
  body: {
    marginTop: 150,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "90%",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
    marginTop: 200,
  },
});
