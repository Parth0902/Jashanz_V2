import React, { useState, useEffect, useContext ,useRef} from "react";
import { Dimensions,View, StyleSheet, TextInput, Text, Pressable, Button, Image, Platform, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import AdditionalService from "../../Components/addtionalService";
import Toast from 'react-native-toast-message';
import { AuthContext } from "../AuthContext";
import { Video, ResizeMode } from 'expo-av';
import axios from 'axios'
const { url } = process.env;
const states = [


    { label: "Andhra Pradesh", value: "Andhra Pradesh" },
    { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
    { label: "Assam", value: "Assam" },
    { label: "Bihar", value: "Bihar" },
    { label: "Chhattisgarh", value: "Chhattisgarh" },
    { label: "Goa", value: "Goa" },
    { label: "Gujarat", value: "Gujarat" },
    { label: "Haryana", value: "Haryana" },
    { label: "Himachal Pradesh", value: "Himachal Pradesh" },
    { label: "Jharkhand", value: "Jharkhand" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Kerala", value: "Kerala" },
    { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Manipur", value: "Manipur" },
    { label: "Meghalaya", value: "Meghalaya" },
    { label: "Mizoram", value: "Mizoram" },
    { label: "Nagaland", value: "Nagaland" },
    { label: "Odisha", value: "Odisha" },
    { label: "Punjab", value: "Punjab" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "Sikkim", value: "Sikkim" },
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Telangana", value: "Telangana" },
    { label: "Tripura", value: "Tripura" },
    { label: "Uttar Pradesh", value: "Uttar Pradesh" },
    { label: "Uttarakhand", value: "Uttarakhand" },
    { label: "West Bengal", value: "West Bengal" },
    {
        label: "Andaman and Nicobar Islands",
        value: "Andaman and Nicobar Islands",
    },
    { label: "Chandigarh", value: "Chandigarh" },
    {
        label: "Dadra and Nagar Haveli and Daman and Diu",
        value: "Dadra and Nagar Haveli and Daman and Diu",
    },
    { label: "Lakshadweep", value: "Lakshadweep" },
    { label: "Delhi", value: "Delhi" },
    { label: "Puducherry", value: "Puducherry" },
];

const Form = () => {
    const width = Dimensions.get('window').width;
    const video = React.useRef(null);
    const [value, setValue] = useState();
    const [isFocus, setIsFocus] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [videoData, setVideoData] = useState(null);
    const [Images, setImages] = useState(null);
    const {Token } = useContext(AuthContext);
    const [eventData, setEventData] = useState({
        pricingDetails: {
            basePrice: "",
            additionalServices: [{ serviceName: "", price: "" }],
        },
        address: {
            country: "India",
            state: "",
            city: "",
            pinCode: "",
            landmark: "",
        },
        images: [],
    });



    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true, // Enable multiple selections
        });

        if (!result.canceled) {
            setImages(result.assets);
        }
    };

    const pickVideo = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoData(result.assets[0]); // Store the selected video in state
        }
    };






    const handleAddEvent = () => {
        setDialogVisible(true);
    };

    const handleCloseDialog = () => {
        setDialogVisible(false);
    };

    const handleVideoLoaded = () => {
        const play = async () => {
            if (video.current) {
                await video.current.playAsync();
            }
        };
        play().catch(error => console.log("Error playing video:", error));
    };


    const handleAddService = (serviceName, price) => {
        const newService = {
            serviceName: serviceName,
            price: price
        };
        setEventData(prevEvent => ({
            ...prevEvent,
            pricingDetails: {
                ...prevEvent.pricingDetails,
                additionalServices: [...prevEvent.pricingDetails.additionalServices, newService]
            }
        }));
    };

    const handleSubmit = async () => {
    // React Native does not have a default event parameter for non-web environments
    const formData = new FormData();
    // formData.append("event=application/json", eventData, { type: "application/json" });
    // Images?.forEach((image) => formData.append("images", 
    //     image.uri
    // ));
    
    // if (videoData) {
    //     formData.append("video", 
    //     videoData.uri
    // );
    // }
    
        
 
    let headersList = {
        Accept: "*/*",
        Authorization:
        `Bearer ${Token}`,
    };
    
    let reqOptions1 = {
        url: `${url}/admin/add-event/checkPresent`,
        method: "GET",
        headers: headersList,
    };
    
    let reqOptions2 = {
        url: `${url}/admin/add-event`,
        method: "POST",
        headers: headersList,
        data:formData
    };
    
    
    try {


        if (!Token) {
            Toast.show({ type: 'error', text1: 'Authentication error', text2: 'No token found.' });
            return;
        }

        const result = await axios.request(reqOptions1)
        if (result.status === 507) {
            Toast.show({ type: 'error', text1: 'Already Present!', text2: 'You are required to fill in only one event.' });
            return;
        }
        
        if (result.status === 200) {
            // console.log(JSON.stringify(formData));
            // for (let [key, value] of formData.entries()) {
            //     console.log(key, value);
            // }                
            const response = await axios.request(reqOptions2);
          
            console.log("Response Status:", response.status);
                console.log("Response Data:", response.data);
                Toast.show({ type: 'success', text1: 'Success', text2: 'You have successfully added a new event.' });
                setEventData({
                    pricingDetails: {
                        basePrice: "",
                        additionalServices: [{ serviceName: "", price: "" }],
                    },
                    address: {
                        country: "India",
                        state: "",
                        city: "",
                        pinCode: "",
                        landmark: "",
                    },
                    images: [],
                });

          
             
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'An error occurred while adding the event.' });
        }
};

    return (
        <View style={styles.container}>
            <ScrollView style={{ width: "100%" }}>
                <View style={styles.InputForm}>
                    <TextInput
                        placeholder="Base Price"
                        style={styles.inputField}
                        onChangeText={(basePrice) =>
                            setEventData((prev) => ({
                                ...prev,
                                pricingDetails: {
                                    ...prev.pricingDetails,
                                    basePrice: basePrice,
                                },
                            }))
                        }
                    />
                    <TextInput value="India" editable={false} style={styles.inputField} />
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={states}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? "Select State" : "..."}
                        searchPlaceholder="Search..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(item) => {
                            setValue(item.value);
                            setIsFocus(false);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                                style={styles.icon}
                                color={isFocus ? "blue" : "black"}
                                name="Safety"
                                size={20}
                            />
                        )}
                    />
                    <TextInput
                        placeholder="City"
                        style={styles.inputField}
                        onChangeText={(city) => {
                            setEventData((prev) => ({
                                ...prev,
                                address: {
                                    ...prev.address,
                                    city: city,
                                },
                            }));
                        }}
                    />
                    <TextInput
                        placeholder="Pincode"
                        style={styles.inputField}
                        onChangeText={(Pincode) => {
                            setEventData((prev) => ({
                                ...prev,
                                address: {
                                    ...prev.address,
                                    pinCode: Pincode,
                                },
                            }));
                        }}
                    />

                    <TextInput
                        placeholder="landmark"
                        style={styles.inputField}
                        onChangeText={(landmark) => {
                            setEventData((prev) => ({
                                ...prev,
                                address: {
                                    ...prev.address,
                                    landmark: landmark,
                                },
                            }));
                        }}
                    />

                    <View style={styles.imgBtns}>
                        <Pressable title="Select Image" onPress={pickImage} style={styles.addMediaBtn} >
                            <Text  style={styles.btnTxt}>Add Image</Text>
                        </Pressable>
                    </View>

                    {Images && Images.length > 0 && (

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.selectedImages}
                            >
                                {Images.map((img, index) => (
                                    <Image
                                        source={{ uri: img.uri }}
                                        key={index}
                                        style={styles.image}
                                    />

                                    // <Text>{img.uri}</Text>
                                ))}
                            </ScrollView>
                    )}
                    <View style={styles.imgBtns}>
                        <Pressable title="Select Image" onPress={pickVideo} style={styles.addMediaBtn}>
                                <Text style={styles.btnTxt}>Add Video</Text>
                        </Pressable>
                    </View>

                    {
                        videoData &&

                      <>
                         <Text style={styles.btnTxt} >Selected Video</Text>
                          <Video
                            ref={video}
                            style={styles.video}
                            source={{
                                uri: videoData.uri,
                            }}
                            useNativeControls={false}
                            resizeMode={ResizeMode.CONTAIN}
                            isLooping
                            onLoad={handleVideoLoaded}
                         />
                      </>
                      

                    }

             
                  

                    {/* <Button title="Upload Image" onPress={uploadImage} /> */}
                    <Text style={styles.additionalServicesText}>Additional Services</Text>
                   
                        {
                            eventData?.pricingDetails?.additionalServices.map((service, index) => (
                                <View key={index} style={styles.row}>
                                    <Text style={styles.cell}>{service.serviceName}</Text>
                                    <Text style={styles.cell}>{service.price}</Text> 
                                </View>
                            ))
                        }
            

                    <Pressable onPress={handleAddEvent} style={styles.addMediaBtn}>
                        <Text style={styles.btnTxt}>Add a service</Text>
                    </Pressable>
                    <AdditionalService visible={dialogVisible} onClose={handleCloseDialog} onSubmit={handleAddService} />
                    <Pressable style={styles.SubmitBtn} onPress={handleSubmit}>
                        <Text style={styles.SubmitBtnTxt}>Submit</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "auto",
        alignItems: "center",
        backgroundColor: "#EEFDFF",
        justifyContent: "center",
    },
    dropdown: {
        width: 340, 
        height: 60,
        borderWidth: 1,
        borderColor:"#007BFF", 
        paddingHorizontal: 20,

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
    inputField: {
        width: 340, 
        height: 60,
        borderWidth: 1,
        borderColor:"#007BFF", 
        borderRadius: 6,
        paddingHorizontal: 20,
    },
    InputForm: {
        gap: 20,
        alignItems: "center",
        marginVertical:50,
    },
    additionalServicesText: {
        fontSize: 20,
        fontFamily: "Popins",
    },
    SubmitBtn: {
        backgroundColor: "#007BFF",
        borderRadius: 8,
        width: 200,
        alignItems: "center",
        justifyContent: "center",
        height: 60,
    },
    SubmitBtnTxt: {
        fontSize: 18,
        color:"white",
        fontWeight:"700",
    },
    imgBtns: {
        gap: 10,
        flexDirection: 'row',
    },
    image: {
        width: 200,
        height: 200,
      },
      selectedImages:{
       marginHorizontal:10,
      },
      video: {
        height: 350,
        width: "90%",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    addMediaBtn:{
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
    btnTxt:{
        color: "black",
        fontWeight: "600",
    },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        width: 350,
      },
      cell: {
        fontSize: 16,
        color: "#333",
      },
});

export default Form;
