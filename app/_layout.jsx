import { Stack } from "expo-router";
import { AuthContextProvider, AuthContext } from "./AuthContext";
import { View, StyleSheet, Text,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { EventProvider } from "./EventContext";
import { AdminProvider } from "./AdminContext";

const Profile = () => {
  return (
    <SafeAreaView style={styles.profileBox}>
      <View style={styles.profileContainer}>
        <Image source={require('../assets/JashanzLogo.jpeg')} style={styles.headerLogo}/>
        <FontAwesome5 name="user-circle" size={40} color="#4E9BD1"  style={styles.profile}/>
      </View>
    </SafeAreaView>
  );
};

export default function RootLayout() {
  return (

      <AuthContextProvider>
        <AdminProvider>
        <EventProvider>
          <Stack>
            <Stack.Screen
              name="index"
              options={{ header: () => <Profile/> }}
            ></Stack.Screen>

            <Stack.Screen name="admin" options={{headerShown:false}}></Stack.Screen>
            <Stack.Screen name="tabs" options={{headerShown:false}}></Stack.Screen>
            
          </Stack>
        </EventProvider>
        </AdminProvider>
      </AuthContextProvider>

  );
}

const styles = StyleSheet.create({
  headerLogo:{
    height:30,
    width:120,
  },
  profile:{
    position:'relative',
    bottom:1,

  },
  profileBox:{
    flex:1,
    paddingBottom:65,
    elevation: 5, // Set the elevation to create a shadow effect
    shadowColor: 'black', // Set the shadow color
    shadowOffset: { width: 0, height: 2 }, // Set the shadow offset
    shadowOpacity: 0.2, // Set the shadow opacity
    shadowRadius: 4, // Set the shadow radius
 
  },
  profileContainer:{
    height:70,
    flexDirection:'row',
    alignItems:"center",
    justifyContent:"space-between",
    paddingHorizontal:30,
  },
  profileText:{
    color:'black',
    
  }
});
