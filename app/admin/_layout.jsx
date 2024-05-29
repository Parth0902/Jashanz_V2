import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Tabs } from "expo-router/tabs";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../AuthContext";
import { AdminContext } from "../AdminContext";
import { Redirect } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
const { url } = process.env;
export default function Layout() {
  // Define a custom header component

  const [isLogout, setIsLogout] = useState(false);
  const { Token, logout, currentAdmin,IsAdmin } = useContext(AuthContext);
  const {
    setAdminId,
    adminId,
    setRequests,
    setAllRequests,
    countR,
    setCountR,
    setAdminInfo
  } = useContext(AdminContext);

  const handleLogout = () => {
    logout();
    setIsLogout(true);
  };


  useEffect(() => {
    const fetchAdminId = async () => {
      let headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${Token}`,
      };
      console.log(currentAdmin);
      let reqOptions1 = {
        url: `${url}/admin/add-event/findadminbyemail/${currentAdmin}`,
        method: "GET",
        headers: headersList,
      };
      if(IsAdmin){
        const res = await axios.request(reqOptions1);
        if (res.status === 200) {
          setAdminId(res.data.id);
          setAdminInfo(res.data);
        }
      }
    };
    if(currentAdmin){
      fetchAdminId();
    }
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      let headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${Token}`,
      };

    
      if (adminId) {
          let response = await fetch( `${url}/bookings/receiverequest/${adminId}`, { 
            method: "GET",
            headers: headersList
          });
  
        if (response.status === 200) {
            let data = await response.text()
            console.log(data);
            const PendingReqs =data.filter(
            (request) => request.bookingStatus === "PENDING"
          );
          setRequests(PendingReqs);
          console.log(PendingReqs.length);
          setCountR(PendingReqs.length);
          setAllRequests(response.data);
        }
      }
    };
    fetchRequests();
  }, [adminId]);

  if (isLogout) {
    return <Redirect href={"/"} />;
  }

  const CustomHeader = ({ handleLogout }) => (
    <SafeAreaView style={styles.profileBox}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/JashanzLogo.jpeg")}
          style={styles.headerLogo}
        />
        <AntDesign
          name="logout"
          size={24}
          color="black"
          onPress={handleLogout}
        />
      </View>
      <Toast style={{ elevation: 3, zIndex: 1000 }} />
    </SafeAreaView>
  );

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => (
            <Ionicons name="person-circle-outline" size={26} color="black" />
          ),
          tabBarItemStyle: {
            gap: 5,
            paddingVertical: 7,
          },
          tabBarStyle: {
            height: 65,
          },
          title: "Profile",
          // Set custom header for the tab
          header: () => <CustomHeader handleLogout={handleLogout} />,
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="form"
        options={{
          tabBarLabel: "Add event",
          tabBarIcon: () => <AntDesign name="form" size={24} color="black" />,
          tabBarItemStyle: {
            gap: 5,
            paddingVertical: 7,
          },
          tabBarStyle: {
            height: 65,
          },
          title: "Add Event",
          // Set custom header for the tab
          header: () => <CustomHeader handleLogout={handleLogout} />,
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="event"
        options={{
          tabBarLabel: "My Event",
          tabBarIcon: () => (
            <MaterialIcons name="event-available" size={26} color="black" />
          ),
          tabBarItemStyle: {
            gap: 5,
            paddingVertical: 7,
          },
          tabBarStyle: {
            height: 65,
          },
          title: "My Event",
          // Set custom header for the tab
          header: () => <CustomHeader handleLogout={handleLogout} />,
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="request"
        options={{
          tabBarLabel: () => (
            <View style={{ alignItems: 'center',gap:7 }}>
              <View style={{ flexDirection: "row",position:'relative', alignItems: "center" }}>
                  <Text style={{ color: "red", fontSize: 12,position:'absolute',bottom:22,right:0}}>{countR}</Text>
                  <MaterialIcons name="chat" size={24} color="black" />
              </View>
              <Text style={{ fontSize: 10,color:'gray' }}>Requests</Text>
            </View>
          ),
          tabBarIcon: () => null, // This line ensures no additional icon is rendered, keeping your custom layout clean
          tabBarItemStyle: {
            gap: 5,
            paddingVertical: 7,
          },
          tabBarStyle: {
            height: 65, // You might want to adjust this if your text or layout appears clipped
          },
          title: "Request",
          // Set custom header for the tab
          header: () => <CustomHeader handleLogout={handleLogout} />,
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}

// Define styles for your custom header
const styles = StyleSheet.create({
  headerLogo: {
    height: 30,
    width: 120,
  },
  profile: {
    position: "relative",
    bottom: 1,
  },
  profileBox: {
    flex: 1,
    paddingBottom: 65,
    backgroundColor: "white",
    elevation: 5, // Set the elevation to create a shadow effect
    shadowColor: "black", // Set the shadow color
    shadowOffset: { width: 0, height: 2 }, // Set the shadow offset
    shadowOpacity: 0.2, // Set the shadow opacity
    shadowRadius: 4, // Set the shadow radius
  },
  profileContainer: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    elevation: 1,
  },
  profileText: {
    color: "black",
  },
});
