import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import CustomDropdown from './CustomDropdown';
import SearchSelect from './SearchSelect';

const Filter = ({ events, setEvents }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [OgEvents, setOgEvents] = useState(events);

  useEffect(() => {
    if (events) {
      setCities([]);
      setStates([]);
      const uniqueCities = new Set();
      const uniqueStates = new Set();
      events.forEach((event) => {
        uniqueCities.add(event.address.city);
        uniqueStates.add(event.address.state);
      });
      
      uniqueCities.forEach((city) => {
        setCities((prev) => [...prev, { label: city, value: city }]);
      }
      );

      uniqueStates.forEach((state) => {
        setStates((prev) => [...prev, { label: state, value: state }]);
      }
      );
      
    }
  }, [events]);

  const filterByState = (data) => {
    console.log(data);
    setEvents(OgEvents);
    const newEvents = OgEvents.filter((item) => item.address.state === data.value);
    setEvents(newEvents);
  };

  const filterByCity = (data) => {
   
    setEvents(OgEvents);
    const newEvents = OgEvents.filter((item) => item.address.city === data.value);
    setEvents(newEvents);
  };

  const resetFilter = () => {
    setEvents(OgEvents);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Filter Events</Text>
      <CustomDropdown heading="Select State" Data={states} handleSelect={filterByState} />
      <CustomDropdown heading="Select City" Data={cities} handleSelect={filterByCity} />
      <Button title="Reset Filter" onPress={resetFilter} color="#007BFF" />
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
    gap: 16,
    alignItems:'center'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
});

export default Filter;
