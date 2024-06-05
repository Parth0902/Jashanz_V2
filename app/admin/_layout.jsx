import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Tabs } from "expo-router/tabs";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../AuthContext";
import { AdminContext } from "../AdminContext";
import { Redirect } from "expo-router";
import { useToast } from '../ToastContext';
import axios from "axios";
const { url } = process.env;

export default function Layout() {
  const [isLogout, setIsLogout] = useState(false);
  const { Token, logout, currentAdmin, IsAdmin } = useContext(AuthContext);
  const {
    setAdminId,
    adminId,
    setRequests,
    setAllRequests,
    countR,
    setCountR,
    setAdminInfo,
    refresh,
    setRefresh
  } = useContext(AdminContext);
  const { showSuccess, showError, showWarn } = useToast();

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
      if (IsAdmin) {
        const res = await axios.request(reqOptions1);
        if (res.status === 200) {
          setAdminId(res.data.id);
          setAdminInfo(res.data);
        }
      }
    };

    if (currentAdmin) {
      fetchAdminId();
    }
  }, [currentAdmin, IsAdmin, Token]);

 

  const fetchRequests = async () => {
    let headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${Token}`,
    };

    if (adminId) {
      let response = await fetch(`${url}/bookings/receiverequest/${adminId}`, {
        method: "GET",
        headers: headersList
      });

      if (response.status === 200) {
        let data = await response.text();
        data = JSON.parse(data);

        const PendingReqs = data.filter(
          (request) => request.bookingStatus === "PENDING"
        );
        setRequests(data);
        setCountR(PendingReqs.length);
        setAllRequests(data);
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [adminId, Token]);

  if (isLogout) {
    return <Redirect href={"/"} />;
  }

  const CustomHeader = ({ handleLogout, showRefresh }) => (
    <SafeAreaView style={styles.profileBox}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/JashanzLogo.jpeg")}
          style={styles.headerLogo}
        />
        <View style={styles.iconContainer}>
          {showRefresh && (
            <MaterialIcons
              name="refresh"
              size={24}
              color="black"
              onPress={() => {
                console.log(refresh);
                setRefresh(!refresh);
              }}
              style={styles.refreshIcon}
            />
          )}
          <AntDesign
            name="logout"
            size={24}
            color="black"
            onPress={handleLogout}
          />
        </View>
      </View>
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
          header: () => <CustomHeader handleLogout={handleLogout} showRefresh={false} />,
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
          header: () => <CustomHeader handleLogout={handleLogout} showRefresh={false} />,
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
          header: () => <CustomHeader handleLogout={handleLogout} showRefresh={true} />,
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="request"
        options={{
          tabBarLabel: () => (
            <View style={{ alignItems: 'center', gap: 7 }}>
              <View style={{ flexDirection: "row", position: 'relative', alignItems: "center" }}>
                <Text style={{ color: "red", fontSize: 12, position: 'absolute', bottom: 22, right: 0 }}>{countR}</Text>
                <MaterialIcons name="chat" size={24} color="black" />
              </View>
              <Text style={{ fontSize: 10, color: 'gray' }}>Requests</Text>
            </View>
          ),
          tabBarIcon: () => null,
          tabBarItemStyle: {
            gap: 5,
            paddingVertical: 7,
          },
          tabBarStyle: {
            height: 65,
          },
          title: "Request",
          header: () => <CustomHeader handleLogout={handleLogout} showRefresh={true} />,
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    height: 30,
    width: 120,
  },
  profileBox: {
    flex: 1,
    paddingBottom: 65,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileContainer: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    elevation: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshIcon: {
    marginRight: 15, // Adjust the spacing as needed
  },
});
