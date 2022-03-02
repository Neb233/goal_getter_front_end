import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
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

const SearchUsers = () => {
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
      console.log(results);
      setResultState(results);
    });

    getFriends("jeff").then((friends) => {
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
      setResultState(results);
    });
  }, [queryState]);

  const addFriendClick = (userToAdd) => {
    /*WIP-ONCE CONTEXT IS INCORPORATED CHANGE MARTINA 
    return addFriend("loggedInUser", "usertoadd").catch((err) => {
          */
    return addFriend("jeff", userToAdd)
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
        return getFriends("jeff").then((friends) => {
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
    return deleteFriendship("jeff", userToRemove)
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
                      navigation.navigate("UserPage", item.username);
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
  // list: {
  // //   flex: 1,
  // //   // flexDirection: "column",
  // // },
  // viewStyle: { flex: 1, flexDirection: "column" },
  // // listItem: { flexDirection: "column" },
  // button: { color: "red" },
});

export default SearchUsers;
