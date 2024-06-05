import { React, useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { AuthContext } from "../AuthContext";
import { AdminContext } from "../AdminContext";
import axios from "axios";
import { useToast } from "../ToastContext";
const { url } = process.env;

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const { Token, currentAdmin } = useContext(AuthContext);
  const { adminId } = useContext(AdminContext);
  const { showError, showWarn, showSuccess } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      const headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${Token}`,
      };

      const reqOptions = {
        method: "GET",
        headers: headersList,
      };

      try {
        if (adminId) {
          const response = await fetch(`${url}/bookings/receiverequest/${adminId}`, reqOptions);
          if (response.status === 200) {
            const data = await response.json();
            setRequests(data);
            setAllRequests(data);
          } else if (response.status === 404) {
            showWarn("No requests found");
          }
        }
      } catch (err) {
        showError("Error fetching requests:", err);
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
      showSuccess("Request Accepted");
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
      showSuccess("Request Rejected");
      setRequests(updatedRequests);
    }
  };

  const filterRequests = (status) => {
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

    <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContainer}>
    {requests.map((request, id) => (
  <View style={[styles.card, request.bookingStatus === "ACCEPTED" ? styles.cardAccepted : request.bookingStatus === "REJECTED" ? styles.cardRejected : styles.cardPending]} key={id}>
    <Text style={styles.cardHeader}>{request.bookingStatus.charAt(0).toUpperCase() + request.bookingStatus.slice(1).toLowerCase()}</Text>
    <View style={styles.cardBody}>
      <View style={styles.label}>
        <Text>ID:</Text>
        <Text style={styles.value}>{request.id}</Text>
        <Text>Date:</Text>
        <Text style={styles.value}>{new Date(request.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
      </View>
      <View style={[styles.label, styles.eventName]}>
        <Text>Event Name:</Text>
        <Text style={[styles.value, styles.eventNameValue]}>{request.eventName}</Text>
      </View>
      <View style={[styles.label, styles.additionalServices]}>
        <Text>Additional Services:</Text>
        <Text style={[styles.value, styles.additionalServicesValue]}>{request.additionalServices}</Text>
      </View>
      <View style={[styles.label, styles.labelPaymentAmount]}>
        <Text>Payment Amount:</Text>
        <Text style={[styles.value, styles.lightValue]}>{request.pricingDetails}</Text>
      </View>
      <View style={[styles.label, styles.labelBookingTime]}>
        <Text>Booking Time:</Text>
        <Text style={[styles.value, styles.lightValue]}>{new Date(request.bookingDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
      </View>
      {request.bookingStatus === "ACCEPTED" && (
        <View style={[styles.label, styles.labelContactNumber]}>
          <Text>Contact Number:</Text>
          <Text style={[styles.value, styles.contactNumberValue]}>{request.customerContactNumber}</Text>
        </View>
      )}

      {request.bookingStatus === "PENDING" && 
        <View style={styles.cardActions}>
          <Pressable
            style={styles.acceptButton}
            onPress={(e) => AcceptRequest(request?.id)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </Pressable>
          <Pressable
            style={styles.rejectButton}
            onPress={(e) => RejectRequest(request?.id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </Pressable>
        </View>
      }
    </View>
  </View>
))}

    </ScrollView>
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
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 30,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    fontSize: 24,
    padding: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: "Opensans",
  },
  cardBody: {
    padding: 20,
    backgroundColor: '#f0f4f8',
    gap: 15,
  },
  label: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 16,
    color: '#333',
    backgroundColor: '#e4ebf1',
    padding: 10,
    borderRadius: 10,
  },
  value: {
    fontFamily: "CourierPrime",
    color: '#007aff',
  },
  eventName: {
    backgroundColor: '#4c9aff',
    color: '#ffffff',
  },
  eventNameValue: {
    fontFamily: "PT_Sans",
    color: '#ffffff',
  },
  additionalServices: {
    backgroundColor: '#ff6596',
    color: '#ffffff',
  },
  additionalServicesValue: {
    fontFamily: "PT_Sans",
    color: '#ffffff',
  },
  cardPending: {
    backgroundColor: '#bdc1c6',
  },
  cardAccepted: {
    backgroundColor: '#45d99a',
  },
  cardRejected: {
    backgroundColor: '#ff5b4c',
  },
  labelPaymentAmount: {
    backgroundColor: '#57a8ff',
    color: '#ffffff',
  },
  labelBookingDate: {
    backgroundColor: '#6ecb63',
    color: '#ffffff',
  },
  labelBookingTime: {
    backgroundColor: '#ffab4c',
    color: '#ffffff',
  },
  labelContactNumber: {
    backgroundColor: '#00bcd4',
    color: '#ffffff',
  },
  contactNumberValue: {
    fontFamily: "Roboto",
    color: '#ffffff',
  },
  lightValue: {
    color: '#ffffff',
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 20,
  },
  acceptButton: {
    backgroundColor: "#45d99a",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: "#ff5b4c",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
});

export default Request;
