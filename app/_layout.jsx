import { Stack } from "expo-router";
import { AuthContextProvider } from "./AuthContext";
import { View, StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5,AntDesign } from '@expo/vector-icons';
import { EventProvider } from "./EventContext";
import { AdminProvider } from "./AdminContext";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import { useNavigation } from "expo-router";

const Profile = () => {
  const { logout,Token } = useContext(AuthContext);
  const navigation = useNavigation();
  const handleLogout = () => {
    logout();
  }
  const handleRedirect=()=>{
    navigation.navigate('userBookings');

  }
  return (
    <SafeAreaView style={styles.profileBox}>
      <View style={styles.profileContainer}>
        <Image source={require('../assets/JashanzLogo.jpeg')} style={styles.headerLogo} />
        {
          Token &&
          <View style={{gap:20,flexDirection:'row'}}>
            <AntDesign
              name="book"
              size={26}
              color="black"
              onPress={handleRedirect}
            />

            <AntDesign
              name="logout"
              size={24}
              color="black"
              onPress={handleLogout}
            />
          </View>
        }
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
              options={{ header: () => <Profile /> }}
            />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
            <Stack.Screen name="tabs" options={{ headerShown: false }} />
            <Stack.Screen name="Otp" options={{ headerShown: true }} />
            <Stack.Screen name="contactUs" options={{ headerShown: true }} />
            <Stack.Screen name="PrivacyPolicy" options={{ headerShown: true }} />
            <Stack.Screen name="RefundPolicy" options={{ headerShown: true }} />
            <Stack.Screen name="TermsAndConditions" options={{ headerShown: true }} />
          </Stack>
        </EventProvider>
      </AdminProvider>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    height: 30,
    width: 120,
  },
  profile: {
    position: 'relative',
    bottom: 1,
  },
  profileBox: {
    flex: 1,
    paddingBottom: 65,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  profileText: {
    color: 'black',
  }
});
