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
import { searchUsers, addFriend, getFriends } from "../../utils/api";

const SearchUsers = () => {
  const [queryState, setQueryState] = useState({
    query: "",
  });
  const [resultState, setResultState] = useState([]);

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
            return Alert.alert("Error", "Something went", [
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ]);
          }
        });
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
              console.log("item.username", item.username);
              return (
                <>
                  <List.Item
                    key={item.username}
                    title={item.username}
                    left={(props) => <List.Icon {...props} icon="account" />}
                  />
                  <TouchableOpacity
                    onPress={() => addFriendClick(item.username)}
                  >
                    <Text>Add</Text>
                  </TouchableOpacity>
                </>
              );
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
  searchStyle: {},
});

export default SearchUsers;
