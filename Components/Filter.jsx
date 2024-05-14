import React,{useState,useEffect} from "react";
import { View, StyleSheet,Button,Text } from "react-native";
import SearchSelect from './SearchSelect'

const Filter = ({events,setEvents}) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const[OgEvents,setOgEvents]=useState(events);
  useEffect(() => {
    // console.log(OgEvents);
 
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

  const filterByState=(data)=>{
    setEvents(OgEvents);
    const newEvents=events.filter((item) => item.address.state === data);
    setEvents(newEvents);
  }

  const filterByCity=(data)=>{
    setEvents(OgEvents)
    const newEvents=events.filter((item) => item.address.city === data);
    setEvents(newEvents);
  }

  const resetFilter = () => {
    setEvents(OgEvents);
  };

  return (
    <View style={styles.container}>
      <Text>Text1</Text>
      <SearchSelect placeholder={"Select State"}  data={states} func={filterByState} />
      <SearchSelect placeholder={"Select City"} data={cities} func={filterByCity} />
      <Button title="Reset Filter" onPress={resetFilter}/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     gap:10
  },
});

export default Filter;
