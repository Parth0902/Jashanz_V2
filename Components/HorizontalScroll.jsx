import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, Pressable } from 'react-native';
import anchor from '../assets/anchor.png';
import Birthday from '../assets/Birthday.png';
import dancers from '../assets/dancers.png';
import decorators from '../assets/decorators.png';
import dj from '../assets/Dj.png';
import getTogether from '../assets/getTogether.png';
import Marriage from '../assets/Marriage.png';
import eventManagementTeam from '../assets/eventManagementTeam.png';

const Data = [
    { service: "Disc Jockey", image: dj },
    { service: "Banquet Halls", image: Marriage },
    { service: "Birthday", image: Birthday },
    { service: "Event Management", image: eventManagementTeam },
    { service: "Hosts", image: anchor },
    { service: "Decorators", image: decorators },
    { service: "Performers", image: dancers },
];

const extendedData = [...Data, ...Data]; // Duplicate data

const HorizontalScroll = ({filter}) => {
    const scrollViewRef = useRef(null);

    const handleScroll = ({nativeEvent}) => {
        if (nativeEvent.contentOffset.x >= nativeEvent.contentSize.width / 2) {
            scrollViewRef.current?.scrollTo({ x: 0, animated: false });
        }
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}  // Adjust based on performance
            ref={scrollViewRef}
            style={{ marginTop: 10, marginBottom: 5, height: 180 }}
        >
            <View style={{ flexDirection: 'row', gap: 5, paddingHorizontal: 20 }}>
                <Pressable  style={styles.serviceCard} onPress={e=>{filter("All Events")}}>
                        <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{fontFamily:"Opensans",fontWeight:"bold",fontSize:18}}>All</Text>
                        </View>
                        <Text style={styles.serviceText}>All Events</Text>
                    </Pressable>
                {extendedData.map((item, index) => (
                    <Pressable key={index} style={styles.serviceCard} onPress={e=>{filter(item.service)}}>
                        <View style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={item.image} style={styles.serviceImg} />
                        </View>
                        <Text style={styles.serviceText}>{item.service}</Text>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    serviceImg: {
        height: 60,
        width: 60,
    },
    serviceText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'Roboto',
    },
    serviceCard: {
        width: 130,
        alignItems: 'center',
    }
})

export default HorizontalScroll;
