import { Text, View, StyleSheet, TextInput, Pressable, Image } from "react-native";
import { useContext, useState } from "react";
import { Link } from "expo-router";
import Alert from '../Components/alertComponent';
import { AuthContext } from "./AuthContext";
import AdminSignup from "../Components/AdminSignup";
import { useNavigation } from '@react-navigation/native';

export default function AdminAuth() {
    const navigation = useNavigation();
    const { AdminLogin } = useContext(AuthContext);
    const [currentScreen, setCurrentScreen] = useState(true);
    const [payload, setPayload] = useState({
        emailormobile: "",
        password: ""
    })
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData] = useState({
        color: '',
        backgroundColor: '',
        text: '',
    })

    const handlePress = () => {
        setCurrentScreen(false);
    }
    const DisplayAlert = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }

    const handleErrorResponse = (response) => {
        setAlertData({
            color: '#721c24',
            backgroundColor: '#f8d7da',
            text: 'Invalid username or password',
        });
        DisplayAlert();

    };

    const handleSubmit = async () => {
        try {
            const ack = await AdminLogin(payload);
            if (ack.status === 200) {
                navigation.navigate('index');
            } else {
                handleErrorResponse(ack);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={styles.container}>
            {
                showAlert &&
                <Alert color={alertData.color} backgroundColor={alertData.backgroundColor} data={alertData.text} />
            }


            {

                currentScreen &&
                <>

                    <Image source={require('../assets/admin_login.png')} style={styles.LoginGraphic}/>
                    {/* <Image
                        source={require("../assets/jashanzLogo.png")}
                        style={{ width: 150, height: 150 }}
                    /> */}

                    <View style={styles.loginBox}>
                        <TextInput
                            placeholder="Email or Mobile No"
                            style={styles.input}
                            onChangeText={text => setPayload({ ...payload, emailormobile: text })}
                        />
                        <TextInput
                            placeholder="Password"
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={text => setPayload({ ...payload, password: text })}
                        />
                        <View style={styles.loginBottom}>
                            <Text style={styles.text}>
                                Don't have and Account ?{" "}

                                <Text style={styles.linkText} onPress={handlePress}>Register Here</Text>

                            </Text>
                            <Pressable style={styles.btn} onPress={handleSubmit}>
                                <Text style={styles.btn_text} >Submit</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            }
            {
                !currentScreen &&
                <AdminSignup setCurrentScreen={setCurrentScreen} />
            }


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
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
        fontSize:17,
        fontFamily:'Monster',
      },

    linkText: {
        fontSize: 18,
        color: "#007BFF",
        fontWeight:"700",
        fontFamily:"Monster",

    },
    btn: {
        backgroundColor: "#007BFF",
        borderRadius: 8,
        width: 200,
        alignItems: "center",
        justifyContent: "center",
        height: 60,
    },
    btn_text:{
        fontSize: 18,
        color:"white",
        fontWeight:"700",

    }
});
