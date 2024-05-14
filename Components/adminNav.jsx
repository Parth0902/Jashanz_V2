import React from 'react';
import {View, StyleSheet,Text,Pressable} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const AdminNav = () => {
    return (
        <View style={styles.container}>
            <Pressable style={styles.navBtn}>
                <Ionicons name="person-circle-outline" size={24} color="black" />
                <Text style={styles.navBtnText}>Profile</Text>
            </Pressable>

            <Pressable style={styles.navBtn}>
                <MaterialIcons name="event-available" size={24} color="black" />
                <Text style={styles.navBtnText}>Events</Text>
            </Pressable>

            <Pressable style={styles.navBtn}>
            <MaterialIcons name="chat" size={24} color="black" />
                <Text style={styles.navBtnText}>Requests</Text>
            </Pressable>

            <Pressable style={styles.navBtn}>
                <AntDesign name="form" size={24} color="black" />
                <Text style={styles.navBtnText}>Form</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#65EFF6",
        flexDirection:'row',
        height:75,
        position:'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        paddingTop:5,
    },
    navBtn:{
        flex:1,
        justifyContent:'center',
        borderColor:"black",
        borderLeftWidth:1,
        alignItems:'center',
        paddingBottom:7,
        gap:2,
    },
    navBtnText:{
        fontSize:15,
        textAlign:'center',
        fontWeight:"700",


    }
})

export default AdminNav;
