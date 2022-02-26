import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { TouchableOpacity, FlatList } from "react-native";
import PostComments from "../PostComments/PostComments";
import { useState, useEffect } from "react";
import { KeyboardAvoidingView } from "react-native";
import Card from "../../shared/card";
import {
  getCommentsByPost,
  getSubgoalBySubgoalId,
  getGoalByGoalId,
  getReactionsByPost,
} from "../../utils/api";
import { formatDate } from "../../utils/format";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

const getReactionCount = (reactions) => {
  const currentUser = "jeff";
  const reactionCount = {
    awesome: 0,
    congrats: 0,
    encourage: 0,
    proud: 0,
  };

  reactions.forEach((reaction) => {
    switch (reaction.reaction) {
      case "Awesome!":
        reactionCount.awesome++;
        break;
      case "Congratulations!":
        reactionCount.congrats++;
        break;
      case "Keep on going":
        reactionCount.encourage++;
        break;
      case "I'm proud of you":
        reactionCount.proud++;
        break;
    }
  });
  return reactionCount;
};

const Social = (props) => {
  const [isShowing, setIsShowing] = useState(false);
  const [comments, setComments] = useState([]);
  const [associatedGoal, setAssociatedGoal] = useState({});
  const [reactionCount, setReactionCount] = useState({
    awesome: 0,
    congrats: 0,
    encourage: 0,
    proud: 0,
  });

  const {
    owner,
    datetime,
    message,
    associated_data_type,
    associated_id,
    post_id,
  } = props.postDetails;

  useEffect(() => {
    if (associated_data_type === "subgoal") {
      getSubgoalBySubgoalId(associated_id).then((subgoal) => {
        setAssociatedGoal(subgoal);
      });
    } else {
      getGoalByGoalId(associated_id).then((goal) => {
        setAssociatedGoal(goal);
      });
    }
    getCommentsByPost(post_id).then((comments) => {
      setComments(comments);
    });
    getReactionsByPost(post_id).then((reactions) => {
      const reactionCount = getReactionCount(reactions);
      setReactionCount(reactionCount);
    });
  }, []);

  const handleCommentClick = () => {
    setIsShowing((currValue) => {
      return !currValue;
    });
  };

  const handlePostReaction = (value) => {
    setReactionCount((oldReactionCount) => {
      newReactionCount = { ...oldReactionCount };
      newReactionCount[value]++;
      return newReactionCount;
    });
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.goalContainer}>
        <View style={styles.userInfo}>
          <View style={styles.profilePic} />
          <Text style={styles.username}>{owner}</Text>
        </View>
        <View style={styles.post}>
          <View style={styles.goal}>
            <Text>"{associatedGoal.objective}"</Text>
          </View>
          <Text>"{message}"</Text>
          <Text>{formatDate(datetime)}</Text>
        </View>
        <View style={styles.flexRow}>
          <View style={styles.awesome} />
          <Text>{reactionCount.awesome}</Text>
          <View style={styles.congrats} />
          <Text>{reactionCount.congrats}</Text>
          <View style={styles.encourage} />
          <Text>{reactionCount.encourage}</Text>
          <View style={styles.proud} />
          <Text>{reactionCount.proud}</Text>
        </View>
        <View style={styles.interact}>
          <MenuProvider style={{ flexDirection: "column", padding: 30 }}>
            <Menu onSelect={handlePostReaction}>
              <MenuTrigger style={styles.react} text="React" />
              <MenuOptions>
                <MenuOption value="awesome" text="Awesome!" />
                <MenuOption value="congrats" text="Congrats!" />
                <MenuOption value="encourage" text="Keep on going" />
                <MenuOption value="proud" text="I'm proud of you" />
              </MenuOptions>
            </Menu>
          </MenuProvider>
          <TouchableOpacity
            style={styles.comButton}
            onPress={() => {
              handleCommentClick();
            }}
          >
            <Text style={styles.comment}>Comment</Text>
          </TouchableOpacity>
        </View>

        <View>
          {isShowing ? (
            <TextInput
              style={styles.input}
              placeholder="leave a positive comment"
              onChangeText={(comment) => setComments(comment)}
              defaultValue={comments}
            />
          ) : null}
        </View>
        <View>
          {comments.length > 0 ? (
            <FlatList
              data={comments}
              renderItem={({ item }) => (
                <Card>
                  <Text style={styles.username}>{item.owner}</Text>
                  <Text style={styles.text}>{item.message}</Text>
                  <Text style={styles.text}>{formatDate(item.datetime)}</Text>
                </Card>
              )}
            />
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#00ffdd",
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 10,
  },
  goalContainer: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,

    elevation: 5,
  },
  username: {
    color: "black",
    marginBottom: 15,
    fontWeight: "bold",
    margin: 10,
  },
  progress: {
    marginTop: 10,
  },
  interact: {
    flexDirection: "row",
    borderRadius: 10,
  },
  awesome: {
    height: 30,
    width: 30,
    backgroundColor: "blue",
    borderRadius: 15,
  },
  congrats: {
    height: 30,
    width: 30,
    backgroundColor: "yellow",
    borderRadius: 15,
  },
  encourage: {
    height: 30,
    width: 30,
    backgroundColor: "green",
    borderRadius: 15,
  },
  proud: {
    height: 30,
    width: 30,
    backgroundColor: "pink",
    borderRadius: 15,
  },
  profilePic: {
    height: 40,
    width: 40,
    backgroundColor: "grey",
    borderRadius: 50,
  },
  userInfo: {
    flexDirection: "row",
  },
  post: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  goal: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  react: {
    backgroundColor: "#468705",
    borderRadius: 8,
    marginTop: 20,
    color: "white",
    padding: 2,
  },
  button: {
    backgroundColor: "#468705",
    borderRadius: 8,
    marginTop: 20,
  },
  comButton: {
    backgroundColor: "#4892b7",
    borderRadius: 8,
    marginTop: 20,
    marginLeft: 10,
    padding: 2,
  },
  flexRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  comment: {
    color: "white",
  },
  input: {
    padding: 7,
    marginTop: 15,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 50,
  },
});

export default Social;
