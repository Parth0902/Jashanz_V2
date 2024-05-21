import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const RefundPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Refund Policy</Text>

        <Text style={styles.paragraph}>
          At Jashanz, we strive to ensure that every booking meets your expectations. However, we understand that circumstances may arise where you need to cancel your booking. Below is our refund policy:
        </Text>

        <Text style={styles.sectionTitle}>Booking Cancellation</Text>

        <Text style={styles.paragraph}>
          If you wish to cancel your booking, please contact us as soon as possible. Refunds are subject to the following conditions:
        </Text>

        <Text style={styles.sectionTitle}>Refund Process</Text>

        <Text style={styles.paragraph}>
          Once your cancellation request is received and approved, we will initiate the refund process. Refunds will be issued to the original payment method used for the booking.
        </Text>

        <Text style={styles.paragraph}>
          Please note that it may take 14 days for the refund to reflect in your account, depending on your bank or payment provider.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>

        <Text style={styles.paragraph}>
          If you have any questions about our refund policy or need assistance with a cancellation, please don't hesitate to contact us.
        </Text>

        <Text style={styles.paragraph}>
          You can reach us via email at support@jashanz.com.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEFDFF',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default RefundPolicy;
