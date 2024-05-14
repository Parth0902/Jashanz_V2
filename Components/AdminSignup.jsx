import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import { Link, useNavigation } from "expo-router";
import { useState, useEffect, useContext } from "react";
import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";

import Otp from "./otp";
const {url} =process.env;

const AdminSignup = ({ setCurrentScreen }) => {
    // payload structure
    const [payload, setPayload] = useState({
        name: "",
        email: "",
        mobileNumber: "",
        password: "",
        role: "user",
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
    const countries = [
        "Birthday Booking (Birthday Hall)",
        "Marriage Ceremony Booking (Banquets)",
        "Get Together / Party Booking (Party Hall)",
        "Occasion Organizers",
        "Disc Jockey (DJ's)"
    ]
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
                const otp1 = await axios.get(
                    `${url}/api/generateUserOtp/${payload.mobileNumber}`
                );
                const otp2 = otp1.data.slice(-7, -1);
                setOtp(otp2);
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
    }

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

                    {/* <SelectDropdown
                        data={countries}
                        defaultValueByIndex={1}
                        defaultValue={'Egypt'}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                        }}
                        defaultButtonText={'Choose Specialization'}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item;
                        }}
                        buttonStyle={styles.dropdown1BtnStyle}
                        buttonTextStyle={styles.dropdown1BtnTxtStyle}
                        dropdownStyle={styles.dropdown1DropdownStyle}
                        rowStyle={styles.dropdown1RowStyle}
                        rowTextStyle={styles.dropdown1RowTxtStyle}
                    /> */}

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
                            placeholder="Alternate Phone Number"
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

            {viewOtp && <Otp otp={otp} payload={payload} />}
        </View>
    );
}

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
    box: {
        alignItems: "start",
        gap: 2,
    },
    errText: {
        color: "red",
        paddingLeft: 15,
        letterSpacing: 1,
    },

    dropdown1BtnStyle: {
        width: 340, 
        height: 60,
        borderWidth: 1,
        borderRadius: 6,
        borderColor:"#007BFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
       
    },
    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left', fontSize: 13 },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF', },
    dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left', fontSize: 13 },
});


export default AdminSignup;
