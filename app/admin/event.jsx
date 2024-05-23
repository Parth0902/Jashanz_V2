import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Dimensions, Text, View, StyleSheet, Image, Button, ScrollView, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { AuthContext } from "../AuthContext";
import { AdminContext } from '../AdminContext';
import Toast from 'react-native-toast-message';
const { url } = process.env;
import Carousel from 'react-native-reanimated-carousel';
const Event = () => {
    const width = Dimensions.get('window').width;
    const { Token, currentAdmin } = useContext(AuthContext);
    const { adminId} = useContext(AdminContext);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [eventData, setEveData] = useState(null);
    const [value, setValue] = useState();
    const [isFocus, setIsFocus] = useState(false);
    const [additionalServices, setAdditionalServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    const handleVideoLoaded = () => {
        const play = async () => {
            if (video.current) {
                await video.current.playAsync();
            }
        };
        play().catch(error => console.log("Error playing video:", error));
    };

    useEffect(() => {
        let headersList = {
            Accept: "*/*",
            Authorization:
                `Bearer ${Token}`,
        };


        let reqOptions2 = {
            url: `${url}/admin/add-event/getevent/${adminId}`,
            method: "GET",
            headers: headersList,
        };

        const filterData = (event) => {
            event.pricingDetails.additionalServices.forEach(priceData => {
                let t = { label: `${priceData.serviceName} = ${priceData.price}`, value: priceData.price };
                setAdditionalServices(prev => ([...prev, t]));
            })
        }

        const fetchEvent = async () => {
            try {
                console.log(adminId);
                if(adminId!==null){
                    const res2 = await axios.request(reqOptions2);
                    if (res2.status === 200) {
                        setEveData(res2.data[0]);
                        filterData(res2.data[0]);
                    }
                }

            } catch (err) {
                Toast.show({ type: 'error', text1: 'error', text2: err });
            }

        }

        fetchEvent();


    }, []);

    if (!eventData) {
        // Return loading state or placeholder
        return <Text>No events</Text>;
    }

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

                        <View style={styles.Images}>
                            {/* <Carousel
                                loop
                                width={(width * 9) / 10}
                                height={220}
                                autoPlay={true}
                                data={[...eventData?.images?.keys()]}
                                scrollAnimationDuration={1000}
                                renderItem={({ index }) => (
                                    <View>
                                        <Image
                                            source={{
                                                uri: `${eventData.images[index].imgUrl}`,
                                            }}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: 15,
                                            }}
                                        />
                                    </View>
                                )}
                            /> */}
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

                        <View style={styles.additionalServices}>
                            <Text style={styles.additionalServicesText}>Addtional Services</Text>
                            <View style={styles.table}>
                                <View style={styles.row}>
                                    <Text style={styles.cell}>Base Price</Text>
                                    <Text style={styles.cell}>
                                        {eventData.pricingDetails.basePrice}
                                    </Text>
                                </View>
                                {additionalServices.map((service, index) => {
                                    const [serviceName, price] = service.label.split(" = ");
                                    return (
                                        <View key={index} style={styles.row}>
                                            <Text style={styles.cell}>{serviceName}</Text>
                                            <Text style={styles.cell}>{price}</Text>
                                        </View>
                                    );
                                })}
                            </View>


                            </View>
                        </View>
                    </View>
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
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
        // backgroundColor: "white",
        // backgroundColor: "#EEFDFF",
    },
    container2: {
        flex: 1,
        alignItems: "center",
    },
    container3: {
        marginTop: 30,
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
        fontFamily: "Popins",
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
        paddingBottom:10,
    },
    additionalServicesText: {
        fontSize: 20,
        fontFamily: "Popins",
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
    SubmitBtn: {
        backgroundColor: 'blue',
        padding: 10,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    SubmitBtnTxt: {
        color: 'white',
        fontWeight: '600'
    }
})

export default Event;
