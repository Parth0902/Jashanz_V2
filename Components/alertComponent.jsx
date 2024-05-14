import { Text, View } from "react-native";
const AlertComponent = ({data,backgroundColor,color}) => {
    const containerStyle = {
        backgroundColor: backgroundColor, // Use a default color if prop is not provided
        borderColor: backgroundColor,
        position:'absolute',
        top:5,
        right:0,
        paddingHorizontal:40,
        paddingVertical:20,
        borderRadius:10,
      };
    const textStyle={
        color:color,
        letterSpacing:0.5,
    }
    return (
       <View style={[containerStyle]} >
         <Text style={textStyle}>{data}</Text>
       </View>
    );
}

export default AlertComponent;
