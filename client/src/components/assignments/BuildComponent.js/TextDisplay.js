import { StyleSheet, Text,  TouchableOpacity,  View } from 'react-native';
import { ColorsBlue, ColorsGray} from '../../../constants/palet';
import { useState } from 'react';
import { BlurView } from 'expo-blur';
import Icon from '../../Icon';
import BlurWrapper from '../../UI/BlurViewWrapper';

function TextDisplay({title, description, showIcon, differentIcon, setCloseHandler, iconSize, showBorder}){
    const [showDescription, setShowDescription] = useState(false);

    function expandDescriptionHandler(){
        setShowDescription(!showDescription)
    }
    
    const displayDescription = showDescription ? description : description.substring(0, 33);
    return (
        <>
        {!showBorder && <View style={styles.border}/>}
        <BlurWrapper intensity={10} tint = "dark" style = {{width: "100%",}}>
            <View style = {styles.header}> 
                <Text style={styles.text}>{title}</Text>
                {showIcon && <View style = {[styles.closeIcon, {top: !iconSize ? 5 : 7}]}>
                    <Icon 
                    size={iconSize ? iconSize : 34}
                    icon= { differentIcon ? differentIcon : "md-close-circle-outline" }
                    color={ColorsBlue.blue200}
                    onPress={setCloseHandler}/>
                </View>}
            </View>
            <View style = {styles.textContainer}>
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
        </BlurWrapper>
        {!showBorder && <View style={styles.border}/>}
        </>
    )
}


export default TextDisplay;


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
        minHeight: 50,
        justifyContent: 'center',
        padding: 5,
        paddingRight: 10,
        paddingTop: 8
    },
    text: {
        fontSize: 25,
        fontWeight: '300',
        marginLeft: 15,
        color: ColorsBlue.blue50,
        textAlign: 'center',
        paddingRight: 10,
        paddingTop: 8
    },
    descriptionContainer: {
        flexDirection: 'row',
        marginLeft: 15,
        marginVertical: 4,
    },
    description: {
        fontSize: 16,
        color: ColorsGray.gray300,
        lineHeight: 21
    },
    border: {
        borderBottomColor: `rgba(77, 77, 77, 0.6)`,
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
})