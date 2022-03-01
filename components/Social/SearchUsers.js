import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Searchbar, List,Button } from "react-native-paper";
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
  const [isFriend, setIsFriend] = useState([])

  // useEffect(() => {
  //   return getFriends("jeff").then((friendsRes) => {
  //     setFriends(friendsRes);
  //     console.log("friends result state", friendsRes);
  //   })
  // }, []);

  useEffect(() => {
    return searchUsers(queryState.query).then((results) => {
      setResultState(results);
      setIsFriend(results.map((user) => {return !(friends.indexOf(user) === -1)}))
      console.log("result state", resultState);
    });
  }, [queryState]);

  useEffect(() => {
    return getFriends("jeff").then((friendsRes) => {
      setFriends(friendsRes);
      console.log("friends result state", friendsRes);
    });
  }, [isFriend]);


  const addFriendClick = (userToAdd) => {
    console.log(userToAdd);
    /*WIP-ONCE CONTEXT IS INCORPORATED CHANGE MARTINA 
    return addFriend("loggedInUser", "usertoadd").catch((err) => {
          */
    return addFriend("jeff", userToAdd)
      .then((res) => {
        console.log(res);
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
    console.log("usertoremove", userToRemove);
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
            console.log(
              "item.username",
              item.username,
              typeof friends
            );
            if (!isFriend[index]) {
              return (
                <View style={styles.viewStyle}>
                  <List.Item
                    style={styles.listItem}
                    key={item.username}
                    title={item.username}
                    left={(props) => <List.Icon {...props} icon="account" />}
                  />

                  <Button
                    style={styles.button}
                    mode="contained"
                    color="green"
                    onPress={() => {
                      setIsFriend((oldIsFriend) => {
                        const newIsFriend = [...oldIsFriend]
                        newIsFriend[index] = true
                        return newIsFriend
                      })
                      addFriendClick(item.username)}}
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
                  />

                  <Button
                    mode="contained"
                    color="red"
                    onPress={() => {
                      setIsFriend((oldIsFriend) => {
                        const newIsFriend = [...oldIsFriend]
                        newIsFriend[index] = false
                        return newIsFriend
                      })
                      removeFriendClick(item.username)}}
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
