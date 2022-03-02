import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendSignInLinkToEmail,
} from "@firebase/auth";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import axios from "axios";
import { updateProfile } from "firebase/auth";
import { UserContext } from "../../context/user";
import * as Animatable from "react-native-animatable";

import { Formik } from "formik";
import * as Yup from "yup";
import Feed from "../Feed/Feed";

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [profile, SetProfile] = useState("");
  const [username, SetUsername] = useState("");

  const handleRegister = () => {
    valSchema
      .isValid({
        email: email,
        username: username,
        password: password,
        profile: profile,
      })

      .then((valid) => {
        if (valid) {
          createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredentials) => {
              const user = userCredentials.user;

              await updateProfile(user, { displayName: username });

              var body = { username: username, profile: profile };

              await axios({
                method: "post",
                url: "https://goalgetter-backend.herokuapp.com/api/users",
                data: body,
              }).catch(function (error) {
                console.log(error);
              });
              navigation.navigate("Feed");
              return user;
            })

            .catch((error) => alert(error.message));
        }
      });
  };

  const validateEmail = (valemail) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return re.test(valemail) 
    };

    const validatePassword = (valpass) => {
      const re  = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,10}$/
      return re.test(valpass)
    }

    const validateUsername = (valUse) => {
      const re = /(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/
      return re.test(valUse)
    }

  const valSchema = Yup.object({
    username: Yup.string()
      .min(2, "Must be at least 2 characters")
      .max(24, "no more than 8 characters")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(4, "Password shoudl be more than 4 chars")
      .max(10, "Password should not exceed 10 chars")
      .matches(/\w*[a-z]\w*/, "Password must have a small letter")
      .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
      .matches(/\d/, "Password must have a number")
      .required(),
    profile: Yup.string(),
  });

  return (
    <View style={styles.container}>
      
      <KeyboardAvoidingView behaviour="padding">
        <View style={styles.header}>
          <Text style={styles.title_text}>Register Your Account</Text>
        </View>

        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <View style={styles.action}>
            <Text style={styles.text_footer}>Email*</Text>
            <TextInput
              id="email"
              name="email"
              value={email}
              onChangeText={(text) => SetEmail(text)}
              style={styles.textInput}
            />

{  !validateEmail(email)  ? null : <Text style={styles.success}>Valid Email</Text>}
           
          </View>

          <View style={styles.action}>
            <Text style={styles.text_footer}>Username*</Text>
            <TextInput
              id="username"
              name="username"
              value={username}
              onChangeText={(text) => SetUsername(text)}
              style={styles.textInput}
            />
          {!validateUsername(username) ? null : <Text style={styles.success}>Valid Username</Text>}
          </View>

          <View style={styles.action}>
            <Text style={styles.text_footer}>Profile</Text>
            <TextInput
              id="profile"
              name="profile"
              value={profile}
              onChangeText={(text) => SetProfile(text)}
              style={styles.textInput}
            ></TextInput>
          </View>

          <View style={styles.action}>
            <Text style={styles.text_footer}>Password*</Text>
            <TextInput
              id="password"
              name="password"
              value={password}
              onChangeText={(text) => SetPassword(text)}
              style={styles.textInput}
              secureTextEntry
            ></TextInput>

{ !validatePassword(password) ? null : <Text style={styles.success}>Valid Password</Text>}
          </View>

          <Text>
            {`
        Password should have:    One Capital letter
                                 One Number 
                                At least 4 characters Login
                                 Maximum 10 characters
                `}
          </Text>
          {/* <Text>{touched.password && errors.password}</Text> */}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleRegister} style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </KeyboardAvoidingView>
     
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf9e6",
  },

  header: {
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
    marginTop: 50,
  },
  title_text: {
    color: "#3e4d6e",
    fontWeight: "bold",
    fontSize: 30,
  },
  footer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
  },

  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "column",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },

  textInput: {
    padding: 5,
    color: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  buttonContainer: {
    paddingBottom: 400,
    width: "80%",
  },
  button: {
    backgroundColor: "#3e4d6e",
    alignItems: "flex-start",
    marginTop: 40,
    padding: 15,
    borderRadius: 10,
    marginBottom: 60,
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  register_text: {
    marginTop: 20,
  },
  success: {
    fontSize: 15,
    color: 'green'
  }
});
