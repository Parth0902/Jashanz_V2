import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Pressable,ScrollView } from 'react-native';
import { AuthContext } from "../AuthContext";
const { url } = process.env;
import { useNavigation } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import AdminGuide
 from '../../Components/AdminGuide';
const Index = () => {
    const { logout, Token, currentAdmin } = useContext(AuthContext);
    const [AdminData, setAdminData] = useState({});
    const [isLogout, setIsLogout] = useState(false);
   const navigation = useNavigation();
    useEffect(() => {
        const FetchAdminData = async () => {
            try {
                let headersList = {
                    "Accept": "*/*",
                    "Authorization": `Bearer ${Token}`
                }

                let reqOptions = {
                    url: `${url}/admin/add-event/findadminbyemail/${currentAdmin}`,
                    method: "GET",
                    headers: headersList,
                }
                if(currentAdmin){
                    let response = await axios.request(reqOptions);
                    console.log("admin Index :",response.status);
                    // console.log(response.data);
                    setAdminData(response.data); 
                }
            } catch (err) {
                console.log(err);
            }
        }

        FetchAdminData();

    }, []);

  
    return (
        <View style={styles.container}>
            {/* <AdminNav/> */}
            <ScrollView>
                <View style={styles.InnerContainer}>
                    <Text style={styles.headText}><Text style={{color:"#65EFF6"}}>Welcome</Text> to Your Admin Dashboard!</Text>
                  
                    <View style={styles.box}>
                        <Ionicons name="person-circle-outline" size={150} color="black" />

                        <View style={styles.boxRow}>
                            <MaterialCommunityIcons name="office-building" size={24} color="black" />
                            <Text style={styles.boxTxt}>
                                {AdminData.firmName}
                            </Text>
                        </View>

                        <View style={styles.boxRow}>
                            <MaterialIcons name="account-box" size={24} color="black" />
                            <Text  style={styles.boxTxt}>
                                {AdminData.specialization}
                            </Text>
                        </View >

                        <View style={styles.boxRow}>
                            <AntDesign name="phone" size={24} color="black" />
                            <Text  style={styles.boxTxt}>
                                {AdminData.mobileNumber}
                            </Text>
                        </View>

                        <View style={styles.boxRow}>
                            <AntDesign name="phone" size={24} color="black" />
                            <Text style={styles.boxTxt} >
                                {AdminData.alternateMobileNumber}
                            </Text>
                        </View>
                        <View style={styles.boxRow}>
                            <Feather name="mail" size={24} color="black" />
                            <Text style={styles.boxTxt} >
                                {AdminData.email}
                            </Text>
                        </View>
                    </View>

                    <AdminGuide/>

                    <View style={styles.impLinks}>
                        <Text style={{fontFamily:"Popins",fontSize:24,textAlign:'center'}}>Important Pages</Text>
                        <Pressable onPress={() => navigation.navigate('contactUs')}>
                            <Text style={{fontFamily:"Popins",fontSize:18,color:'#007BFF'}}>1. Contact Us</Text>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('PrivacyPolicy')}>
                            <Text style={{fontFamily:"Popins",fontSize:18,color:'#007BFF'}}>2. Privacy Policy</Text>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('RefundPolicy')}>
                            <Text style={{fontFamily:"Popins",fontSize:18,color:'#007BFF'}}>3. Refund Policy</Text>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('TermsAndConditions')}>
                            <Text style={{fontFamily:"Popins",fontSize:18,color:'#007BFF'}}>4. Terms and Conditions</Text>
                        </Pressable>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "auto",
        alignItems: "center",
        // backgroundColor: "#EEFDFF",
    },
    InnerContainer: {
        alignItems: "center",
        gap: 30,
        paddingBottom:20,
    },
    box: {
        backgroundColor: 'white',
        width: 320,
        gap: 25,
        alignItems: 'center',
        paddingHorizontal:40,
        paddingVertical:50,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderRadius:16,
    },
    boxRow: {
        flexDirection:'row',
        gap:20
    },
    boxTxt:{
        width:"80%",
        fontSize:16,
    },
    LogoutBtn:{
        backgroundColor: "#b23b3b",
        borderRadius: 8,
        width: 200,
        alignItems: "center",
        justifyContent: "center",
        height: 60,
    },
    BtnTxt:{
        color: 'white',
        fontWeight: '600'
    },
    headText: {
        textAlign: "center",
        paddingTop: 50,
        paddingBottom:30,
        fontSize: 35,
        fontWeight: "500",
        fontFamily:"Popins",
        paddingHorizontal:30,
        textShadowColor: 'rgba(0, 0, 0, 0.2)', // Text shadow color
        textShadowOffset: { width: 1, height: 1 }, // Text shadow offset
        textShadowRadius: 2, // 
      },
      impLinks:{
          width:"100%",
          padding:20,
          gap:20
      }
})

export default Index;
