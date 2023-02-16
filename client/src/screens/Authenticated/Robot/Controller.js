import {View, Text, StyleSheet} from 'react-native'
import Icon from '../../../components/Icon'
import { ColorsBlue } from '../../../constants/palet'


function Controller() {

    function moveHandler(inputType) {
        switch (inputType){
            case 'up':
                console.log('moving forward');
                // ssh move forward command to rasppi
                break;

            case 'right': 
                console.log('moving right');
                // ssh move forward command to rasppi
                break;

            case 'left': 
                console.log('moving left');
                // ssh move forward command to rasppi
                break;

            case 'down': 
                console.log('moving backwards');
                // ssh move forward command to rasppi
                break;
            }
    } 

    return (
        <View style = {styles.outerContainer}>
        
            <View style = {styles.upperContainer}>      
                <Icon 
                icon='arrow-up-circle'
                size={120}
                color={ColorsBlue.blue100}
                onPress = {moveHandler.bind(this, 'up')}
                />
            </View>
            <View style = {styles.middleContainer}>
                 <View style = {styles.middleLeftContainer}> 
                    <Icon 
                    icon='arrow-back-circle'
                    size={120}
                    color={ColorsBlue.blue100}
                    onPress = {moveHandler.bind(this, 'left')}
                    />
                </View> 
                <View style= {styles.middlemiddleContainer}></View>
               <View style = {styles.middleRightContainer}>
                    <Icon 
                    icon='arrow-forward-circle'
                    size={120}
                    color={ColorsBlue.blue100}
                    onPress = {moveHandler.bind(this, 'right')}
                    />
                 </View> 
            </View>
            <View style = {styles.lowerContainer}>
                <Icon 
                icon= 'arrow-down-circle'
                size={120}
                color={ColorsBlue.blue100}
                onPress = {moveHandler.bind(this, 'down')}
                />
            </View>
            <Text>Controller</Text>
        </View>
    )
}

export default Controller


const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20
    },
    upperContainer: {
    },
    middleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    lowerContainer: {
    },
    middleLeftContainer: {
        marginRight: 90
    },
    middleRightContainer: {
    }
})