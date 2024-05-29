import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';

const LinkModel = ({ visible, onClose, navigation }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>Important Pages</Text>
          <Pressable onPress={() => { onClose(); navigation.navigate('contactUs'); }}>
            <Text style={styles.linkText}>1. Contact Us</Text>
          </Pressable>
          <Pressable onPress={() => { onClose(); navigation.navigate('PrivacyPolicy'); }}>
            <Text style={styles.linkText}>2. Privacy Policy</Text>
          </Pressable>
          <Pressable onPress={() => { onClose(); navigation.navigate('RefundPolicy'); }}>
            <Text style={styles.linkText}>3. Refund Policy</Text>
          </Pressable>
          <Pressable onPress={() => { onClose(); navigation.navigate('TermsAndConditions'); }}>
            <Text style={styles.linkText}>4. Terms and Conditions</Text>
          </Pressable>
          <Pressable onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontFamily: 'Popins',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  linkText: {
    fontFamily: 'Popins',
    fontSize: 18,
    color: '#007BFF',
    marginVertical: 10,
  },
  closeText: {
    fontFamily: 'Popins',
    fontSize: 18,
    color: '#FF0000',
    marginTop: 20,
  },
});

export default LinkModel;
