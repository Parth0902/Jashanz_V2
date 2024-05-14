import React from 'react';
import { StyleSheet, View,Text,ScrollView } from 'react-native';


const AdminGuide = () => {
    const AdminSteps=[
        {
            heading:"Profile",
            subheading:"In your profile section, you can view and update your administrative details."
        },
        {
            heading:"Events",
            subheading:"This section allows you to manage your events."
        },
        {
            heading:"Add Event",
            subheading:"Use this section to create new events for your clients or attendees"
        },
        {
            heading:"Requests",
            subheading:"This section lets you manage booking requests from your clients."
        },  
    ]
    return (
        <View style={{marginTop:10}}>
            <Text style={{fontFamily:"Popins",fontSize:24,textAlign:'center'}}>Admin Guide</Text>
            <Text style={{fontFamily:"Opensans",fontSize:16, paddingHorizontal:30}}>To ensure that you make the most out of your Admin Dashboard, here is a step-by-step guide on how to use the various features available in your navigation bar.</Text>
            <View style={{gap:30,paddingTop:30}}>
                {
                    AdminSteps.map((step,index)=>(
                        <View key={index} style={{paddingHorizontal:25}}>
                            <View style={{flexDirection:'row',gap:20}}>
                                <Text style={{paddingHorizontal:10,width:30, height:30, borderRadius:15,backgroundColor:"#007BFF",color:"white",fontSize:20,justifyContent:'center',alignItems:'center'}}>{index+1}</Text>
                                <Text style={{fontFamily:"Popins",fontSize:20}}>{ step.heading}</Text>
                            </View>
                            <Text style={{fontFamily:"Opensans",fontSize:18}}>{step.subheading}</Text>
                        </View>
                    ))
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default AdminGuide;
