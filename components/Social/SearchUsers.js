import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Searchbar } from "react-native-paper";
import { searchUsers } from "../../utils/api";

const SearchUsers = () => {
  const [queryState, setQueryState] = useState({
    query: "",
  });
  const [resultState, setResultState] = useState([]);

  useEffect(() => {
    return searchUsers(queryState).then((results) => {
      setResultState(results);
    });
  }, [queryState]);

  const { firstQuery } = queryState;

  return (
    <KeyboardAvoidingView>
      <View>
        <Searchbar
          placeholder="Search"
          onChangeText={(query) => {
            setQueryState({ query: query.value });
          }}
          value={queryState}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

// const styles = SearchUsers.create({});

export default SearchUsers;
