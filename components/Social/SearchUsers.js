import React from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Searchbar, List, Button } from "react-native-paper";
import {
  searchUsers,
  addFriend,
  getFriends,
  deleteFriendship,
  getUser,
} from "../../utils/api";
import { auth } from "../../firebase";

const SearchUsers = () => {
  const currentUser = auth.currentUser;

  const [queryState, setQueryState] = useState({
    query: "",
  });
  const [resultState, setResultState] = useState([]);

  const [friends, setFriends] = useState([]);
  const [isFriend, setIsFriend] = useState([]);
  const [userAvatars, setUserAvatars] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    searchUsers(queryState.query).then((results) => {
      const filteredResults = results.filter((user) => {
        return user.username !== currentUser.displayName;
      });
      setResultState(filteredResults);
    });

    getFriends(currentUser.displayName).then((friends) => {
      setFriends(friends);
    });
  }, []);

  useEffect(() => {
    setIsFriend(
      resultState.map((user) => {
        return !(friends.indexOf(user.username) === -1);
      })
    );
    const userPromises = resultState.map((user) => {
      return getUser(user.username);
    });
    return Promise.all(userPromises).then((userArray) => {
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

  useEffect(() => {
    return searchUsers(queryState.query).then((results) => {
      const filteredResults = results.filter((user) => {
        return user.username !== currentUser.displayName;
      });
      setResultState(filteredResults);
    });
  }, [queryState]);

  const addFriendClick = (userToAdd) => {
    return addFriend(currentUser.displayName, userToAdd)
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
        return Alert.alert("Friend Added", "", [{ text: "OK" }]);
      })
      .catch((err) => {
        return getFriends(currentUser.displayName).then((friends) => {
          if (friends.indexOf(userToAdd !== -1)) {
            return Alert.alert("Error", "Already friends", [{ text: "OK" }]);
          } else {
            return Alert.alert("Error", "Something went wrong", [
              { text: "OK" },
            ]);
          }
        });
      });
  };

  const removeFriendClick = (userToRemove) => {
    return deleteFriendship(currentUser.displayName, userToRemove).then(() => {
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
      return Alert.alert("Friend Removed", "", [{ text: "OK" }]);
    });
  };

  return (
    <ScrollView>
      <View>
        <Searchbar
          autoCapitalize="none"
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
                    color="#fdf9e6"
                    onPress={() => {
                      navigation.navigate("UserPage", {
                        user: item.username,
                      });
                    }}
                    left={(props) => {
                      return (
                        <Image
                          source={{
                            uri: userAvatars[index]
                              ? userAvatars[index]
                              : "https://firebasestorage.googleapis.com/v0/b/goalgetter-4937c.appspot.com/o/blank%20avatar.png?alt=media&token=b003fca8-e6ca-4c55-a378-3ead9db94f0d",
                            headers: {
                              Accept: "*/*",
                            },
                          }}
                          style={{
                            backgroundColor: "white",
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                          }}
                        />
                      );
                    }}
                  />
                  <Text style={styles.userName}>{item.username}</Text>
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
                <View style={styles.viewStyle}>
                  <List.Item
                    style={styles.listItem}
                    key={item.username}
                    color="#fdf9e6"
                    left={(props) => {
                      return (
                        <Image
                          source={{
                            uri: userAvatars[index]
                              ? userAvatars[index]
                              : "https://firebasestorage.googleapis.com/v0/b/goalgetter-4937c.appspot.com/o/blank%20avatar.png?alt=media&token=b003fca8-e6ca-4c55-a378-3ead9db94f0d",
                            headers: {
                              Accept: "*/*",
                            },
                          }}
                          style={{
                            backgroundColor: "white",
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                          }}
                        />
                      );
                    }}
                    onPress={() => {
                      navigation.navigate("GoalPage", { goal_id: 1 });
                      navigation.navigate("UserPage", {
                        user: item.username,
                      });
                    }}
                  />
                  <Text style={styles.userName}>{item.username}</Text>
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
                </View>
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
  viewStyle: { padding: 25, alignItems: "center" },
  userName: {
    fontSize: 18,
    color: "#5B72A4",
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: "white",
    borderRadius: 5,
  },
  listItem: { backgroundColor: "#fdf9e6", alignSelf: "center" },
  button: { width: "50%", alignSelf: "center" },
});

export default SearchUsers;
