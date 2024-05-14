import React from "react";
import { View, StyleSheet ,Button,Pressable,Text} from "react-native";
import { MaterialIcons, Feather,AntDesign  } from '@expo/vector-icons';
import { Link } from "expo-router";

const FilterBar = ({handleOpenPress,handleClosePress,logout}) => {
  return (
    <View style={styles.filterBar}>
     <Button title="logout" onPress={logout}></Button>
      <Pressable style={styles.filterBtn} onPress={()=>handleOpenPress('filter',3)} >
        {/* <Feather name="filter" size={20} color="black" /> */}
        <AntDesign name="filter" size={20} color="#4E9BD1" />
        <Text style={styles.filterText}>Filter</Text>
      </Pressable>

      <Pressable style={styles.filterBtn} onPress={()=>handleOpenPress('sort',1)}>
        <MaterialIcons name="sort" size={24} color="#4E9BD1" />
        <Text style={styles.filterText}>Sort
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    filterBar:{
        flexDirection:'row',
        flex:1,
        backgroundColor:"white",
        paddingVertical:18,
        position:'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex:1,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      filterBtn:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5,
      },
      filterText:{
        fontSize:18,
        fontWeight:"600",
        color:"#4E9BD1"
      }
});

export default FilterBar;
