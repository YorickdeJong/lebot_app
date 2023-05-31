
import {  View } from 'react-native';
import { ColorsBlue, } from '../../../constants/palet';
import Icon from '../../Icon';
import React from 'react';

function SwitchScreens({prevSlideHandler, nextSlideHandler, slideCount, slideCountEnd}){

    return(
        <View style = {{flexDirection: 'row', flex: 1, justifyContent: 'center',  }}>
                {slideCount > 0  && (
                
                    <Icon 
                    onPress = {prevSlideHandler}
                    size = {40}
                    icon = "navigate-before"
                        color = {ColorsBlue.blue400}
                        addStyle={{marginHorizontal: 10, marginVertical: 2}}
                        MaterialIconsDir={true}
                    />
                )}

                {!slideCountEnd && <Icon 
                    onPress = {nextSlideHandler}
                    size = {40}
                    color = {ColorsBlue.blue400}
                    icon = "navigate-next"
                    addStyle={{marginHorizontal: 10, marginVertical: 2}}
                    MaterialIconsDir={true}
                    />
                }
        </View>
    )
}

export default React.memo(SwitchScreens);

