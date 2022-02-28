import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Searchbar, List } from "react-native-paper";
import {
  searchUsers,
  addFriend,
  getFriends,
  deleteFriend,
} from "../../utils/api";

const SearchUsers = () => {
  const [queryState, setQueryState] = useState({
    query: "",
  });
  const [resultState, setResultState] = useState([]);

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    return getFriends("martina").then((friendsRes) => {
      setFriends(friendsRes);
      console.log("friends result state", friendsRes);
    });
  }, [friends]);

  useEffect(() => {
    return searchUsers(queryState.query).then((results) => {
      setResultState(results);
      console.log("result state", resultState);
    });
  }, [queryState]);

  const addFriendClick = (userToAdd) => {
    console.log(userToAdd);
    /*WIP-ONCE CONTEXT IS INCORPORATED CHANGE MARTINA 
    return addFriend("loggedInUser", "usertoadd").catch((err) => {
          */
    return addFriend("martina", userToAdd)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        return getFriends("martina").then((friends) => {
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
    console.log(userToRemove);
    /*WIP-ONCE CONTEXT IS INCORPORATED CHANGE MARTINA 
    return RemoveFriend("loggedInUser", "usertoRemove").catch((err) => {
          */
    return deleteFriend("martina", userToRemove)
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
    <KeyboardAvoidingView style={styles.searchStyle}>
      <View>
        <Searchbar
          placeholder="Search"
          onChangeText={(query) => {
            setQueryState({ query: query });
          }}
          value={queryState}
        />
      </View>
      <ScrollView>
        <List.Section>
          <List.Subheader>Results</List.Subheader>

          {resultState ? (
            resultState.map((item) => {
              console.log(
                "item.username",
                item.username,
                typeof loggedInUsersFriends
              );
              if (friends.indexOf(item.username) === -1) {
                return (
                  <>
                    <List.Item
                      style={styles.listItem}
                      key={item.username}
                      title={item.username}
                      left={(props) => <List.Icon {...props} icon="account" />}
                    />
                    <TouchableOpacity
                      onPress={() => addFriendClick(item.username)}
                    >
                      <Text>Add Friend</Text>
                    </TouchableOpacity>
                  </>
                );
              } else {
                return (
                  <>
                    <List.Item
                      style={styles.listItem}
                      key={item.username}
                      title={item.username}
                      left={(props) => <List.Icon {...props} icon="account" />}
                    />
                    <TouchableOpacity
                      onPress={() => removeFriendClick(item.username)}
                    >
                      <Text>Remove Friend</Text>
                    </TouchableOpacity>
                  </>
                );
              }
            })
          ) : (
            <Text>""</Text>
          )}
        </List.Section>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  listItem: {
    justifyContent: "flex-end",
  },
});

export default SearchUsers;
