
import { ColorsBlue, ColorsGreen } from "../../constants/palet";
import { View, Text, StyleSheet, Pressable } from "react-native";
import {useContext, useState } from 'react'
import { ColorContext } from "../../store/color-context";



function AssignmentTile ({onPress, title, subject, assignment_number, completion_status, description}) {
    const colorCtx = useContext(ColorContext)
    
    const tileColor = [ [ColorsGreen.green100, ColorsBlue.blue100], [ColorsGreen.green400, ColorsBlue.blue400]];
    let index = 0;
    
    if (completion_status === true)
    {
        index = 1
    }

    return ( 
    <Pressable
    onPress={onPress}
    style = {({pressed}) => [[styles.tile, {backgroundColor: colorCtx.isBlue ? tileColor[index][0] : tileColor[index][1]}], pressed && styles.pressed]}>
        <View >
            <View style={styles.titlecontainer}>
                <Text style = {[styles.title, 
                    subject === "Natuurkunde" ? 
                    {color: ColorsBlue.blue900} : {color: ColorsGreen.blue700}, 
                    {marginRight: 6}]}
                >
                    {assignment_number}
                </Text>
                <Text style={[styles.title, subject === "Natuurkunde" ? 
            {color: ColorsBlue.blue900} : {color: ColorsGreen.blue700}]}>
                    {title}
                </Text>
            </View> 
            <Text style={ 
            [styles.text, subject === "Natuurkunde" ? 
            {color: ColorsBlue.blue700} : {color: ColorsGreen.green700}]}>
                {subject}
            </Text>
            <Text style={[styles.text, {fontSize: 16}]}>
                {description}
            </Text>
            <Text style={[styles.text, {color: completion_status ? ColorsGreen.green100 : ColorsBlue.error300}]}>
                {!completion_status ? "TODO" : "COMPLETED"}
            </Text> 
        </View>
    </Pressable>
    )
}

export default AssignmentTile


const styles = StyleSheet.create({
    pressed: {
        opacity: 0.7
    },  
    titlecontainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },  
    tile: {
        flex: 1,
        backgroundColor: ColorsBlue.blue200,
        height: 150,
        margin: 10,
        borderRadius: 6,
        elevation: 4, 
        shadowColor: ColorsBlue.blue200,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 5,
        shadowOpacity: 0.7
    },
    title: {
        marginTop: 3,
        fontSize: 20,
        fontWeight: 'bold',
        color: ColorsBlue.blue900
    },
    text: {
        textAlign: 'center',
        margin: 5
    },
    completion: {
        
        marginTop: 2,
        color: ColorsBlue.error300
    },
    description: {
        textAlign: 'center',
        
        margin: 5
    },
    subject: {
        textAlign: 'center',
    }
})