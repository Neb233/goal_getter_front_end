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
  Modal,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import {
  getGoalsByUser,
  getPostsByUser,
  getSubgoalsByGoalId,
  getUser,
  patchAvatar,
} from "../../utils/api";
import dateFormat, { masks } from "dateformat";
import Social from "../Feed/Social";
import ProgressBar from "../../shared/ProgressBar";
import { auth } from "../../firebase";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";

const Goals = ({ navigation, route }) => {
  const [goals, setGoals] = useState([]);
  const [oldGoals, setOldGoals] = useState();
  const [futureGoals, setFutureGoals] = useState();
  const [userDetails, setUserDetails] = useState({ username: "", profile: "" });
  const [userPosts, setUserPosts] = useState([]);
  const [showGoals, setShowGoals] = useState(false);
  const [subgoals, setSubgoals] = useState({});
  const [imagemodalVisible, setImageModaVisible] = useState("");
  const [profPic, SetProfPic] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  let user = auth.currentUser;

  if (route.params) {
    user = { displayName: route.params.user };
  }

  useEffect(() => {
    const onBlur = navigation.addListener("blur", () => {});

    return onBlur;
  }, [navigation]);

  useEffect(() => {
    setSubgoals({});
    setGoals([]);
    setFutureGoals([]);
    setOldGoals([]);
    setShowGoals(false);

    getGoalsByUser(user.displayName).then((goals) => {
      console.log("USERS GOALS", goals);
      goals.forEach((goal) => {
        getSubgoalsByGoalId(goal.goal_id).then((subgoals) => {
          setSubgoals((oldSubgoals) => {
            const newSubgoals = { ...oldSubgoals };
            newSubgoals[goal.goal_id] = subgoals;
            return newSubgoals;
          });
        });
      });

      setGoals(
        goals.filter((goal) => {
          return (
            new Date(goal.end_date).getTime() > Date.now() &&
            new Date(goal.start_date).getTime() < Date.now()
          );
        })
      );
      setOldGoals(
        goals.filter((goal) => {
          return new Date(goal.end_date).getTime() < Date.now();
        })
      );
      setFutureGoals(
        goals.filter((goal) => {
          return new Date(goal.start_date).getTime() > Date.now();
        })
      );
    });
    getPostsByUser(user.displayName).then((posts) => {
      console.log("USERS POSTS", posts);
      setUserPosts(posts);
    });
    getUser(user.displayName).then((userDetails) => {
      setUserDetails(userDetails[0]);

      SetProfPic(userDetails[0].avatar_url);
    });
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatarUrl(result.uri);
      const storage = getStorage();
      const refo = ref(storage, `${user.displayName}: Profile Picture`);

      const img = await fetch(result.uri);
      const bytes = await img.blob();

      await uploadBytes(refo, bytes);
    }
    await updateProfile(user, {
      photoURL: `${user.displayName}: Profile Picture`,
    });
    const storage = getStorage();
    getDownloadURL(ref(storage, `${user.displayName}: Profile Picture`)).then(
      (url) => {
        console.log(url);
        patchAvatar(user.displayName, url).then((res) => {
          console.log(res);
        });
      }
    );
    setImageModaVisible(!imagemodalVisible);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("signed out");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ScrollView style={{ backgroundColor: "#fdf9e6" }}>
      <View style={styles.header}>
        {user === auth.currentUser ? (
          <View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={imagemodalVisible}
              onRequestClose={() => {
                setImageModaVisible(!imagemodalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={pickImage}
                  >
                    <Text style={styles.textStyle}>Update Profile Picture</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setImageModaVisible(!imagemodalVisible)}
                  >
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <Pressable onPress={() => setImageModaVisible(true)}>
              <Image
                source={{
                  uri: profPic,
                  headers: {
                    Accept: "*/*",
                  },
                }}
                style={styles.profPic}
              />
            </Pressable>

            <Pressable onPress={handleSignOut}>
              <Text>Sign Out</Text>
            </Pressable>
          </View>
        ) : (
          <Image
            source={{
              uri: profPic,
              headers: {
                Accept: "*/*",
              },
            }}
            style={styles.profPic}
          />
        )}

        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.userName}>{user.displayName}</Text>

            <Text {{ fontWeight: "bold" }}>{userDetails ? userDetails.profile : ""}</Text>
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
          <Text style={{ color: "white" }}>
            {showGoals ? "Show Social Feed" : "Show Goals"}
          </Text>
        </TouchableOpacity>
      </View>
      {showGoals ? (
        <View>
          <View style={styles.goalContainer}>
            <Text
              style={{
                color: "#3e4d6e",
                fontWeight: "bold",
                fontSize: 16,
                alignSelf: "center",
              }}
            >
              Current Goals
            </Text>
            <FlatList
              data={goals}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("GoalPage", {
                        goal_id: item.goal_id,
                      });
                    }}
                  >
                    <View>
                      <Text style={styles.title}>{item.objective}</Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "500",
                          marginBottom: 5,
                        }}
                      >
                        {item.description}
                      </Text>
                      <Text style={styles.duedate}>
                        Start date:{" "}
                        {dateFormat(item.start_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      <Text style={styles.duedate}>
                        End date:{" "}
                        {dateFormat(item.end_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      {item.type === "progress" ? (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {`${
                            item.progress.length === 0
                              ? 0
                              : Math.round(
                                  100 *
                                    item.progress[item.progress.length - 1][1]
                                ) / 100
                          } / ${Math.round(100 * item.target_value)} ${
                            item.unit
                          }`}
                        </Text>
                      ) : (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {subgoals[item.goal_id]
                            ? `${
                                subgoals[item.goal_id].filter((subgoal) => {
                                  return subgoal.status === "completed";
                                }).length
                              } / ${
                                subgoals[item.goal_id].length
                              } subgoals achieved`
                            : null}
                        </Text>
                      )}
                      {item.progress || subgoals[item.goal_id] ? (
                        <ProgressBar
                          progress={item.progress}
                          target_value={item.target_value}
                          subgoals={subgoals[item.goal_id]}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View style={styles.goalContainer}>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 16,
                fontWeight: "bold",
                color: "#3e4d6e",
              }}
            >
              Past Goals
            </Text>
            <FlatList
              data={oldGoals}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("GoalPage", {
                        goal_id: item.goal_id,
                      });
                    }}
                  >
                    <View>
                      <Text style={styles.title}>{item.objective}</Text>
                    </View>
                    <View>
                      <Text style={{ color: "white", fontWeight: '500', marginBottom: 10 }}>{item.description}</Text>
                      <Text style={styles.duedate}>
                        Start date:{" "}
                        {dateFormat(item.start_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      <Text style={styles.duedate}>
                        End date:{" "}
                        {dateFormat(item.end_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      {item.type === "progress" ? (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {`${
                            item.progress.length === 0
                              ? 0
                              : item.progress[item.progress.length - 1][1]
                          } / ${item.target_value} ${item.unit}`}
                        </Text>
                      ) : (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {subgoals[item.goal_id]
                            ? `${
                                subgoals[item.goal_id].filter((subgoal) => {
                                  return subgoal.status === "completed";
                                }).length
                              } / ${
                                subgoals[item.goal_id].length
                              } subgoals achieved`
                            : null}
                        </Text>
                      )}
                      {item.progress || subgoals[item.goal_id] ? (
                        <ProgressBar
                          progress={item.progress}
                          target_value={item.target_value}
                          subgoals={subgoals[item.goal_id]}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View style={styles.goalContainer}>
            <Text style={styles.currentgoals}>Upcoming Goals:</Text>
            <FlatList
              data={futureGoals}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("GoalPage", {
                        goal_id: item.goal_id,
                      });
                    }}
                  >
                    <View>
                      <Text style={styles.title}>{item.objective}</Text>
                    </View>
                    <View>
                      <Text style={{ color: "white" }}>{item.description}</Text>
                      <Text style={styles.duedate}>
                        Start date:{" "}
                        {dateFormat(item.start_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      <Text style={styles.duedate}>
                        End date:{" "}
                        {dateFormat(item.end_date, "dddd, mmmm dS, yyyy")}
                      </Text>
                      {item.type === "progress" ? (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {`${
                            item.progress.length === 0
                              ? 0
                              : item.progress[item.progress.length - 1][1]
                          } / ${item.target_value} ${item.unit}`}
                        </Text>
                      ) : (
                        <Text style={styles.duedate}>
                          Current Progress:{" "}
                          {subgoals[item.goal_id]
                            ? `${
                                subgoals[item.goal_id].filter((subgoal) => {
                                  return subgoal.status === "completed";
                                }).length
                              } / ${
                                subgoals[item.goal_id].length
                              } subgoals achieved`
                            : null}
                        </Text>
                      )}
                      {item.progress || subgoals[item.goal_id] ? (
                        <ProgressBar
                          progress={item.progress}
                          target_value={item.target_value}
                          subgoals={subgoals[item.goal_id]}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
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
    backgroundColor: "#3e4d6e",
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    color: "white",
    fontSize: 18,
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
    // backgroundColor: "#5df542",
    // height: 100,
  },
  profPic: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 0,
    alignSelf: "center",
    position: "absolute",
    marginTop: 50,
  },
  userName: {
    fontSize: 22,
    color: "#fc03ba",
    fontWeight: "bold",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  body: {
    marginTop: 200,
    alignItems: "center",
    // fontWeight: 'bold'
    // justifyContent: 'center',
    // alignSelf: 'center'
  },
  bodyContent: {
    // flex: 1,
    // alignItems: "center",
    // padding: 30,
  },
  button: {
    backgroundColor: "#5B72A4",
    // width: "90%",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    // margin: 20,
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    margin: 40,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: "center",
    shadowColor: "#000",
  },
});
