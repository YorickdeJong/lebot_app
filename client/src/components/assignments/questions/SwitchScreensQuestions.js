
import {  View, StyleSheet } from 'react-native';
import { ColorsBlue, } from '../../../constants/palet';
import Icon from '../../Icon';
import { TouchableOpacity } from 'react-native-gesture-handler';

function SwitchScreensQuestions({prevSlideHandler, nextSlideHandler, slideCount, slideCountEnd, addStyle, noForwardArrow}){

    console.log(!noForwardArrow &&0)
    return(
        <View style = {addStyle}>
            <View style = {styles.leftSlider}>
                    {slideCount > 0  &&  (
                    
                         <Icon 
                         onPress = {() => {
                            console.log('Calling prevSlideHandler');
                            prevSlideHandler();
                            console.log('prevSlideHandler called');
                            }}
                            size = {28}
                            icon = "navigate-before"
                            color = {ColorsBlue.blue400}
                            addStyle={{marginHorizontal: 10, marginVertical: 2}}
                            MaterialIconsDir={true}
                        />
                        
                    )}
            </View>
            <View style = {styles.rightSlider}>
                    {!slideCountEnd && !noForwardArrow && <Icon 
                        onPress = {nextSlideHandler}
                        size = {28}
                        color = {ColorsBlue.blue400}
                        icon = "navigate-next"
                        addStyle={{marginHorizontal: 10, marginVertical: 2}}
                        MaterialIconsDir={true}
                        />
                    }
            </View>
        </View>
    )
}

export default SwitchScreensQuestions;


const styles = StyleSheet.create({
    leftSlider: {
        position: 'absolute',
        top: 0,
        right: 32
    },
    rightSlider: {
        position: 'absolute',
        top: 0,
        right: 0
    }
})

