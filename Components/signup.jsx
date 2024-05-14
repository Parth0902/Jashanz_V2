import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import { Link, useNavigation } from "expo-router";
import { useState, useEffect, useContext } from "react";
// import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";
import Otp from "./otp";
const {url}= process.env;

const Signup = ({ setCurrentScreen }) => {
  // payload structure
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: "ROLE_USER",
    Cpassword: "",
  });

  // error object for input validation
  const [error, setError] = useState({
    nameError: false,
    mailError: false,
    phoneNoErr: false,
    passwordErr: false,
    CpasswordErr: false,
  });

  // const countries = ["Admin", "user"];
  const [otp, setOtp] = useState(null);
  const [viewOtp, setViewOtp] = useState(false);
  const handleSubmit1 = async () => {
    setError({
      nameError: false,
      mailError: false,
      phoneNoErr: false,
      passwordErr: false,
      CpasswordErr: false,
    });
    try {
      if (validate() === false) {
        let headersList = {
          Accept: "*/*",
        };

        let reqOptions = {
          url: `${url}/api/generateUserOtp/${payload.mobileNumber}`,
          method: "GET",
          headers: headersList,
        };

        await axios.request(reqOptions);
        setViewOtp(true);
      } else {
        throw "Invalid Input";
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validate = () => {
    let flag = false;
    if (payload.name === "") {
      setError((prev) => ({ ...prev, nameError: true }));
      flag = true;
    }
    if (
      !payload.email.includes("@") ||
      payload.email.toLocaleLowerCase() !== payload.email ||
      payload.email === ""
    ) {
      setError((prev) => ({ ...prev, mailError: true }));
      flag = true;
    }
    if (payload.mobileNumber.length != 10) {
      setError((prev) => ({ ...prev, phoneNoErr: true }));
      flag = true;
    }
    if (payload.password === "") {
      setError((prev) => ({ ...prev, passwordErr: true }));
      flag = true;
    }
    if (payload.password !== payload.Cpassword) {
      setError((prev) => ({ ...prev, CpasswordErr: true }));
      flag = true;
    }
    return flag;
  };

  const handlePress = () => {
    setCurrentScreen(true);
  };

  return (
    <View style={styles.container}>
      {viewOtp === false && (
        <View style={styles.loginBox}>
          <View style={styles.box}>
            <TextInput
              placeholder="UserName"
              keyboardType="default"
              style={styles.input}
              onChangeText={(text) => setPayload({ ...payload, name: text })}
            />
            {error.nameError && (
              <Text style={styles.errText}>Invalid username</Text>
            )}
          </View>

          <View style={styles.box}>
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              style={styles.input}
              onChangeText={(text) => setPayload({ ...payload, email: text })}
            />
            {error.mailError && (
              <Text style={styles.errText}>Invalid Email</Text>
            )}
          </View>

          <View style={styles.box}>
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              style={styles.input}
              onChangeText={(text) =>
                setPayload({ ...payload, mobileNumber: text })
              }
            />
            {error.phoneNoErr && (
              <Text style={styles.errText}>Invalid Phone Number</Text>
            )}
          </View>

          <View style={styles.box}>
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(text) =>
                setPayload({ ...payload, password: text })
              }
            />
            {error.passwordErr && (
              <Text style={styles.errText}>Invalid Password</Text>
            )}
          </View>

          <View style={styles.box}>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(text) =>
                setPayload({ ...payload, Cpassword: text })
              }
            />
            {error.CpasswordErr && (
              <Text style={styles.errText}>
                Password and Confirm Passowrd don't match{" "}
              </Text>
            )}
          </View>

          {/* <SelectDropdown
          data={countries}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
           setPayload({...payload,role:selectedItem})
          }}
          defaultButtonText="Select role"
          buttonStyle={styles.select}
        /> */}
          <View style={styles.loginBottom}>
            <Text style={styles.text}>
              Already Have an Account ?{" "}
              <Text style={styles.linkText1} onPress={handlePress}>
                Login Here
              </Text>
            </Text>
            <Pressable style={styles.btn} onPress={handleSubmit1}>
              <Text style={styles.btn_text}>Submit</Text>
            </Pressable>
          </View>
        </View>
      )}

      {viewOtp && <Otp setViewOtp={setViewOtp} payload={payload} setCurrentScreen={setCurrentScreen} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBox: {
    gap: 20,
  },
  input: {
    width: 340, 
    height: 60,
    borderWidth: 1,
    borderColor:"#007BFF", 
    borderRadius: 6,
    paddingHorizontal: 20,
  },
  loginBottom: {
    gap: 25,
    width: 'full',
    alignItems: "center",
  },
  text: {
    fontSize:15,
    fontFamily:'Monster',
  },
  linkText1: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight:"600",
  },
  btn: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  btn_text: {
    color: "white",
  },
  select: {
    width: 270,
    borderRadius: 30,
  },
  box: {
    alignItems: "start",
    gap: 2,
  },
  errText: {
    color: "red",
    paddingLeft: 15,
    letterSpacing: 1,
  },
});

export default Signup;
