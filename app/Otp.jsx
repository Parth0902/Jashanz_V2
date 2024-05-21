import React, { useState, useRef,useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert,Pressable } from 'react-native';
import { AuthContext } from './AuthContext';
import Toast from 'react-native-toast-message';

const OtpInput = () => {
  const [otp, setOtp] = useState(['', '', '', '', '','']);
  const inputRefs = useRef([]);
  const { userOtp,userRegisterPayload,user,UserRegister} = useContext(AuthContext);

  const handleResendOtp = async () => {
    try { 
      const ack = await userOtp(userRegisterPayload);
      if (ack.status === 200) {
        console.log('Otp sent successfully');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
    }
  };

  const handleChange = (text, index) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (index === 5 && text) {
      inputRefs.current[index].blur();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async() => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      console.log('OTP entered is:', otpValue);
      const ack= await UserRegister(userRegisterPayload,otpValue);
      console.log(ack);
      if(ack.status===200){
        console.log("User registered successfully");
        Toast.show({
          type: 'success',
          text1: 'User registered successfully',
        });
      }
      if(ack.status===403){
        Toast.show({
          type: 'error',
          text1: 'Incorrect OTP',
        });
      }
    } else {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>One Time-Password</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>
      <Text style={{fontSize:16, paddingTop:10,paddingBottom:10,fontFamily:"Popins"}}>Enter the otp sent by Jshanz on your registered mobile number</Text>
      <Pressable onPress={handleResendOtp} style={{paddingTop:10,paddingBottom:10, width:"87%"}}>
        <Text style={{fontSize:18,fontFamily:"Popins",color:'#007BFF'}}>Resend OTP</Text>
      </Pressable>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    // justifyContent: 'center',
  },
  title: {
    marginTop: 250,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    width: 55,
    height: 60,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default OtpInput;
