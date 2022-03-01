import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Searchbar, List, Button } from "react-native-paper";
import {
  searchUsers,
  addFriend,
  getFriends,
  deleteFriendship,
} from "../../utils/api";

const SearchUsers = () => {
  const [queryState, setQueryState] = useState({
    query: "",
  });
  const [resultState, setResultState] = useState([]);

  const [friends, setFriends] = useState([]);
  const [isFriend, setIsFriend] = useState([]);

  const navigation = useNavigation();

  //RUN WHEN PAGE IS FIRST LOADED
  useEffect(() => {
    return getFriends("jeff").then((friendsRes) => {
      setFriends(friendsRes);
    });
  }, []);

  //RUN WHEN SEARCH IS CHANGED
  useEffect(() => {
    return searchUsers(queryState.query).then((results) => {
      setResultState(results);
    });
  }, [queryState]);

  //RUN WHEN FRIENDS CHANGE
  useEffect(() => {
    return getFriends("jeff").then((friendsRes) => {
      setFriends(friendsRes);
    });
    console.log(friendsRes);
  }, [friends]);

  const addFriendClick = (userToAdd) => {
    /*WIP-ONCE CONTEXT IS INCORPORATED CHANGE MARTINA 
    return addFriend("loggedInUser", "usertoadd").catch((err) => {
          */
    return addFriend("jeff", userToAdd)
      .then((res) => {
        console.log(`${UserToAdd} Added`);
      })
      .catch((err) => {
        return getFriends("jeff").then((friends) => {
          if (friends.indexOf(!userToAdd === -1)) {
            return Alert.alert("Error", "Already friends", [
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ]);
          } else {
            return Alert.alert("Error", "Something went wrong", [
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ]);
          }
        });
      });
  };

  const removeFriendClick = (userToRemove) => {
    /*WIP-ONCE CONTEXT IS INCORPORATED CHANGE MARTINA 
    return RemoveFriend("loggedInUser", "usertoRemove").catch((err) => {
          */
    return deleteFriendship("jeff", userToRemove)
      .then(() => {
        console.log("friend removed");
        const ind = friends.indexOf(userToRemove);
        const newFriends = [...friends].splice(ind, 1);
        setFriends(newFriends);
        return Alert.alert("Friend removed", "Friend remove", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <KeyboardAvoidingView>
      <View>
        <Searchbar
          placeholder="Search"
          onChangeText={(query) => {
            setQueryState({ query: query });
          }}
          value={queryState.query}
        />
      </View>

      <List.Section style={styles.list}>
        <List.Subheader>Results</List.Subheader>

        {resultState ? (
          resultState.map((item, index) => {
            if (!isFriend[index]) {
              return (
                <View style={styles.viewStyle}>
                  <List.Item
                    style={styles.listItem}
                    key={item.username}
                    title={item.username}
                    onPress={() => {
                      navigation.navigate("UserPage", item.username);
                    }}
                    left={(props) => <List.Icon {...props} icon="account" />}
                  />

                  <Button
                    style={styles.button}
                    mode="contained"
                    color="green"
                    onPress={() => {
                      setFriends((oldFriends) => {
                        const newFriends = [...oldFriends];
                        newFriends[index] = true;
                        return newFriends;
                      });
                      addFriendClick(item.username);
                    }}
                  >
                    Add Friend
                  </Button>
                </View>
              );
            } else {
              return (
                <>
                  <List.Item
                    style={styles.listItem}
                    key={item.username}
                    title={item.username}
                    left={(props) => <List.Icon {...props} icon="account" />}
                    onPress={() => {
                      navigation.navigate("UserPage", item.username);
                    }}
                  />

                  <Button
                    mode="contained"
                    color="red"
                    onPress={() => {
                      setFriends((oldFriends) => {
                        const newFriends = [...oldFriends];
                        newFriends[index] = false;
                        return newFriends;
                      });
                      removeFriendClick(item.username);
                    }}
                    style={styles.button}
                  >
                    Remove Friend
                  </Button>
                </>
              );
            }
          })
        ) : (
          <Text>""</Text>
        )}
      </List.Section>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // list: {
  // //   flex: 1,
  // //   // flexDirection: "column",
  // // },
  // viewStyle: { flex: 1, flexDirection: "column" },
  // // listItem: { flexDirection: "column" },
  // button: { color: "red" },
});

export default SearchUsers;
