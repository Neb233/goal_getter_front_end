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

import { Formik } from "formik";
import * as Yup from "yup";
import Feed from "../Feed/Feed";

const RegisterScreen = () => {
  const navigation = useNavigation();

  // const { setLoggedInUser, loggedInUser } = useContext(UserContext);

  const valSchema = Yup.object({
    username: Yup.string()
      .min(2, "Must be at least 2 characters")
      .max(8, "no more than 8 characters")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(4, "Password shoudl be more than 4 chars")
      .max(10, "Password should not exceed 10 chars")
      .matches(/\w*[a-z]\w*/, "Password must have a small letter")
      .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
      .matches(/\d/, "Password must have a number")
      .required(),
    profile: Yup.string().required("Please enter some text"),
  });

  return (
    <View style={styles.inputContainer}>
      <Formik
        initialValues={{
          firstName: "",
          profile: "",
          username: "",
          password: "",
          email: "",
        }}
        validationSchema={valSchema}
        onSubmit={(values) =>
          createUserWithEmailAndPassword(auth, values.email, values.password)
            .then(async (userCredentials) => {
              const user = userCredentials.user;

              await updateProfile(user, { displayName: values.username });

              var body = { username: values.username, profile: values.profile };

              await axios({
                method: "post",
                url: "https://goalgetter-backend.herokuapp.com/api/users",
                data: body,
              }).catch(function (error) {
                console.log(error);
              });

              navigation.navigate("Nav", { screen: "Profile" });
              return user;
            })

            .catch((error) => alert(error.message))
        }
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <KeyboardAvoidingView style={styles.container} behaviour="padding">
            <View>
              <TextInput
                id="email"
                name="email"
                placeholder="email"
                value={values.email}
                onChange={handleChange("email")}
                style={styles.input}
              />
              <Text>{touched.email && errors.email}</Text>
            </View>

            <View>
              <TextInput
                id="username"
                name="username"
                placeholder="username"
                value={values.username}
                onChange={handleChange("username")}
                style={styles.input}
              />
              <Text>{touched.username && errors.username}</Text>
              <TextInput
                id="profile"
                name="profile"
                placeholder="profile"
                value={values.profile}
                onChange={handleChange("profile")}
                style={styles.input}
              ></TextInput>
              <TextInput
                id="password"
                name="password"
                placeholder="password"
                value={values.password}
                onChange={handleChange("password")}
                style={styles.input}
                secureTextEntry
              ></TextInput>
              <Text>
                {`
                Password should have: One Capital letter
                             One Number 
                             At least 4 characters Login
                             Maximum 10 characters
                `}
              </Text>
              <Text>{touched.password && errors.password}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {},
  titleText: {
    padding: 20,
  },

  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },

  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  registerText: {
    padding: 20,
  },
});
