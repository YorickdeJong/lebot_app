import { useNavigation } from "@react-navigation/native";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ColorContext } from "../../../store/color-context";

import {useContext } from 'react'
import { DUMMY_EXPENSES } from "../../../data/dummydata";
import AssignmentTile from "../../../components/assignments/AssignmentTile";

function AssignmentsResults() {
    const navigation = useNavigation();
    // const colorCtx = useContext(ColorContext)
    
    function renderAssignment(itemData) {
        function onPressHandler() {
            console.log('pressed')
            navigation.navigate('Assignment', {
                assignmentData: itemData.item
            })
        }
    
    
        return (
            <AssignmentTile 
            {...itemData.item}
            onPress = {onPressHandler}
            />
        )
    }
    
    return (
        <View style={styles.outercontainer}>
        <FlatList 
        data={DUMMY_EXPENSES}
        keyExtractor = {(item) => item.id}
        numColumns = {1}
        renderItem = {renderAssignment} 
        />
        </View>


    )
}

export default AssignmentsResults

const styles = StyleSheet.create({
    outercontainer: {
        marginTop: 20
    }
})