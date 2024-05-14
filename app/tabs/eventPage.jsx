import React, { useState, useEffect, useRef, useContext } from "react";
import { FontAwesome } from '@expo/vector-icons';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  Pressable,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Dropdown } from "react-native-element-dropdown";
import RazorpayCheckout from "react-native-razorpay";
import { EventContext } from "../EventContext";
import Carousel from "react-native-reanimated-carousel";
import AntDesign from "@expo/vector-icons/AntDesign";

const Event = () => {
  const width = Dimensions.get("window").width;
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const { eventDataContext } = useContext(EventContext);
  const [eventData, setEveData] = useState(eventDataContext);
  const [value, setValue] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(
    parseInt(eventData.pricingDetails.basePrice)
  );
  const [GST, setGST] = useState(totalPrice * 0.18);

  const handleVideoLoaded = () => {
    const play = async () => {
      if (video.current) {
        await video.current.playAsync();
      }
    };
    play().catch((error) => console.log("Error playing video:", error));
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

  const HandlePayment = async () => {
    var options = {
      description: "Credits towards consultation",
      image: "https://i.imgur.com/3g7nmJC.jpg",
      currency: "INR",
      key: "rzp_test_cVO1i4YkqUINUy",
      amount: "5000",
      name: "Acme Corp",
      order_id: "order_NstL4c3Nb29pjx", //Replace this with an order_id created using Orders API.
      prefill: {
        email: "gaurav.kumar@example.com",
        contact: "9191919191",
        name: "Gaurav Kumar",
      },
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

  // RazorpayCheckout(options)
  //     .then((data) => {
  //         console.log("data from data", data);

  //         let bodyData = {
  //             razorpay_payment_id: data.razorpay_payment_id,
  //             razorpay_order_id: "order_NstL4c3Nb29pjx",
  //             razorpay_signature: data.razorpay_signature,
  //         };
  //         dispatch(razorPayment(bodyData));
  //         alert(`Success: ${data.razorpay_payment_id}`);
  //     }).catch((error) => {
  //         // handle failure
  //         alert(`Error: ${error.code} | ${error.description}`);
  //         console.log(error);
  // });
  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{eventData.eventType}</Text>
      
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.container2}>
          <View style={styles.container3}>
            <Video
              ref={video}
              style={styles.video}
              source={{
                uri: `${eventData.videoUrl}`,
              }}
              useNativeControls={true}
              resizeMode={ResizeMode.COVER}
              isLooping
              onLoad={handleVideoLoaded}
            />

   
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

            <View style={styles.additionalServices}>
              <Text style={styles.additionalServicesText}>
                Select Addtional Services
              </Text>

              

              {/* <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={additionalServices}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Select item" : "..."}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setSelectedServices((prev) => [...prev, item]);
                  setIsFocus(false);
                  setTotalPrice(totalPrice + parseInt(item.value));
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color={isFocus ? "blue" : "black"}
                    name="Safety"
                    size={20}
                  />
                )}
              /> */}

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
                  <Text style={{ fontSize: 16, fontWeight: 600 }}>
                    GST (18%):
                  </Text>
                  <Text style={styles.cell}>{GST}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ fontSize: 16, fontWeight: 600 }}>Total:</Text>
                  <Text style={styles.cell}>{totalPrice + GST}</Text>
                </View>
              </View>
            </View>

            <Pressable style={styles.SubmitBtn} onPress={HandlePayment}>
              
                    <Text style={styles.SubmitBtnTxt} >
                        Place Order
                    </Text>

                    <View style={{gap:7}}>
                        <Text style={styles.SubmitBtnTxt2} >
                           <FontAwesome name="rupee" size={12} color="white" />
                           {totalPrice + GST}
                        </Text>

                        <Text style={styles.SubmitBtnTxt2} >
                          Total 
                        </Text>
                    </View>
                 
         

            </Pressable>
          </View>
        </View>
      </ScrollView>
      {/* <View style={styles.bottomContainer}>
                <Text>Price</Text>
                <Pressable>Book Now</Pressable>
            </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  SubmitBtnTxt2:{
    fontSize: 16,
    fontWeight: "400",
    color: "white",
  },
  eventName: {
    fontSize: 28,
    fontFamily: "Popins",
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
    width: "91%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  video: {
    height: 220,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "blue",
  },
  textBox: {
    width: "100%",
    justifyContent: "start",
  },
  box: {
    gap: 10,
    backgroundColor: "white",
    paddingVertical:10,
    borderRadius:12,
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
    fontFamily: "Popins",
    fontSize: 20,
    paddingLeft: 20,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 10,
    
  },
  boxSubheading: {
    fontFamily: "Roboto",
    color:'gray',
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
    fontFamily: "Popins",
 
  },
  SubmitBtn: {
    backgroundColor: "#4E9BD1",
    borderRadius: 8,
    width: 250,
    height: 60,
    flexDirection:'row' ,
    justifyContent:'space-between',
    paddingHorizontal:10,
    alignItems:'center',
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
  dropdown: {
    // backgroundColor:'red',
    height: 50,
    borderRadius: 8,
    width: 270,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderColor: "blue",
    height: 50,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default Event;
