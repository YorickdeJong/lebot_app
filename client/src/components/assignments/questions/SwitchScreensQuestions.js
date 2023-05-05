
import {  View, StyleSheet } from 'react-native';
import { ColorsBlue, } from '../../../constants/palet';
import Icon from '../../Icon';
import { TouchableOpacity } from 'react-native-gesture-handler';

function SwitchScreensQuestions({prevSlideHandler, nextSlideHandler, slideCount, slideCountEnd, addStyle}){

    return(
        <View style = {addStyle}>
            <View style = {styles.leftSlider}>
                    {slideCount > 0  && (
                    
                        <Icon 
                         onPress = {() => {
                            console.log('Calling prevSlideHandler');
                            prevSlideHandler();
                            console.log('prevSlideHandler called');
                        }}
                        size = {35}
                        icon = "play-back-circle-outline"
                        color = {ColorsBlue.blue400}
                        addStyle={{marginHorizontal: 10, marginVertical: 2}}
                        />
                    )}
            </View>
            <View style = {styles.rightSlider}>
                    {!slideCountEnd && <Icon 
                        onPress = {nextSlideHandler}
                        size = {35}
                        color = {ColorsBlue.blue400}
                        icon = "play-forward-circle-outline"
                        addStyle={{marginHorizontal: 10, marginVertical: 2}}
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
        top: 2,
        left: 8
    },
    rightSlider: {
        position: 'absolute',
        top: 2,
        right: 8
    }
})

