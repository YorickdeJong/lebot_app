import { BlurView } from "expo-blur";
import { FlatList, StyleSheet, Text, View } from "react-native"
import { ColorsBlue, ColorsTile } from "../../../constants/palet";
import { parts } from "../../../data/storeData";
import PartsButton from "./partsButton"



function PartsContainer({backgroundColors}){
    function renderParts(itemData) {
        function onPressHandler() {
            console.log(`Bought Part ${itemData.item}`)

        }
        return (
            <PartsButton
            {...itemData.item}
            onPress = {onPressHandler}
            />
        )
    }
    
    return(
        <BlurView intensity={3} style={[styles.parts, {backgroundColor: backgroundColors}]}>
            <Text style = {styles.text}>Parts</Text>
            <View style = {styles.flatList}>
                <FlatList 
                horizontal
                data = {parts}
                keyExtractor = {(item, index) => index}
                showsHorizontalScrollIndicator = {false}
                renderItem = {renderParts}/>
            </View>
        </BlurView>
        
    )
}

export default PartsContainer

const styles = StyleSheet.create({
    parts: {
        paddingTop: 10,
        backgroundColor: ColorsTile.blue900,
        borderRadius: 5, 
        margin: 10,
        alignItems: 'center' 
    },
    text: {
        color: "white",
        fontSize: 24,
        fontWeight: 'italic',
        marginTop: 10,
        marginLeft: 30,
        alignSelf: 'flex-start'
    },
    flatList: {
        width: "90%"
    }
})