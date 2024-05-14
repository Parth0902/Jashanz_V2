import React, { useMemo, useRef, useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Button, Image, Pressable,FlatList } from "react-native";
import Sheet from "../../Components/Sheet";
import { AuthContext } from "../AuthContext";
import Teast from "../../Components/Teast";
import FilterBar from "../../Components/filterBar";
import EventCard from "../../Components/eventCard";
import HorizontalScroll from "../../Components/HorizontalScroll";
import EventPage from './eventPage';
import axios from "axios";
import * as SecureStore from "expo-secure-store";
const { url } = process.env;

const Index = () => {
  const [filterOpt,setFilteropt]=useState('sort')
  const { logout, Token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [allEvents,setAllEvents]=useState([]);
  const [sheetIndex,setSheetIndex]=useState(-1)
  const snapPoints = useMemo(() => ["25%", "35%","50%", "75%", "100%"], []);
  const bottomSheetRef = useRef(null);
  const handleClosePress = () =>{
    setFilteropt(null);
    bottomSheetRef.current?.close();
  }

  const handleOpenPress = (data,index) =>{
    setSheetIndex(index);
    setFilteropt(data);
    bottomSheetRef.current?.snapToIndex(1);
  }

  const filter=(eventName)=>
  {
    if(eventName=="All Events")
    {
      setEvents(allEvents);
    }
    else
    {
      setEvents(allEvents);
      let newEvents=allEvents.filter((event)=>event.eventType==eventName);
      setEvents(newEvents);
    }
  
  }
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          Authorization:
            `Bearer ${Token}`,
        };

        let reqOptions = {
          url: `${url}/selectEvent/`,
          method: "GET",
          headers: headersList,
        };
        let response = await axios.request(reqOptions);
        setEvents(response.data);
        setAllEvents(response.data);
    
      } catch (error) {
        // Handle the error here
        if (error.response) {
          console.error("Response Error:", error.response.data);
        } else if (error.request) {
          console.error("Request Error:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      }
    };
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <FilterBar
        handleClosePress={handleClosePress}
        handleOpenPress={handleOpenPress}
        logout={logout}
      />
      
      <Text style={styles.headText}>Celebrate with <Text style={{color:"#65EFF6"}}>perfection</Text></Text>
      {/* <EventPage/> */}
      <HorizontalScroll filter={filter}/>
      <FlatList

        data={events}
        contentContainerStyle={{
          // Adjust horizontal padding as needed
          flexGrow: 1,
          paddingBottom:100, // Ensures the container takes up the space of its content
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between', // This will space out your items evenly
          marginBottom: 20, // Adjust gap between rows
          gap:10,
        }}
        numColumns={2}
        renderItem={({item})=>(
          <EventCard event={item}/>
        )}
      />
      <Sheet
        snapPoints={snapPoints}
        bottomSheetRef={bottomSheetRef}
        filterOpt={filterOpt}
        sheetIndex={sheetIndex}
        setEvents={setEvents}
        events={events}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "auto",
    alignItems: "center",
    backgroundColor: "#EEFDFF",
  },
  contentContainer: {
    backgroundColor: "white",
  },
  headText: {
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 40,
    fontWeight: "500",
    fontFamily:"Dance",
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Text shadow color
    textShadowOffset: { width: 1, height: 1 }, // Text shadow offset
    textShadowRadius: 2, // 
  },

});

export default Index;
