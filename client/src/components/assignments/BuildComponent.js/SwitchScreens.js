
import {  View } from 'react-native';
import { ColorsBlue, } from '../../../constants/palet';
import Icon from '../../Icon';

function SwitchScreens({prevSlideHandler, nextSlideHandler, slideCount}){

    return(
        <View style = {{flexDirection: 'row', flex: 1, justifyContent: 'center',  }}>
                {slideCount > 0  && (
                
                    <Icon 
                    onPress = {prevSlideHandler}
                    size = {40}
                    icon = "play-back-circle-outline"
                    color = {ColorsBlue.blue200}
                    addStyle={{marginHorizontal: 10, marginVertical: 2}}
                    />
                )}

                    <Icon 
                    onPress = {nextSlideHandler}
                    size = {40}
                    color = {ColorsBlue.blue200}
                    icon = "play-forward-circle-outline"
                    addStyle={{marginHorizontal: 10, marginVertical: 2}}
                    />
        </View>
    )
}

export default SwitchScreens;

