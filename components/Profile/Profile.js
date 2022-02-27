import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { auth } from "../../firebase";
import axios from "axios";
import { getUser } from "../../utils/api";
import { signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserContext, UserProvider } from "../../context/user";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  // const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  // const navigation = useNavigation();

  const [details, Setdetails] = useState({});
  const [image, setImage] = useState(null);
  const [profPic, setprofPic] = useState("");

  const user = auth.currentUser;
  console.log(user);

  const storage = getStorage();

  useEffect(() => {
    getUser(user.displayName).then((res) => {
      Setdetails(res[0]);
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("signed out");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      const storage = getStorage();
      const refo = ref(storage, `${displayName}: Profile Picture`);

      const img = await fetch(result.uri);
      const bytes = await img.blob();

      await uploadBytes(refo, bytes);
    }
    updateProfile(user, { photoURL: `${displayName}: Profile Picture` });
  };

  if (user !== null) {
    if (user.photoURL !== null) {
      getDownloadURL(ref(storage, `${user.displayName}: Profile Picture`)).then(
        (url) => {
          setprofPic(url);
        }
      );
    } else {
      console.log("testing");
    }
  }

  return (
    <View style={styles.container}>
      {user !== null ? (
        <View style={styles.header}>
          {user.photoURL === null ? (
            <Image
              source={require("./blank_avatar.png")}
              style={styles.profPic}
            />
          ) : (
            <Image source={{ uri: profPic }} style={styles.profPic} />
          )}
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.userName}>{details.username}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleSignOut}
                  style={[styles.button, styles.signOutButton]}
                >
                  <Text>Sign out</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  title="Update Profile Picture"
                  onPress={pickImage}
                  style={[styles.button, styles.buttonOutline]}
                >
                  <Text>Update Profile Picture</Text>
                </TouchableOpacity>
              </View>

              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200 }}
                />
              )}
            </View>
          </View>
        </View>
      ) : (
        <View>
          <Text>Login</Text>
        </View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#5df542",
    height: 100,
  },
  profPic: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 30,
  },
  userName: {
    fontSize: 22,
    color: "#fc03ba",
    fontWeight: "600",
    marginBottom: 40,
  },
  body: {
    marginTop: 150,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  // signOutButton: {
  //   postion: 'bottom',
  // }
});
