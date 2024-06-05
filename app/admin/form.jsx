import React, { useState, useEffect, useContext, useRef } from "react";
import { Dimensions, View, StyleSheet, TextInput, Text, Pressable, Button, Image, Platform, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import AdditionalService from "../../Components/addtionalService";
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from "../AuthContext";
import { Video, ResizeMode } from 'expo-av';
import axios from 'axios'
import CustomDropdown from "../../Components/CustomDropdown";
const { url } = process.env;
import { AdminContext } from "../AdminContext";
import { useToast } from "../ToastContext";
import { Ionicons } from "@expo/vector-icons";
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
    const [isPressed, setIsPressed] = useState(false);
    const width = Dimensions.get('window').width;
    const { showSuccess, showError, showWarn } = useToast();
    const video = React.useRef(null);
    const [value, setValue] = useState();
    const [isFocus, setIsFocus] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [videoData, setVideoData] = useState(null);
    const [Images, setImages] = useState(null);
    const { Token } = useContext(AuthContext);
    const { AdminInfo } = useContext(AdminContext);
    const [eventData, setEventData] = useState({
        id: 2,
        eventType: AdminInfo.specialization,
        pricingDetails: {
            id: 1,
            basePrice: "",
            additionalServices: [],
        },
        address: {
            id: 1,
            country: "India",
            state: "",
            city: "",
            pinCode: "",
            landmark: "",
        },
        admin: {
            id: 1,
            name: AdminInfo.firmName,
            email: AdminInfo.email,
        },
        images: [],
        videoUrl: "",
    });

    const [uploadStatus, setUploadStatus] = useState({
        images: [],
        video: false,
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

    const handleUploadImage = async (index) => {
        try {
            console.log(Images[index].uri);
            let headersList = {
                "Accept": "*/*",
                "Authorization": `Bearer ${Token}`,
            };

            let formdata = new FormData();
            const timestamp = new Date().getTime(); 
            formdata.append("image", {
                uri: Images[index].uri,
                type: 'image/jpeg', // or the appropriate mime type
                name: `image_${index}_${timestamp}.jpg`, // or a meaningful name for the file
            });

            let response = await fetch(`${url}/admin/add-event/upload-image`, {
                method: "POST",
                body: formdata,
                headers: headersList
            });
            if (response.status === 200) {

                let data = await response.text();
                setEventData((prev) => ({
                    ...prev,
                    images:
                        [...prev.images,
                        {
                            id: index + 1,
                            imgUrl: data
                        }
                        ]
                }));
                setUploadStatus((prev) => {
                    const newStatus = [...prev.images];
                    newStatus[index] = true;
                    return { ...prev, images: newStatus };
                });

            }
        } catch (error) {
            console.error("Error uploading image:", error);
            Toast.show({
                type: "error",
                text1: "Error uploading image",
                position: "bottom",
            });
        }
    }

    const handleVideoUpload = async () => {
        try {
            let headersList = {
                "Accept": "*/*",
                "Authorization": `Bearer ${Token}`,
            };

            let formdata = new FormData();
            formdata.append("video", {
                uri: videoData.uri,
                type: 'video/mp4', // or the appropriate mime type
                name: `video.mp4`, // or a meaningful name for the file
            });

            let response = await fetch(`${url}/admin/add-event/upload-video`, {
                method: "POST",
                body: formdata,
                headers: headersList
            });
            if (response.status === 200) {
                let data = await response.text();
                setEventData((prev) => ({
                    ...prev,
                    videoUrl: data,
                }));
                setUploadStatus((prev) => ({ ...prev, video: true }));
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            Toast.show({
                type: "error",
                text1: "Error uploading video",
                visibilityTime: 2000,
            });
        }
    }

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
        const index = eventData.pricingDetails.additionalServices.length;
        const newService = {
            id: index + 1,
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

    const setState = (Item) => {
        console.log(Item.value);
        setEventData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                state: Item.value,
            },
        }));
    }
    const handleSubmit = async () => {
        try {
            console.log("Checking event existence...");

            // Define headers for authorization
            const headers = {
                "Accept": "*/*",
                "Authorization": `Bearer ${Token}`,
            };

            // Check if the event is already present
            const checkResponse = await fetch(`${url}/admin/add-event/checkPresent`, {
                method: "GET",
                headers: headers,
            });

            const checkData = await checkResponse.text();
            console.log(checkData);

            if (checkResponse.status === 200) {
                console.log("Event does not exist. Proceeding to add event...");
        

                // Convert eventData to JSON string
                const eventPayload = JSON.stringify(eventData);
                console.log(eventPayload);

                // Upload the new event
                const uploadResponse = await fetch(`${url}/admin/add-event/upload-event`, {
                    method: "POST",
                    body: eventPayload,
                    headers: {
                        ...headers,
                        "Content-Type": "application/json"
                    },
                });

                const uploadData = await uploadResponse.text();
                console.log(uploadResponse.status);
                console.log(uploadData);

                if (uploadResponse.status === 200) {
                    showSuccess("Event added successfully");
                } else {
                    showError("Error adding event");
                }
            } else {
                showWarn("Event already exists");
            }
        } catch (error) {
            console.error("Error adding event:", error);
            Toast.show({
                type: "error",
                text1: "Error adding event",
                visibilityTime: 1000,
                position: "bottom",
            });
        }
    };

    return (
        <View style={styles.container}>
            {/* <Toast style={{ elevation: 300, zIndex: 1000 }} /> */}
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
                    <CustomDropdown heading="Select State" Data={states} handleSelect={setState} />
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
                            <Text style={styles.btnTxt}>Add Image</Text>
                        </Pressable>
                    </View>

                    {Images && Images.length > 0 &&
                        Images.map((img, index) => (
                            <View key={index} style={{ width: "60%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Image
                                    source={{ uri: img.uri }}
                                    style={styles.image}
                                />
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    {uploadStatus.images[index] && <AntDesign name="checkcircle" size={24} color="green" />}
                                    <Pressable
                                        title="Select Image"
                                        onPress={e => handleUploadImage(index)}
                                        style={{
                                            borderRadius: 10,
                                            elevation: 5,
                                            width: 45,
                                            height: 45,
                                            backgroundColor: "#007BFF",
                                            justifyContent: 'center',
                                            alignItems: "center"
                                        }}
                                    >
                                        <AntDesign name="clouduploado" size={24} color="white" />
                                    </Pressable>
                                    <Pressable
                                        title="Select Image"
                                        onPress={e => setImages((prev) => {
                                            let temp = [...prev];
                                            temp.splice(index, 1);
                                            setUploadStatus((prev) => {
                                                let temp = [...prev.images];
                                                temp.splice(index, 1);
                                                return { ...prev, images: temp };
                                            });

                                        })
                                        }
                                        style={{
                                            borderRadius: 10,
                                            elevation: 5,
                                            width: 45,
                                            height: 45,
                                            backgroundColor: "#007BFF",
                                            justifyContent: 'center',
                                            alignItems: "center"
                                        }}
                                    >
                                        <MaterialIcons name="cancel" size={24} color="white" />
                                    </Pressable>
                                </View>
                            </View>
                        ))
                    }


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
                                resizeMode={ResizeMode.COVER}
                                isLooping
                                onLoad={handleVideoLoaded}
                            />

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                {uploadStatus.video && <AntDesign name="checkcircle" size={24} color="green" />}
                                <Pressable
                                    title="Select Image"
                                    onPress={handleVideoUpload}
                                    style={{
                                        borderRadius: 10,
                                        elevation: 5,
                                        width: 45,
                                        height: 45,
                                        backgroundColor: "#007BFF",
                                        justifyContent: 'center',
                                        alignItems: "center"
                                    }}
                                >
                                    <AntDesign name="clouduploado" size={24} color="white" />
                                </Pressable>
                                <Pressable
                                    onPress={e => setVideoData(null)}
                                    style={{
                                        borderRadius: 10,
                                        elevation: 5,
                                        width: 45,
                                        height: 45,
                                        backgroundColor: "#007BFF",
                                        justifyContent: 'center',
                                        alignItems: "center"
                                    }}
                                >
                                    <MaterialIcons name="cancel" size={24} color="white" />
                                </Pressable>
                            </View>

                        </>
                    }

                    <Text style={styles.additionalServicesText}>Additional Services</Text>
                    <View style={styles.servicesContainer}>
                        {
                            eventData?.pricingDetails?.additionalServices.length > 0 &&
                            eventData?.pricingDetails?.additionalServices.map((service, index) => (
                                <View key={index} style={styles.serviceRow}>
                                    <Text style={styles.serviceName}>{service.serviceName}</Text>
                                    <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                                        <Text style={styles.servicePrice}>{service.price}</Text>
                                        <Pressable
                                            onPress={() => {
                                                setEventData((prev) => {
                                                    const updatedServices = [...prev.pricingDetails.additionalServices];
                                                    updatedServices.splice(index, 1);
                                                    return {
                                                        ...prev,
                                                        pricingDetails: {
                                                            ...prev.pricingDetails,
                                                            additionalServices: updatedServices,
                                                        },
                                                    };
                                                });
                                            }}

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
                            ))
                        }
                    </View>

                    <Pressable onPress={handleAddEvent} style={styles.addMediaBtn}>
                        <Text style={styles.btnTxt}>Add a service</Text>
                    </Pressable>
                    <AdditionalService visible={dialogVisible} onClose={handleCloseDialog} onSubmit={handleAddService} />

                    <Pressable
                        style={[styles.SubmitBtn, isPressed && styles.btnPressed]}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                        onPress={handleSubmit}>
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

    },
    dropdown: {
        width: 340,
        height: 60,
        borderWidth: 1,
        borderColor: "#007BFF",
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
        borderColor: "#007BFF",
        borderRadius: 6,
        paddingHorizontal: 20,
    },
    InputForm: {
        gap: 20,
        alignItems: "center",
        marginVertical: 50,
        justifyContent: "center",
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
    }, btnPressed: {
        backgroundColor: '#0056b3', // Darker blue color
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    SubmitBtnTxt: {
        fontSize: 18,
        color: "white",
        fontWeight: "700",
    },
    imgBtns: {
        gap: 10,
        flexDirection: 'row',
    },
    image: {
        width: 100,
        height: 75,

    },
    selectedImages: {

    },
    video: {
        height: 240,
        width: "90%",
        borderRadius: 12,
    },
    servicesContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: "80%"
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
    addMediaBtn: {
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
    btnTxt: {
        color: "black",
        fontWeight: "600",
    },
});

export default Form;
