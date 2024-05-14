import React, { useContext, useEffect, useState,useCallback } from "react";
import { View, StyleSheet } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from "expo-font";
import { AuthContextProvider, AuthContext } from "./AuthContext";
import Login from "./login";
import Index from "./tabs/index";
import { useNavigation } from '@react-navigation/native';
// import Admin from "./admin/index";
import { Redirect } from "expo-router";
// Renamed from Index to App for clarity
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'; 
SplashScreen.preventAutoHideAsync();

const App = () => {
  
 
  return(
    <GestureHandlerRootView>
    <AuthenticationGate/>
    </GestureHandlerRootView>
  ) 
};

// Renamed from Layout to AuthenticationGate for clarity
const AuthenticationGate = () => {
  const { Token } = useContext(AuthContext);
  const navigation = useNavigation();
  const {IsAdmin}=useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [fontsLoaded, fontError] = useFonts({
    'Monster': require('../assets/fonts/static/Montserrat-Regular.ttf'),
    'Dance':require('../assets/fonts/static/DancingScript-Regular.ttf'),
    'Roboto':require('../assets/fonts/Roboto-Regular.ttf'),
    'Popins':require('../assets/fonts/Poppins-Medium.ttf'),
    'RobotoMed':require('../assets/fonts/Roboto-Medium.ttf'),
    'Opensans':require('../assets/fonts/static/OpenSans-Medium.ttf'),
    

  });
   
  useEffect(() => {
    // Update isAuthenticated when Token changes
    setIsAuthenticated(!!Token);
  }, [Token]);
  

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {isAuthenticated ? <Gateway IsAdmin={IsAdmin}/>:<Login /> }
    </View>
  );
};

const Gateway=({IsAdmin})=>{

  if(IsAdmin){
    return <Redirect href={'/admin'}/>
  }
  return(
      <Index/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
