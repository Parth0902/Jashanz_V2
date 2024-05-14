import React, { useState } from "react";
import {
  View,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

const DialogueBox = ({ visible, onClose,onSubmit }) => {
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    onSubmit(serviceName, price);
    setServiceName("");
    setPrice("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.dialogueBox}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.inputField}
            placeholder="Service Name"
            value={serviceName}
            onChangeText={setServiceName}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
          />
          <View style={styles.buttonContainer}>
            <Button title="Add Service" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  dialogueBox: {
    gap: 10,
    width: 320,
    backgroundColor: "white",
    padding: 50,
    borderRadius: 10,
    elevation: 5, // for Android shadow
  },
  inputField: {
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderColor: "blue",
    height: 50,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight:'500',
    color: "gray",
    paddingRight:5,
    paddingBottom:10,
  },
});

export default DialogueBox;
