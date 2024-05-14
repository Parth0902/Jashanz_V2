import React,{useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import { Stack} from 'expo-router';
import { EventContext } from "../EventContext";
const Layout = () => {
    const { eventDataContext } = useContext(EventContext);                
    return (
        <Stack >
           <Stack.Screen name="eventPage" options={{title:eventDataContext.eventType}}></Stack.Screen>
        </Stack>
    );
}

const styles = StyleSheet.create({})

export default Layout;
