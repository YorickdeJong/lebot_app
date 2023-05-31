import { StyleSheet, Text,  TouchableOpacity,  View } from 'react-native';
import { ColorsBlue, ColorsGray} from '../../../constants/palet';
import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import Icon from '../../Icon';
import BlurWrapper from '../../UI/BlurViewWrapper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

function TextDisplay({title, description, showIcon, differentIcon, setCloseHandler, iconSize, showBorder}){
    const [showDescription, setShowDescription] = useState(false);
    const navigation = useNavigation();
    function expandDescriptionHandler(){
        setShowDescription(!showDescription)
    }
    
    const displayDescription = showDescription ? description : description.substring(0, 33);
    return (
        <View style = {styles.outerContainer}>
            <View style = {{width: "100%", overflow: 'hidden', borderRadius: 20, overflow: 'hidden', backgroundColor: ColorsBlue.blue1390}}>
                <LinearGradient
                    colors = {[ColorsBlue.blue1360, ColorsBlue.blue1300, ColorsBlue.blue1360,]} 
                    style = {styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    >
                    <Text style={styles.text}>{title}</Text>
                </LinearGradient>

                <View style = {styles.textContainer}>
                        <View style={styles.descriptionContainer}>
                            <Text style = {styles.description}>{displayDescription}</Text>
                            {!showDescription && 
                            <TouchableOpacity
                            onPress = {expandDescriptionHandler}>
                                <Text style = {[styles.description, {marginLeft: 8, color: ColorsGray.gray500,}]}>...meer</Text>
                            </TouchableOpacity>
                            }
                        </View>
                        {showDescription && <TouchableOpacity
                            onPress = {expandDescriptionHandler}>
                            <Text style = {[styles.description, {marginLeft: 15, marginTop: 10, color: ColorsGray.gray500,}]}>...minder</Text>
                        </TouchableOpacity>
                        }
                </View> 
            </View>
        </View>
    )
}


export default React.memo(TextDisplay);


const styles = StyleSheet.create({
    header: {
        height: 45,
        backgroundColor: `rgba(25, 25, 85, 0.6)`, //`rgba(45, 45, 85, 0.6)`, //`rgba(25, 25, 60, 0.6)`
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 2, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2,

    },
    textContainer: {

        justifyContent: 'center',
        padding: 5,
        paddingHorizontal: 15,
        paddingTop: 8
    },
    text: {
        fontSize: 25,
        fontWeight: '302',
        marginLeft: 15,
        color: ColorsGray.gray500,
        textAlign: 'center',
        paddingRight: 10,
        paddingTop: 8,
    },
    descriptionContainer: {
        flexDirection: 'row',
        marginLeft: 15,
        marginVertical: 4,
    },
    description: {
        fontSize: 16,
        color: ColorsGray.gray500,
        lineHeight: 30
    },
    border: {
        borderBottomColor: `rgba(33, 33, 33, 0.6)`,
        borderBottomWidth: 0.6,
        shadowColor: `rgba(33, 33, 33)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 1,
        
    },
    closeIcon: { // Style for the close icon
        position: 'absolute',
        top: 7,
        left: 18,
    },
    home: {
        position: 'absolute',
        top: 8,
        right: 18,
    },
    outerContainer: {
        backgroundColor: ColorsBlue.blue1390,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.2)`,
        borderRadius: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 3, width: 1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        elevation: 4,
    }
})