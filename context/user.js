import React from "react";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
export const UserContext = React.createContext();
import { useNavigation} from "@react-navigation/native";

export const UserProvider = (props) => {

  const navigation = useNavigation();


  const [loggedInUser, setLoggedInUser] = useState(false);
  console.log(loggedInUser)



  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {

        console.log(user)
        setLoggedInUser(true);
      }
       
      // } else {
      //   setLoggedInUser(false)
      // }
    });
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {props.children}
    </UserContext.Provider>
  );
};
