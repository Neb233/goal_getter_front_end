import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  Image,
  Pressable,
  Modal,
  
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
  const [details, SetDetails] = useState({});
  const [image, setImage] = useState(null);
  const [profPic, SetProfPic] = useState("");
  const [modalVisible, setModaVisible] = useState("");

  const user = auth.currentUser;
  

  const default_url =
    "https://firebasestorage.googleapis.com/v0/b/goalgetter-4937c.appspot.com/o/blank%20avatar.png?alt=media&token=b003fca8-e6ca-4c55-a378-3ead9db94f0d";

  const storage = getStorage();

  useEffect(() => {
    getUser(user.displayName).then((res) => {
      SetDetails(res[0]);
    });
    if (user.photoURL !== null) {
      getDownloadURL(ref(storage, `${user.displayName}: Profile Picture`)).then(
        (url) => {
          console.log(url);
          SetProfPic(url);
        }
      );
    } else {
      SetProfPic(default_url);
    }
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
      SetProfPic(result.uri);
      const storage = getStorage();
      const refo = ref(storage, `${user.displayName}: Profile Picture`);

      const img = await fetch(result.uri);
      const bytes = await img.blob();

      await uploadBytes(refo, bytes);
    }
    updateProfile(user, { photoURL: `${user.displayName}: Profile Picture` });
    setModaVisible(!modalVisible);
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModaVisible(!modalVisible);
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
                onPress={() => setModaVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Pressable onPress={() => setModaVisible(true)}>
          <Image source={{ uri: profPic }} style={styles.profPic} />
        </Pressable>

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
  buttonClose: {
    backgroundColor: "#2196F3",
    margin: 5,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
  // shadowOffset: {
  //   width: 0,
  //   height: 2,
  // },
});
