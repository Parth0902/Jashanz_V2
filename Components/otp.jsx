import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native'
import React, { useContext, useState, useRef } from 'react'
import { Link, useNavigation } from "expo-router";
import Alert from '../Components/alertComponent'
import { AuthContext } from '../app/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function index({ setViewOtp,payload,setCurrentScreen }) {
    const navigation = useNavigation();
    const [DisplayAlert, setAlert] = useState(false);
    const [alertData, setAlertData] = useState({
        color: '',
        backgroundColor: '',
        text: '',
    })
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Move focus to the next box if the current one has a value
        if (value && index < newOtp.length - 1) {
            inputs.current[index + 1].focus();
        }
    };
    const handlePress=()=>
    {
            setViewOtp(false);
            setCurrentScreen(true);
            
    }
    const { UserRegister, currentUser } = useContext(AuthContext);

    const showAlert = () => {
        setAlert(true);
        setTimeout(() => {
            setAlert(false);
            navigation.navigate('index');

        }, 3000);
    }
    const handleSubmit = async () => {
        try {
            const input = otp.join('');
            const ack = await UserRegister(payload, input);
            if (ack.status === 200) {
                setAlertData({
                    color: '#155724',
                    backgroundColor: '#c3e6cb',
                    text: "User registerd successfully",
                })
                showAlert();
            }
            else {
                setAlertData({
                    color: '#721c24',
                    backgroundColor: '#f8d7da',
                    text: "Invalid Otp"
                })
                showAlert();
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (

        <View style={styles.container}>
            {
                DisplayAlert &&
                <Alert data={alertData.text} backgroundColor={alertData.backgroundColor} color={alertData.color} />
            }

            <Text style={styles.headerText}>Enter the Opt send to your Mobile</Text>
            <View style={styles.loginBox}>

                <View style={styles.OtpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={styles.box}
                            maxLength={1}
                            keyboardType="numeric"
                            onChangeText={(value) => handleOtpChange(value, index)}
                            value={digit}
                            ref={(input) => {
                                inputs.current[index] = input;
                            }}
                        />
                    ))}
                </View>
                <View style={styles.loginBottom}>
                    <Pressable style={styles.btn} onPress={handleSubmit}><Text>Submit</Text></Pressable>
                </View>
                <Text style={styles.text}>
                    Not recevied Otp ?{" "}
                    <Text style={styles.linkText} >
                        Resend Otp
                    </Text>
                </Text>

                <Text style={styles.backBtn} onPress={handlePress}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                     Login Screen
                </Text>


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 50,
    },
    loginBox: {
        gap: 20,
        alignItems: 'center',
        width: 370,
        height: 270,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
    },
    input: {
        borderColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        width: 270,
        backgroundColor: "white",
        borderRadius: 30,
    },
    loginBottom: {
        gap: 15,
        width: 270,
        alignItems: 'center'
    },
    text: {
        fontSize: 15,
        // fontWeight:400,

    },
    linkText: {
        fontSize: 15,
        fontWeight: 500,
        color: "#007BFF",

    },
    btn: {
        backgroundColor: "#007BFF",
        borderRadius: 6,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
    },
    OtpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        borderWidth: 1,
        borderColor: 'black',
        width: 40,
        height: 40,
        margin: 10,
        textAlign: 'center',
        fontSize: 20,
    },
    backBtn:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        gap:4,
        fontSize: 15,
        fontWeight: 500,
        color: "#007BFF",

    }
});
