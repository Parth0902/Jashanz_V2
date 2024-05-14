import { React, useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { AuthContext } from "../AuthContext";
import { AdminContext } from "../AdminContext";

const { url } = process.env;
import axios from "axios";
import Toast from "react-native-toast-message";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const { Token, currentAdmin } = useContext(AuthContext);
  const { adminId } = useContext(AdminContext);

  useEffect(() => {
    const fetchRequests = async () => {
      let headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${Token}`,
      };

      let reqOptions = {
        url: `http://backend.jashanz.com/bookings/receiverequest/${adminId}`,
        method: "GET",
        headers: headersList,
      };

      if (adminId) {
        let response = await axios.request(reqOptions);
        if (response.status === 200) {
          setRequests(
            response?.data.filter(
              (request) => request.bookingStatus === "PENDING"
            )
          );
          setAllRequests(response.data);
        }
      }
    };

    fetchRequests();
  }, []);

  const AcceptRequest = async (id) => {
    let headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${Token}`,
    };

    let reqOptions = {
      url: `http://backend.jashanz.com/bookings/accept/${id}`,
      method: "GET",
      headers: headersList,
    };
    let response = await axios.request(reqOptions);
    if (response.status === 200) {
      let updatedRequests = requests.map((request) => {
        if (request.id === id) {
          request.bookingStatus = "ACCEPTED";
        }
        return request;
      });
      Toast.show({
        type: "success",
        text1: "Request Accepted",
        visibilityTime: 2000,
      });
      setRequests(updatedRequests);
    }
  };

  const RejectRequest = async (id) => {
    let headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${Token}`,
    };

    let reqOptions = {
      url: `http://backend.jashanz.com/bookings/reject/${id}`,
      method: "GET",
      headers: headersList,
    };
    let response = await axios.request(reqOptions);
    if (response.status === 200) {
      let updatedRequests = requests.map((request) => {
        if (request.id === id) {
          request.bookingStatus = "REJECTED";
        }
        return request;
      });
      Toast.show({
        type: "success",
        text1: "Request Rejected",
        visibilityTime: 2000,
      });
      setRequests(updatedRequests);
    }
  };

  const filterRequests = (status) => {
    Toast.show({
      type: "success",
      text1: "Request Accepted",
      visibilityTime: 2000,
    });

    if (status === "all") {
      setRequests(allRequests);
    } else {
      setRequests(
        allRequests.filter((request) => request.bookingStatus === status)
      );
    }
  };

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
        <ScrollView style={{ width: "100%", gap: 20 }}>
          {requests.map((request, id) => (
            <View
              style={{
                width: 380,
                height: 340,
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
              {request?.bookingStatus === "ACCEPTED" && (
                <>
                  <Text
                    style={{ paddingTop: 15, fontSize: 18, fontWeight: "500" }}
                  >
                    Contact Number:
                    <Text
                      style={{
                        paddingLeft: 20,
                        fontWeight: "400",
                        fontSize: 16,
                      }}
                    >
                      {request?.customerContactNumber}
                    </Text>
                  </Text>
                  <Text
                    style={{ paddingTop: 15, fontSize: 18, fontWeight: "500" }}
                  >
                    customerEmail:
                    <Text
                      style={{
                        paddingLeft: 20,
                        fontWeight: "400",
                        fontSize: 16,
                      }}
                    >
                      {request?.customerEmail}
                    </Text>
                  </Text>
                </>
              )}
              {/* <Text style={{paddingTop:15,fontSize:18,fontWeight:'500'}}>booking Charge:<Text style={{paddingLeft:20,fontWeight:"400",fontSize:16}}>{request.bookingCharge}</Text></Text> 
                <Text style={{paddingTop:15,fontSize:18,fontWeight:'500'}}>Booking Ammount:<Text style={{paddingLeft:20,fontWeight:"400",fontSize:16}}>{request?.bookingAmount}</Text></Text> */}
              {request?.bookingStatus === "PENDING" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    paddingTop: 30,
                  }}
                >
                  <Pressable
                    style={{
                      backgroundColor: "#28a745",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 8,
                    }}
                    onPress={(e) => AcceptRequest(request?.id)}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 18,
                      }}
                    >
                      Accept
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      backgroundColor: "red",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 8,
                    }}
                    onPress={(e) => RejectRequest(request?.id)}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 18,
                      }}
                    >
                      Reject
                    </Text>
                  </Pressable>
                </View>
              )}
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
});

export default Request;
