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
import { Searchbar, List, Button, Avatar } from "react-native-paper";
import {
  searchUsers,
  addFriend,
  getFriends,
  deleteFriendship,
  getUser,
} from "../../utils/api";
import { auth } from "../../firebase";

// const SearchUsers = ({ navigation, route }) => {
const SearchUsers = () => {
  const user = {};
  // if (route.params) {
  //   user.displayName = route.params.user;
  // } else {
  //   user.displayName = auth.currentUser.displayName;
  // }

  const [queryState, setQueryState] = useState({
    query: "",
  });
  const [resultState, setResultState] = useState([]);

  const [friends, setFriends] = useState([]);
  const [isFriend, setIsFriend] = useState([]);
  const [userAvatars, setUserAvatars] = useState([]);

  const navigation = useNavigation();

  //RUN WHEN PAGE IS FIRST LOADED
  useEffect(() => {
    searchUsers(queryState.query).then((results) => {
      const filteredResults = results.filter((user) => {
        return user.username !== user.displayName;
      });
      console.log(results);
      setResultState(filteredResults);
    });

    getFriends(user.displayName).then((friends) => {
      setFriends(friends);
    });
  }, []);

  useEffect(() => {
    setIsFriend(
      resultState.map((user) => {
        return !(friends.indexOf(user.username) === -1);
      })
    );

    console.log(resultState);
    const userPromises = resultState.map((user) => {
      return getUser(user.username);
    });
    return Promise.all(userPromises).then((userArray) => {
      console.log(userArray);
      userArray.forEach((user, index) => {
        setUserAvatars((oldUserAvatars) => {
          const newUserAvatars = [...oldUserAvatars];
          newUserAvatars[index] = user[0].avatar_url;
          return newUserAvatars;
        });
      });
    });
  }, [resultState]);

  useEffect(() => {
    setIsFriend(
      resultState.map((user) => {
        return !(friends.indexOf(user.username) === -1);
      })
    );
  }, [friends]);

  //RUN WHEN SEARCH IS CHANGED
  useEffect(() => {
    return searchUsers(queryState.query).then((results) => {
      const filteredResults = results.filter((user) => {
        return user.username !== user.displayName;
      });
      setResultState(filteredResults);
    });
  }, [queryState]);

  const addFriendClick = (userToAdd) => {
    /*WIP-ONCE CONTEXT IS INCORPORATED CHANGE MARTINA 
    return addFriend("loggedInUser", "usertoadd").catch((err) => {
          */
    return addFriend(user.displayName, userToAdd)
      .then(() => {
        const ind = resultState.findIndex(
          (user) => user.username === userToAdd
        );
        setFriends((oldFriends) => {
          const newFriends = [...oldFriends, resultState[ind].username];
          return newFriends;
        });
        setIsFriend(
          resultState.map((user) => {
            return !(friends.indexOf(user.username) === -1);
          })
        );
        return Alert.alert("Friend Added", "", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      })
      .catch((err) => {
        return getFriends(user.displayName).then((friends) => {
          if (friends.indexOf(userToAdd !== -1)) {
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
    return deleteFriendship(user.displayName, userToRemove)
      .then(() => {
        console.log("friend removed");

        const ind = friends.indexOf(userToRemove);
        setFriends((oldFriends) => {
          const newFriends = [
            ...oldFriends.slice(0, ind),
            ...oldFriends.slice(ind + 1, oldFriends.length),
          ];
          return newFriends;
        });
        setIsFriend(
          resultState.map((user) => {
            return !(friends.indexOf(user.username) === -1);
          })
        );
        return Alert.alert("Friend Removed", "", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ScrollView>
      <View>
        <Searchbar
          placeholder="Search"
          onChangeText={(query) => {
            setQueryState({ query: query });
          }}
          value={queryState.query}
          style={styles.searchBar}
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
                    color="#fdf9e6"
                    onPress={() => {
                      navigation.navigate("UserPage", {
                        user: owner,
                      });
                    }}
                    left={(props) => {
                      return (
                        <Avatar.Image
                          {...props}
                          source={
                            userAvatars[index] ? userAvatars[index] : "account"
                          }
                          style={{ backgroundColor: "white" }}
                        />
                      );
                    }}
                  />

                  <Button
                    style={styles.button}
                    mode="contained"
                    color="green"
                    onPress={() => {
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
                    color="#fdf9e6"
                    left={(props) => {
                      return (
                        <Avatar.Image
                          {...props}
                          source={
                            userAvatars[index] ? userAvatars[index] : "account"
                          }
                          style={{ backgroundColor: "white" }}
                        />
                      );
                    }}
                    onPress={() => {
                      navigation.navigate("UserPage", {
                        user: owner,
                      });
                    }}
                  />

                  <Button
                    mode="contained"
                    color="red"
                    onPress={() => {
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#fdf9e6",
  },
  list: {
    flex: 1,
    backgroundColor: "#fdf9e6",
    justifyContent: "center",
  },
  viewStyle: { padding: 30 },
  listItem: { backgroundColor: "#fdf9e6", alignSelf: "center" },
  button: { width: "50%", alignSelf: "center" },
});

export default SearchUsers;
