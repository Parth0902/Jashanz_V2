import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Filter from "./Filter.jsx";
import Sort from "./Sort.jsx";
const FilterComponent = ({filterOpt,setEvents,events}) => {
  // console.log(filterOpt)
  return (
    <View>
      {
       filterOpt === 'filter' ? <Filter  events={events} setEvents={setEvents}/> : filterOpt === 'sort' ? <Sort setEvents={setEvents}  events={events}/> : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
});

export default FilterComponent;
