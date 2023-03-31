import { StyleSheet, Text,  TouchableOpacity,  View } from 'react-native';
import { ColorsBlue} from '../../../constants/palet';
import { useState } from 'react';
import { BlurView } from 'expo-blur';
import Icon from '../../Icon';

function TextDisplay({title, description, showIcon, setCloseHandler}){
    const [showDescription, setShowDescription] = useState(false);

    function expandDescriptionHandler(){
        setShowDescription(!showDescription)
    }
    
    const displayDescription = showDescription ? description : description.substring(0, 33);
    return (
        <>
        <BlurView intensity={7} style = {{width: "100%"}}>
            <View style = {styles.textContainer}>
                    <Text style={styles.text}>{title}</Text>
                    <View style={styles.descriptionContainer}>
                        <Text style = {styles.description}>{displayDescription}</Text>
                        {!showDescription && 
                        <TouchableOpacity
                        onPress = {expandDescriptionHandler}>
                            <Text style = {[styles.description, {marginLeft: 8, color: ColorsBlue.blue50}]}>...meer</Text>
                        </TouchableOpacity>
                        }
                    </View>
                    {showDescription && <TouchableOpacity
                        onPress = {expandDescriptionHandler}>
                        <Text style = {[styles.description, {marginLeft: 15, marginTop: 10, color: ColorsBlue.blue50}]}>...minder</Text>
                    </TouchableOpacity>
                    }
            </View> 
            {showIcon && <View style = {styles.closeIcon}>
                <Icon 
                size={36}
                icon="md-close-circle-outline"
                color={ColorsBlue.blue200}
                onPress={setCloseHandler}/>
            </View>}
        </BlurView>
        <View style={styles.border}/>
        </>
    )
}


export default TextDisplay;


const styles = StyleSheet.create({
    textContainer: {
        minHeight: 80,
        justifyContent: 'center',
        padding: 5,
        paddingRight: 30,
        paddingTop: 8
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
        marginLeft: 15,
        color: ColorsBlue.blue50,
    },
    descriptionContainer: {
        flexDirection: 'row',
        marginLeft: 15,
        marginVertical: 4,
    },
    description: {
        fontSize: 16,
        color: ColorsBlue.gray100,
    },
    border: {
        borderBottomColor: `rgba(77, 77, 77, 0.5)`,
        borderBottomWidth: 0.6,
        shadowColor: `rgba(33, 33, 33)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 1,
    },
    closeIcon: { // Style for the close icon
        position: 'absolute',
        top: 10,
        right: 10,
    },
})