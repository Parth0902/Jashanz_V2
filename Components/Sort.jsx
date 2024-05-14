import React from 'react';
import {View, StyleSheet,Text,Pressable} from 'react-native';



const Sort = ({setEvents,events}) => {
    
const sortByPrice = (data) => {
    return data.slice().sort((a, b) => {
      const priceA = parseInt(a.pricingDetails.basePrice, 10);
      const priceB = parseInt(b.pricingDetails.basePrice, 10);
      return priceA - priceB;
    });
  };
  
  // Sort by place (city)
  const sortByPlace = (data) => {
    return data.slice().sort((a, b) => {
      const placeA = a.address.city.toLowerCase();
      const placeB = b.address.city.toLowerCase();
      return placeA.localeCompare(placeB);
    });
  };
  
  // Sort by event type
  const sortByType = (data) => {
    return data.slice().sort((a, b) => {
      const typeA = a.eventType.toLowerCase();
      const typeB = b.eventType.toLowerCase();
      return typeA.localeCompare(typeB);
    });
  };

  const handleSort1=()=>
  {
    events=sortByPrice(events);
    setEvents(events);
  }

  const handleSort2=()=>
  {
    events=sortByPlace(events);
    setEvents(events);
  }

  const handleSort3=()=>
  {
    events=sortByType(events);
    setEvents(events);
  }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>sort</Text>
            <Pressable onPress={handleSort1}>
                <Text style={styles.Title}>Sort By Price</Text>
            </Pressable>

            <Pressable onPress={handleSort2}>
                <Text style={styles.Title}>Sort By Place</Text> 
            </Pressable>
            
            <Pressable onPress={handleSort3}>
                <Text style={styles.Title}>Sort By Type</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        gap:15,
        paddingHorizontal:25,
    },
    header:{
        fontSize:24,
        fontWeight:"500",
        textAlign:'center'
    },
    Title:{
        fontSize:18,
        borderBottomWidth:0.5,
        borderBottomColor:"gray",
        paddingVertical:7,
    },
})

export default Sort;
