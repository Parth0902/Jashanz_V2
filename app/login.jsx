import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useContext, useState } from "react";
import { Link, useNavigation } from "expo-router";
import Alert from "../Components/alertComponent";
import Signup from "../Components/SignUpDummy.jsx";
import { AuthContext } from "./AuthContext";
import { AntDesign } from "@expo/vector-icons";
import {  useToast} from "./ToastContext";




export default function Login() {
  const { UserLogin } = useContext(AuthContext);
  const [currentScreen, setCurrentScreen] = useState(true);
  const [payload, setPayload] = useState({
    emailormobile: "",
    password: "",
  });
  const { showSuccess, showError, showWarn } = useToast();
  const [isPressed, setIsPressed] = useState(false);
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [alertData, setAlertData] = useState({
    color: "",
    backgroundColor: "",
    text: "",
  });


  const handlePress = () => {
    setCurrentScreen(false);
  };

  const handleToggle = () => {
    setShowAdmin(!showAdmin);
  };

  const handleErrorResponse = (response) => {
    let errorMessage = "Invalid username or password"; 
    if (response && response.error && response.msg) {
      errorMessage = response.msg;
    }
    showError(errorMessage);
  };

  const handleSubmit = async () => {
    try {
      if(payload.emailormobile === "" || payload.password === ""){
        showWarn("Please fill all the fields");
      }else{
        const ack = await UserLogin(payload);
        if (ack && ack.data && ack.status === 200) {
          console.log("Login successful", ack.data);
        } else {
          handleErrorResponse({ error: true, msg: 'Invalid username or password' });
        }
      }
    } catch (err) {
      console.log("Error during login: ", err);
      handleErrorResponse(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {showAlert && (
          <Alert
            color={alertData.color}
            backgroundColor={alertData.backgroundColor}
            data={alertData.text}
          />
        )}

        <View style={styles.hiddenMenue}>
         
        </View>

        {currentScreen && (
          <>
            <View style={styles.loginBox}>
              <Image source={require('../assets/Login_graphic_2.png')} style={styles.LoginGraphic} />
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

                <Text style={styles.text}>
                  <Text style={styles.linkText} onPress={()=>navigation.navigate('ForgotPassword')}>
                  Forgot Password
                  </Text>
                </Text>
                <Pressable
                  style={[styles.btn, isPressed && styles.btnPressed]}
                  onPressIn={() => setIsPressed(true)}
                  onPressOut={() => setIsPressed(false)}
                  onPress={handleSubmit}>
                  <Text style={styles.submitText}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
        {!currentScreen && <Signup setCurrentScreen={setCurrentScreen} />}
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: 340,
    height: 60,
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 6,
    paddingHorizontal: 20,
  },
  LoginGraphic: {
    marginTop: 30,
    height: 300,
    width: 362,
  },
  loginBottom: {
    gap: 20,
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: 'Monster',
    fontWeight: "500",
  },
  linkText: {
    fontSize: 17,
    color: "#007BFF",
    fontWeight: "700",
  },
  btn: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },btnPressed: {
    backgroundColor: '#0056b3', // Darker blue color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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
  submitText: {
    fontSize: 18,
    color: "white",
    fontWeight: "700",
  }
});
