import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import SearchSelect from './SearchSelect';

const Filter = ({ events, setEvents }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [OgEvents, setOgEvents] = useState(events);

  useEffect(() => {
    if (events) {
      const uniqueCities = new Set();
      const uniqueStates = new Set();
      events.forEach((event) => {
        uniqueCities.add({ label: event.address.city, value: event.address.city });
        uniqueStates.add({ label: event.address.state, value: event.address.state });
      });

      setCities(Array.from(uniqueCities));
      setStates(Array.from(uniqueStates));
    }
  }, [events]);

  const filterByState = (data) => {
    setEvents(OgEvents);
    const newEvents = OgEvents.filter((item) => item.address.state === data);
    setEvents(newEvents);
  };

  const filterByCity = (data) => {
    setEvents(OgEvents);
    const newEvents = OgEvents.filter((item) => item.address.city === data);
    setEvents(newEvents);
  };

  const resetFilter = () => {
    setEvents(OgEvents);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Filter Events</Text>
      <SearchSelect placeholder={"Select State"} data={states} func={filterByState} />
      <SearchSelect placeholder={"Select City"} data={cities} func={filterByCity} />
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
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
});

export default Filter;
