import React, { useState, useEffect, useRef, useContext } from "react";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
  Button
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import RazorpayCheckout from "react-native-razorpay";
import { AuthContext } from '../AuthContext';
import { EventContext } from "../EventContext";
import { useToast } from "../ToastContext";
import Carousel from "../../Components/carousel";
import CustomDropdown from "../../Components/CustomDropdown";
import DateTimePicker from '@react-native-community/datetimepicker';

const { url } = process.env;

const Event = () => {
  const width = Dimensions.get("window").width;
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const { eventDataContext } = useContext(EventContext);
  const { showSuccess, showError, showWarn } = useToast();
  const [eventData, setEveData] = useState(eventDataContext);
  const [value, setValue] = useState();
  const [additionalServices, setAdditionalServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(
    parseInt(eventData.pricingDetails.basePrice)
  );
  const [GST, setGST] = useState(totalPrice * 0.18);
  const [isPlaying, setIsPlaying] = useState(true);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [bookingTime, setBookingTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { Token, getCurrentUser } = useContext(AuthContext);


  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || bookingDate;
    setShowDatePicker(false);
    setBookingDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || bookingTime;
    setShowTimePicker(false);
    setBookingTime(currentTime);
  };

  const handleVideoLoaded = () => {
    const play = async () => {
      if (video.current) {
        await video.current.playAsync();
      }
    };
    play().catch((error) => console.log("Error playing video:", error));
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      video.current.pauseAsync();
    } else {
      video.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const UpdateGst = (totalPrice) => {
      setGST(totalPrice * 0.18);
    };
    UpdateGst(totalPrice);
  }, [totalPrice]);

  useEffect(() => {
    const filterData = (event) => {
      event?.pricingDetails?.additionalServices.forEach((priceData) => {
        let t = {
          label: `${priceData.serviceName} = ${priceData.price}`,
          value: priceData.price,
        };
        setAdditionalServices((prev) => [...prev, t]);
      });
    };

    if (eventData) {
      filterData(eventData);
    }
  }, [eventData]);

  if (!eventData) {
    // Return loading state or placeholder
    return <Text>Loading...</Text>;
  }

  const stringGenerate = () => {
    let temp = "";
    selectedServices?.forEach((service, index) => {
      temp += service.label.split(" ")[0];
      if (index !== selectedServices.length - 1) {
        temp += ",";
      }
    });
    return temp;
  }

  const onPaymentIdGenerated = async (paymentId) => {
    try {
      console.log("paymentId", paymentId);
      let selectedServicesString = stringGenerate();

      let currentUser =await getCurrentUser();
      currentUser = JSON.parse(currentUser); 
      const {id,mobileNumber,email} = currentUser;
      let payload = {
        "adminId": eventData.admin.id,
        "adminFirmName": eventData.admin.firmName,
        "adminContactNumber": eventData.admin.mobileNumber,
        "eventId": eventData.id,
        "eventName": eventData.eventType,
        "additionalServices": selectedServicesString,
        "paymentId": paymentId,
        "customerId": id,
        "customerContactNumber": mobileNumber,
        "customerEmail": email,
        "paymentStatus": "Paid",
        "pricingDetails": eventData.pricingDetails.basePrice,
        "pricingDetailsId": eventData.pricingDetails.id,
        "bookingAmount": totalPrice + GST,
        "bookingDate": bookingDate.toDateString(),
        "bookingTime": bookingTime.toTimeString(),
        "createdDateTime": bookingDate, // LocalDateTime format
        "bookingCharge": 50,
        "ratingEligible": true,
        "bookingStatus": "PENDING"
      }
      console.log("paylod: ", payload);

      let headersList = {
        "Accept": "*/*",
        "Authorization": `Bearer ${Token}`,
        "Content-Type": "application/json"
      };

      let response = await fetch(`${url}/bookings/bookrequest`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: headersList
      });

      let data = await response.text();
      if (response.status === 200) {
        showSuccess("Order Placed Successfully");
      }
    } catch (error) {
      showError(`An error occurred: ${error.message}`);
    }
  };

  const handleSelect = (item) => {
    setSelectedServices((prev) => [...prev, item]);
    setAdditionalServices((prev) => prev.filter(service => service.value !== item.value));
    setTotalPrice(totalPrice + parseInt(item.value));
  };

  const handleCancelService = (item) => {
    setSelectedServices((prev) => prev.filter(service => service.value !== item.value));
    setAdditionalServices((prev) => [...prev, item]);
    setTotalPrice(totalPrice - parseInt(item.value));
  };

  const HandlePayment = async () => {
    let headersList = {
      "Accept": "*/*",
      "Authorization": `Bearer ${Token}`
    };

    try {
      let response = await fetch(`${url}/customer/create-order?eventType=${eventData?.eventType}`, {
        method: "GET",
        headers: headersList
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (response.status === 200) {
        var options = {
          description: 'Thank you for choosing our service',
          image: 'https://jashanzprimaryfiles.s3.ap-south-1.amazonaws.com/jz.jpg',
          currency: 'INR',
          key: 'rzp_live_5BpvObreg8ZoWf',
          amount: 0,
          name: 'Jashanz.com',
          order_id: data.id, // Replace this with an order_id created using Orders API.
          prefill: {
            name: 'Jashanz.com'
          },
          theme: { color: '#53a20e' }
        };

        try {
          const paymentResponse = await RazorpayCheckout.open(options);
          if (onPaymentIdGenerated) {
            onPaymentIdGenerated(paymentResponse.razorpay_payment_id);
          }
        } catch (paymentError) {
          showError("Payment Failed: You are offline or there was an issue loading the Razorpay SDK.");
        }
      }

    } catch (error) {
      showError(`An error occurred: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{eventData?.admin?.firmName}</Text>
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.container2}>
          <View style={styles.container3}>
            <View style={styles.videoContainer}>
              <Video
                ref={video}
                style={styles.video}
                source={{
                  uri: `${eventData.videoUrl}`,
                }}
                useNativeControls={false}
                resizeMode={ResizeMode.COVER}
                isLooping
                onLoad={handleVideoLoaded}
              />
              <TouchableOpacity style={styles.overlay} onPress={handlePlayPause}>
                <MaterialIcons
                  name={isPlaying ? "pause" : "play-arrow"}
                  size={60}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.CarouselContainer}>
              <Carousel images={eventData?.images} />
            </View>

            <View style={styles.textBox}>
              <View style={styles.box}>
                <Text style={styles.boxTextHeading}>
                  Program:{" "}
                  <Text style={styles.boxSubheading}>
                    {eventData.eventType}
                  </Text>
                </Text>
                <Text style={styles.boxTextHeading}>
                  Base Price:{" "}
                  <Text style={styles.boxSubheading}>
                    {eventData.pricingDetails.basePrice}
                  </Text>
                </Text>
                <Text style={styles.boxTextHeading}>
                  State:{" "}
                  <Text style={styles.boxSubheading}>
                    {eventData.address.state}
                  </Text>
                </Text>
                <Text style={styles.boxTextHeading}>
                  City:{" "}
                  <Text style={styles.boxSubheading}>
                    {eventData.address.city}
                  </Text>
                </Text>
                <Text style={styles.boxTextHeading}>
                  PinCode:{" "}
                  <Text style={styles.boxSubheading}>
                    {eventData.address.pinCode}
                  </Text>
                </Text>
                <Text style={styles.boxTextHeading}>
                  Landmark:{" "}
                  <Text style={styles.boxSubheading}>
                    {eventData.address.landmark}
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimePicker}>
                <Button onPress={() => setShowDatePicker(true)} title="Select Booking Date" />
                {showDatePicker && (
                  <DateTimePicker
                    value={bookingDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                <Text style={styles.dateTimeHeading}>Selected Date:   <Text style={styles.dateTimeText}>{bookingDate.toLocaleDateString()}</Text></Text>

              </View>
              <View style={styles.dateTimePicker}>
                <Button onPress={() => setShowTimePicker(true)} title="Select Booking Time" />
                {showTimePicker && (
                  <DateTimePicker
                    value={bookingTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
                <Text style={styles.dateTimeHeading}>Selected Time:    <Text style={styles.dateTimeText}>{bookingTime.toLocaleTimeString()}</Text></Text>

              </View>
            </View>

            <CustomDropdown heading="Select Additional Services" Data={additionalServices} handleSelect={handleSelect} />
            <View style={styles.additionalServices}>
              <Text style={styles.additionalServicesText}>
                Selected Additional Services
              </Text>

              <View style={styles.servicesContainer}>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceName}>Base Price : </Text>
                  <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                    <Text style={styles.servicePrice}> {eventData.pricingDetails.basePrice}</Text>
                  </View>
                </View>
                {
                  selectedServices.length > 0 &&
                  selectedServices.map((service, index) => {
                    const [serviceName, price] = service.label.split(" = ");
                    return (
                      <View key={index} style={styles.serviceRow}>
                        <Text style={styles.serviceName}>{serviceName}</Text>
                        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                          <Text style={styles.servicePrice}>{price}</Text>
                          <Pressable
                            onPress={() => handleCancelService(service)}
                            style={{
                              borderRadius: 10,
                              elevation: 5,
                              width: 35,
                              height: 35,
                              backgroundColor: "#007BFF",
                              justifyContent: 'center',
                              alignItems: "center"
                            }}
                          >
                            <MaterialIcons name="cancel" size={24} color="white" />
                          </Pressable>

                        </View>
                      </View>
                    )
                  })
                }

                <View style={styles.serviceRow}>
                  <Text style={styles.serviceName}>GST (18%) : </Text>
                  <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                    <Text style={styles.servicePrice}> {GST}</Text>
                  </View>
                </View>

                <View style={styles.serviceRow}>
                  <Text style={styles.serviceName}>Total : </Text>
                  <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                    <Text style={styles.servicePrice}>{totalPrice + GST}</Text>
                  </View>
                </View>
              </View>
            </View>

            <Pressable style={styles.SubmitBtn} onPress={HandlePayment}>
              <Text style={styles.SubmitBtnTxt}>Place Order</Text>

              <View style={{ gap: 7 }}>
                <Text style={styles.SubmitBtnTxt2}>
                  <FontAwesome name="rupee" size={12} color="white" />
                  {totalPrice + GST}
                </Text>

                <Text style={styles.SubmitBtnTxt2}>Total</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  SubmitBtnTxt2: {
    fontSize: 16,
    fontWeight: "400",
    color: "white",
  },
  eventName: {
    fontSize: 28,
    // fontFamily: "Poppins",
    textAlign: "center",
    paddingVertical: 20,
    color: "#0274FF",
  },
  container: {
    flex: 1,
    width: "auto",
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: "white",
  },
  container2: {
    flex: 1,
    alignItems: "center",
  },
  container3: {
    marginTop: 30,
    backgroundColor: "white",
    width: "90%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
  },
  video: {
    height: '100%',
    width: '100%',
    borderRadius: 12,
    backgroundColor: "blue",
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  textBox: {
    width: "100%",
    justifyContent: "start",
  },
  box: {
    gap: 10,
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  boxTextHeading: {
    // fontFamily: "Poppins",
    fontSize: 20,
    paddingLeft: 20,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 10,
  },
  boxSubheading: {
    fontFamily: "Roboto",
    color: 'gray',
    fontSize: 18,
    paddingHorizontal: 5,
  },
  additionalServices: {
    gap: 5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  additionalServicesText: {
    fontSize: 20,
    // fontFamily: "Poppins",
  },
  SubmitBtn: {
    backgroundColor: "#4E9BD1",
    borderRadius: 8,
    width: 250,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  SubmitBtnTxt: {
    color: "white",
    fontWeight: "600",
  },
  ImagesText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Monster",
    textAlign: "center",
    paddingVertical: 10,
  },
  card: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  CarouselContainer: {
    width: "100%",
  },
  dateTimeContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    gap: 20,
  },
  dateTimePicker: {
    marginBottom: 10,
  },
  dateTimeHeading: {
    fontSize: 18,
    color: 'black',
    marginTop: 10,
  },
  dateTimeText: {
    fontSize: 16,
    color: 'gray',
    paddingVertical: 5,
  },
  servicesContainer: {
    paddingVertical: 30,
    marginVertical: 20,
    paddingHorizontal: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: "100%"
  },
  serviceName: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: 16,
    color: '#007BFF',
  },
});

export default Event;
