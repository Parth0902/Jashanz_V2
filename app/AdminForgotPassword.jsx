import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet,Pressable,Text} from 'react-native';
import { useToast } from './ToastContext';
import { useNavigation } from 'expo-router';
import ForgotPasswordOtp from './ForgotPassOtp';

const { url } = process.env;

const ForgotPassword = () => {
    const [Input, setInput] = useState('');
    const [Cpassword,setCpassword]=useState('');
    const [isPressed, setIsPressed] = useState(false);
    const [password,setPassword]=useState('');
    const { showSuccess, showError, showWarn } = useToast();
    const [Phase,setPhase]=useState("email");
    const [OtpInput,setOtpInput]=useState();
    const navigation = useNavigation();

    const handleResetPassword = async() => {
        const headersList = {
            "Accept": "*/*",
          };
          if(Input.length!==10){
            showWarn("Enter a valid mobile number");
            return;
          }
        
          try {
            const response = await fetch(`${url}/api/generateResetPasswordOtp/${Input}`, {
              method: "GET",
              headers: headersList
            });

            if(response.status === 200){
              console.log("OTP sent successfully");
                setPhase("otp");
            }

          } catch (error) {
            showError("Error in sending otp");
          }
 
    };

    const handleUpdatePassword = async() => {
        const headersList = {
            "Accept": "*/*",
          };

          if(password.length<6){
            showWarn("Password should be atleast 6 characters long");
            return;
          }

          if(password!==Cpassword){
            showWarn("Passwords do not match");
            return;
          }
        
          try {
          
            let res = await fetch(`https://backend.jashanz.com/api/verifyResetPasswordOtp/${Input}/${OtpInput}`, { 
                method: "GET",
                headers: headersList
              });

            console.log(res);
            if(res.status!==200){
              showWarn("Invalid OTP");
              return;
            }

            const response = await fetch(`${url}/api/updatePassword/${Input}/${password}`, {
              method: "POST",
              headers: headersList
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.text();
            if(response.status === 200){
                showSuccess("Password updated successfully");
            }
          } catch (error) {
            console.error("Error updating user password:", error);
          }
    };

    return (
        <View style={styles.container}>
            {
                Phase === "email" && 
                <>
                    <Text style={styles.title}>Enter the registered Mobile Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile No"
                        value={Input}
                        onChangeText={setInput}
                    />

                    <Pressable
                        style={[styles.btn, isPressed && styles.btnPressed]}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                          onPress={handleResetPassword}
                        >
                        <Text style={styles.submitText}>Submit</Text>
                    </Pressable>
                </>
            }
            {
                Phase === "otp" &&

                <ForgotPasswordOtp Input={Input}  setPhase={setPhase} setOtpInput={setOtpInput}/>
            }
            {
                Phase==="changePass" &&
                <>
                    <Text style={styles.title}>Reset the Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        keyboardType='Password'
                        secureTextEntry={true}
                        onChangeText={text=>setPassword(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        keyboardType='Password'
                        secureTextEntry={true}
                        onChangeText={text=>setCpassword(text)}
                    />
                    <Pressable
                        style={[styles.btn, isPressed && styles.btnPressed]}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}

                        onPress={handleUpdatePassword}
                        >
                        <Text style={styles.submitText}>Reset Password</Text>
                    </Pressable>
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        gap: 20,
    },
    title: {
        marginTop: 250,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
      },
    input: {
        width: 340,
        height: 60,
        borderWidth: 1,
        borderColor: "#007BFF",
        borderRadius: 6,
        paddingHorizontal: 20,
    },
    btn: {
        backgroundColor: "#007BFF",
        borderRadius: 8,
        width: 180,
        alignItems: "center",
        justifyContent: "center",
        height: 50,
      },btnPressed: {
        backgroundColor: '#0056b3', // Darker blue color
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
      },
      submitText: {
        fontSize: 18,
        color: "white",
        fontWeight: "700",
      }
});

export default ForgotPassword;