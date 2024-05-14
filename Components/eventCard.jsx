import React, { useContext } from "react";
import { View, StyleSheet, Text, Pressable, Image } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from '@expo/vector-icons';
import { EventContext } from "../app/EventContext";
import { Link } from 'expo-router'

const EventCard = ({ event }) => {
  const { setEventDataContext } = useContext(EventContext);
  const handlePress = () => {
    setEventDataContext(event);
  };

  return (
    <Link style={styles.ActionBtn} href={{ pathname: 'tabs/eventPage', params: { event: JSON.stringify(event) } }} onPress={handlePress}>
      <View style={styles.eventCard}>
        <Image
          source={{
            uri: `${event.images[0].imgUrl}`,
          }}
          style={styles.eventImg}
        />
        <View style={styles.eventContent}>
          <View style={{ gap: 7 }}>
            <Text style={styles.eventHeading}>{event.eventType}</Text>


            <Text style={styles.eventSubHeading}>
              <FontAwesome name="user-o" color="black" /> {event?.admin?.firmName}
            </Text>
            <Text style={styles.eventSubHeading}>
              <SimpleLineIcons name="location-pin" color="black" /> {event?.address?.city} ,{event?.address?.state}
            </Text>

          </View>

        </View>
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    borderRadius: 20,
    width: 200,
    height: 290,
    backgroundColor: "#fff",
    zIndex: 0,
    elevation: 5, // Adjust the elevation value for the shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 }, // Controls the offset of the shadow
    shadowOpacity: 0.3, // Controls the transparency of the shadow
    shadowRadius: 4, // Controls the blur effect of the shadow

  },
  eventImg: {
    height: 200,
    objectFit: "cover",
    borderRadius: 20,
  },
  eventContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  eventHeading: {
    fontSize: 18,
    fontWeight: "500",
    paddingBottom: 5,
    textAlign:'center',
    width:200,
    fontFamily:'Roboto',
  },
  eventSubHeading: {
    fontSize: 14,
    paddingHorizontal: 10,
    fontFamily:'Opensans',
  },

});

export default EventCard;
