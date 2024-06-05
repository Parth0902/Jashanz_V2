import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "./AuthContext";
import { EventContext } from "./EventContext";
import axios from "axios";
import { useToast } from "./ToastContext";
const { url } = process.env;

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { Token,getCurrentUser } = useContext(AuthContext);
  const {showError,showWarn}=useToast();

  const [noRequests, setNoRequests] = useState(false);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
          let currentUser =await getCurrentUser();
          currentUser = JSON.parse(currentUser);   
          let headersList = {
            Accept: "*/*",
            Authorization: `Bearer ${Token}`,
          };
  
          let reqOptions = {
            url: `${url}/bookings/bookingRequest/${currentUser?.id}`,
            method: "GET",
            headers: headersList,
          };
  
          let response = await axios.request(reqOptions);
          if (response.status === 200) {
            setRequests(response.data);
            setAllRequests(response.data);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
              showWarn("No requests found.");
              setNoRequests(true);
          } else {
            showError("Something went wrong. Please try again later.")
          }
        } finally {
          setLoading(false);
        }
      };
      console.log(Token);
      if( Token)
        {
            fetchRequests();
        }
    }, [Token]);

  const filterRequests = (status) => {
    if (status === "all") {
      setRequests(allRequests);
    } else {
      setRequests(
        allRequests.filter((request) => request.bookingStatus === status)
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
   <View style={{ flexDirection: "row", gap: 20, marginTop: 20 }}>
        <Pressable
          style={styles.FilterBtn}
          onPress={(e) => filterRequests("PENDING")}
        >
          <Text style={styles.btnTxt1}>PENDING</Text>
        </Pressable>
        <Pressable
          style={styles.FilterBtn}
          onPress={(e) => filterRequests("ACCEPTED")}
        >
          <Text style={styles.btnTxt2}>Accepted</Text>
        </Pressable>
        <Pressable
          style={styles.FilterBtn}
          onPress={(e) => filterRequests("REJECTED")}
        >
          <Text style={styles.btnTxt3}>Rejected</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, alignItems: "center", marginTop: 30 }}>
        {
            noRequests && 
            <Text style={styles.noRequestsText}>No requests found.</Text>
        }
        <ScrollView style={{ width: "100%", gap: 20 }}>
          {requests.map((request, id) => (
            <View
              style={{
                width: 380,
                height: 280,
                marginBottom: 30,
                shadowColor: "#000",
                backgroundColor: "white",
                borderRadius: 12,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.2,
                shadowRadius: 3.84,
                elevation: 5,
                paddingVertical: 15,
                paddingHorizontal: 20,
              }}
              key={id}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 15,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: 18,
                    color:
                      request?.bookingStatus === "ACCEPTED" ? "green" : "red",
                  }}
                >
                  {request?.bookingStatus}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 15,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "500",
                  }}
                >
                  Customer Id:{" "}
                  <Text
                    style={{ paddingLeft: 20, fontWeight: "400", fontSize: 16 }}
                  >
                    {request?.id}
                  </Text>
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "500",
                  }}
                >
                  Date :
                  <Text
                    style={{ paddingLeft: 20, fontWeight: "400", fontSize: 16 }}
                  >
                    {request?.bookingDate}
                  </Text>
                </Text>
              </View>
              <Text style={{ paddingTop: 15, fontSize: 18, fontWeight: "500" }}>
                Event Name:
                <Text
                  style={{ paddingLeft: 20, fontWeight: "400", fontSize: 16 }}
                >
                  {request?.eventName}
                </Text>
              </Text>
              <Text style={{ paddingTop: 15, fontSize: 18, fontWeight: "500" }}>
                Booking Time :
                <Text
                  style={{ paddingLeft: 20, fontWeight: "400", fontSize: 16 }}
                >
                  {request?.bookingTime}
                </Text>
              </Text>
              <Text style={{ paddingTop: 15, fontSize: 18, fontWeight: "500" }}>
                Additional Services:
                <Text
                  style={{ paddingLeft: 20, fontWeight: "400", fontSize: 16 }}
                >
                  {request?.additionalServices}
                </Text>
              </Text>
              <Text style={{ paddingTop: 15, fontSize: 18, fontWeight: "500" }}>
                Admin Contact Number:
                <Text
                  style={{ paddingLeft: 20, fontWeight: "400", fontSize: 16 }}
                >
                  {request?.adminContactNumber}
                </Text>
              </Text>
          
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
      },
      FilterBtn: {
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        backgroundColor: "white",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 10,
        width: 120,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
      },
      btnTxt1: {
        color: "black",
        fontWeight: "600",
      },
      btnTxt2: {
        color: "#28a745",
        fontWeight: "600",
      },
      btnTxt3: {
        color: "red",
        fontWeight: "600",
      },
      noRequestsText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#555",
        marginTop: 20,
      },
});

export default Request;
