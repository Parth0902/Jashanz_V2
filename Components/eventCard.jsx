import React, { useContext } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SimpleLineIcons } from '@expo/vector-icons';
import { EventContext } from "../app/EventContext";
import { Link } from 'expo-router';

const EventCard = ({ event }) => {
  const { setEventDataContext } = useContext(EventContext);
  const handlePress = () => {
    setEventDataContext(event);
  };

  return (
    <Link style={styles.ActionBtn} href={{ pathname: 'tabs/eventPage', params: { event: JSON.stringify(event) } }} onPress={handlePress}>
      <View style={styles.eventCard}>
        <Image
          source={{ uri: `${event.images[0].imgUrl}` }}
          style={styles.eventImg}
        />
        <View style={styles.eventContent}>
          <View style={{ gap: 7 }}>
            <Text style={styles.eventHeading} numberOfLines={1} ellipsizeMode="tail">{event.eventType}</Text>
            <Text style={styles.eventSubHeading} numberOfLines={1} ellipsizeMode="tail">
              <FontAwesome name="user-o" color="black" /> {event?.admin?.firmName}
            </Text>
            <Text style={styles.eventSubHeading} numberOfLines={1} ellipsizeMode="tail">
              <SimpleLineIcons name="location-pin" color="black" /> {event?.address?.city}, {event?.address?.state}
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
    width: 190, // Fixed width for each card
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#007BFF",
    marginBottom: 10, // Adjust spacing between cards
  },
  eventImg: {
    height: 150,
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  eventContent: {
    padding: 10,
  },
  eventHeading: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  eventSubHeading: {
    fontSize: 14,
    fontFamily: 'Opensans',
  },
});

export default EventCard;
