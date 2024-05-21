import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

const Sort = ({ setEvents, events }) => {
  const sortByPrice = (data) => {
    return data.slice().sort((a, b) => {
      const priceA = parseInt(a.pricingDetails.basePrice, 10);
      const priceB = parseInt(b.pricingDetails.basePrice, 10);
      return priceA - priceB;
    });
  };

  const sortByPlace = (data) => {
    return data.slice().sort((a, b) => {
      const placeA = a.address.city.toLowerCase();
      const placeB = b.address.city.toLowerCase();
      return placeA.localeCompare(placeB);
    });
  };

  const sortByType = (data) => {
    return data.slice().sort((a, b) => {
      const typeA = a.eventType.toLowerCase();
      const typeB = b.eventType.toLowerCase();
      return typeA.localeCompare(typeB);
    });
  };

  const handleSort1 = () => {
    const sortedEvents = sortByPrice(events);
    setEvents(sortedEvents);
  };

  const handleSort2 = () => {
    const sortedEvents = sortByPlace(events);
    setEvents(sortedEvents);
  };

  const handleSort3 = () => {
    const sortedEvents = sortByType(events);
    setEvents(sortedEvents);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sort Events</Text>
      <Pressable onPress={handleSort1} style={styles.button}>
        <Text style={styles.buttonText}>Sort By Price</Text>
      </Pressable>

      <Pressable onPress={handleSort2} style={styles.button}>
        <Text style={styles.buttonText}>Sort By Place</Text>
      </Pressable>

      <Pressable onPress={handleSort3} style={styles.button}>
        <Text style={styles.buttonText}>Sort By Type</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    margin: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Sort;
