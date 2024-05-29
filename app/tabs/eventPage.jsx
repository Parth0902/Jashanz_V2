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
import AntDesign from '@expo/vector-icons/AntDesign';
import RazorpayCheckout from "react-native-razorpay";
import { EventContext } from "../EventContext";
import {  useToast} from "../ToastContext";
import Carousel from "../../Components/carousel";
import CustomDropdown from "../../Components/CustomDropdown";

const Event = () => {
  const width = Dimensions.get("window").width;
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const { eventDataContext } = useContext(EventContext);
  const { showSuccess, showError, showWarn } = useToast();
  const [eventData, setEveData] = useState(eventDataContext);
  const [value, setValue] = useState();
  // const [isFocus, setIsFocus] = useState(false);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(
    parseInt(eventData.pricingDetails.basePrice)
  );
  const [GST, setGST] = useState(totalPrice * 0.18);
  const [isPlaying, setIsPlaying] = useState(true);

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

  const onPaymentIdGenerated = (paymentId) => {
    console.log("paymentId", paymentId);
  };

  const handleSelect = (item) => {
    setSelectedServices((prev) => [...prev, item]);
    setTotalPrice(totalPrice + parseInt(item.value));
  };

  const HandlePayment = async () => {
    var options = {
      description: "Credits towards consultation",
      image: "https://i.imgur.com/3g7nmJC.jpg",
      currency: "INR",
      key: "rzp_live_5BpvObreg8ZoWf",
      amount: (totalPrice + GST)*100,
      name: "Jashanz.com",
      order_id: "order_NstL4c3Nb29pjx", //Replace this with an order_id created using Orders API.
      theme: { color: "#53a20e" },
    };

    try {
      const paymentResponse = await RazorpayCheckout.open(options);
      if (onPaymentIdGenerated) {
        onPaymentIdGenerated(paymentResponse.razorpay_payment_id);
      }
    } catch (error) {
      console.log(
        "Payment Failed",
        "You are Offline... Failed to load Razorpay SDK",
        error
      );
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

            
            <CustomDropdown heading="Select Additional Services" Data={additionalServices} handleSelect={handleSelect} />
            <View style={styles.additionalServices}>
              <Text style={styles.additionalServicesText}>
                Select Additional Services
              </Text>

              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.cell}>Base Price</Text>
                  <Text style={styles.cell}>
                    {eventData.pricingDetails.basePrice}
                  </Text>
                </View>
                {selectedServices.map((service, index) => {
                  const [serviceName, price] = service.label.split(" = ");
                  return (
                    <View key={index} style={styles.row}>
                      <Text style={styles.cell}>{serviceName}</Text>
                      <Text style={styles.cell}>{price}</Text>
                    </View>
                  );
                })}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                    width: 350,
                    borderTopWidth: 1,
                    borderTopColor: "black",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    GST (18%):
                  </Text>
                  <Text style={styles.cell}>{GST}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>Total:</Text>
                  <Text style={styles.cell}>{totalPrice + GST}</Text>
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
  table: {
    flex: 1,
    flexDirection: "column",
    marginTop: 20,
    marginHorizontal: 10,
    gap: 5,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    width: 350,
  },
  cell: {
    fontSize: 16,
    color: "#333",
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
  CarouselContainer:{
    width: "100%",
  }
});

export default Event;
