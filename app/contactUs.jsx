import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';


const Contactus = () => {
  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.info}>Company Name: Zealous Virtuoso Pvt Ltd</Text>
        <Text style={styles.info}>
          Email: <Text style={styles.link} onPress={() => Linking.openURL('mailto:support@zealousvirtuoso.in')}>support@zealousvirtuoso.in</Text>
        </Text>
        <Text style={styles.info}>
          Location: Building Name: Parvati Sadan, Block Sector: Nr Khopkar Chal, Road: Mohan Nagar, Dhanakawadi, Dist: Pune 411043, India
        </Text>
        <Text style={styles.info}>
          Contact Number: <Text style={styles.link} onPress={() => Linking.openURL('tel:+919860239837')}>9860239837</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEFDFF',
  },
  header: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    color: '#1e90ff',
  },
});

export default Contactus;
