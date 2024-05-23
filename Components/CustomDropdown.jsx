import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const CustomDropdown = ({ heading, Data, handleSelect }) => {
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const handleItemPress = (item) => {
    setSelectedValue(item);
    handleSelect(item);
    setVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
        <Text style={styles.selectedText}>
          {selectedValue ? selectedValue.label : heading}
        </Text>
        <AntDesign name="down" size={16} color="black" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={toggleDropdown}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <FlatList
            data={Data}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
            style={styles.list}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 60,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:"#007BFF", 
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 60,
  },
  selectedText: {
    fontSize: 16,
    color: 'gray',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    top: '30%',
    left: '5%',
    right: '5%',
    bottom: '30%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  list: {
    maxHeight: '100%',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default CustomDropdown;
