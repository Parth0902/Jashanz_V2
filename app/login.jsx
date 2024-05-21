import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { useContext, useState } from "react";
import { Link,useNavigation } from "expo-router";
import Alert from "../Components/alertComponent";
import Signup from "../Components/SignUpDummy.jsx";
import { AuthContext } from "./AuthContext";
import { AntDesign } from "@expo/vector-icons";

export default function Login() {
  const { UserLogin } = useContext(AuthContext);
  const [currentScreen, setCurrentScreen] = useState(true);
  const [payload, setPayload] = useState({
    emailormobile: "",
    password: "",
  });
  const navigation =useNavigation();
  const [showAlert, setShowAlert] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [alertData, setAlertData] = useState({
    color: "",
    backgroundColor: "",
    text: "",
  });

  const DisplayAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handlePress = () => {
    setCurrentScreen(false);
  };

  const handleToggle = () => {
    setShowAdmin(!showAdmin);
  };

  const handleErrorResponse = (response) => {
    // Assuming your API might return a structured error message in some cases
    let errorMessage = "Invalid username or password"; // Default message
    if (response && response.error && response.msg) {
      // If the response contains a custom error message
      errorMessage = response.msg;
    }
  
    setAlertData({
      color: "#721c24",
      backgroundColor: "#f8d7da",
      text: errorMessage,
    });
    DisplayAlert();
  };

  const handleSubmit = async () => {
    try {
      const ack = await UserLogin(payload);
      if(ack.status===403){
        navigation.navigate('login')
      }
      // Ensure ack is defined and check status or existence of data
      if (ack && ack.data && ack.status === 200) {
        console.log("Login successful", ack.data);
      } else {
        // This could be an indication of a problem with the API call
        handleErrorResponse({ error: true, msg: 'Invalid username or password' });
      }
    } catch (err) {
      console.log("Error during login: ", err);
      handleErrorResponse(err);
    }
  };
  
  

  return (
    <View style={styles.container}>
      {showAlert && (
        <Alert
          color={alertData.color}
          backgroundColor={alertData.backgroundColor}
          data={alertData.text}
        />
      )}

      <View style={styles.hiddenMenue}>
        <AntDesign
          name="menufold"
          size={24}
          color="black"
          onPress={handleToggle}
        />

        {showAdmin && (
          <Link style={styles.goToAdmin} href={"/adminAuth"}>
            <Text style={styles.goToAdminText}>Admin Login</Text>
          </Link>
        )}
      </View>

      {currentScreen && (
        <>
          {/* <Image
            source={require("../assets/jashanzLogo.png")}
            style={{ width: 120, height: 120 }}
          /> */}

          <View style={styles.loginBox}>
          <Image source={require('../assets/Login_graphic_2.png')} style={styles.LoginGraphic}/>
            <TextInput
              placeholder="Email or Mobile No"
              style={styles.input}
              onChangeText={(text) =>
                setPayload({ ...payload, emailormobile: text })
              }
            />
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(text) =>
                setPayload({ ...payload, password: text })
              }
            />
            <View style={styles.loginBottom}>
              <Text style={styles.text}>
                Don't have and Account ?{" "}
                <Text style={styles.linkText} onPress={handlePress}>
                  Register Here
                </Text>
              </Text>
              <Pressable style={styles.btn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
      {!currentScreen && <Signup setCurrentScreen={setCurrentScreen} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    backgroundColor: "#EEFDFF",
  },
  loginBox: {
    gap: 35,
    justifyContent:'center',
    alignItems:'center'
  },
  input: {
    width: 340, 
    height: 60,
    borderWidth: 1,
    borderColor:"#007BFF", 
    borderRadius: 6,
    paddingHorizontal: 20,
  },
  LoginGraphic:{
    marginTop:30,
    height:300,
    width:362,
    
  },
  loginBottom: {
    gap: 20,
    width: "100%",
    alignItems: "center",
  },
  text:{
    fontSize:16,
    fontFamily:'Monster',
    fontWeight:"500",
  },
  linkText: {
    fontSize: 17,
    color: "#007BFF",
    fontWeight:"700",
  },
  btn: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  hiddenMenue: {
    position: "absolute",
    top: 10,
    right: 10,
    alignItems: "flex-end",
  },
  goToAdmin: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 5,
  },
  goToAdminText: {
    fontWeight: "400",
    fontSize: 12,
  },
  submitText:{
    fontSize: 18,
    color:"white",
    fontWeight:"700",
  }
});
