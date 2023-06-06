import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColorsBlue, ColorsGray } from '../../../../constants/palet';
import Icon from '../../../Icon';


function Signs({number, left, right, double, unit, quantity, quantityDouble, unitDouble, customAnswer, customText, onPress, indexEquality, valueDouble}) {
    return (
        <View style = {{flexDirection: 'row', alignItems: 'center', marginVertical: 8,  marginLeft: 11, marginRight: 9}}>
            <Text style = {styles.question}>
                {number}: 
            </Text>
            <Text> </Text>
            {left && 
                <>
                    <Text style = {styles.question}>{((parseFloat(customAnswer) * 0.9).toFixed(3))} {unit}</Text>
                    <Text> </Text>
                    <View style = {{width: 30}}>
                        <Icon 
                        icon = {indexEquality[0].answer ? indexEquality[0].answer : 'checkbox-blank'}
                        size={26}
                        color={indexEquality[0].color}
                        onPress = {onPress.bind(this, number, 0)}
                        differentDir
                        />
                    </View>
                    <Text> </Text>
                    <Text style = {styles.question}>{quantity}</Text>
                </>
            }
            {right &&  
                <>
                    {left && <Text> </Text>} 
                    {!left && 
                    <>
                        <Text style = {styles.question}>{customText}</Text>
                        <Text style = {styles.question}>{quantity}</Text>
                        <Text> </Text>
                    </>
                    }
                    <View style = {{width: 30}}>
                        <Icon 
                        icon = {left ? (indexEquality[1].answer ? indexEquality[1].answer : 'checkbox-blank') : (indexEquality[0].answer ? indexEquality[0].answer : 'checkbox-blank')}
                        size={26}
                        color={left ? indexEquality[1].color : indexEquality[0].color}
                        onPress = {onPress.bind(this, number, left ? 1 : 0)}
                        differentDir
                        />
                    </View>
                    <Text style = {styles.question}>{(parseFloat(customAnswer) * 1.1).toFixed(3)} {unit}</Text>

                </>
            }

            {double && 
            <>
                <Text style = {styles.question}>{quantity}</Text>
                <Text> </Text>
                <View style = {{width: 30}}>
                        <Icon 
                        icon = {indexEquality[0].answer ? indexEquality[0].answer : 'checkbox-blank'}
                        size={26}
                        color={indexEquality[0].color}
                        onPress = {onPress.bind(this, number, 0)}
                        differentDir
                        />
                </View>
                <Text style = {styles.question}>{((parseFloat(customAnswer) * 0.9)).toFixed(3)} {unit}</Text>
                
                <Text style = {styles.question}>{quantityDouble}</Text>
                <Text> </Text>
                <View style = {{width: 30}}>
                        <Icon 
                        icon = {indexEquality[1].answer ? indexEquality[1].answer : 'checkbox-blank'}
                        size={26}
                        color={indexEquality[1].color}
                        onPress = {onPress.bind(this, number, 1)}
                        differentDir
                        />
                </View>
                <Text style = {styles.question}>{valueDouble} {unitDouble}</Text>
            </>
            }
        </View>

    )
}


export default Signs;


const styles= StyleSheet.create({
    descriptionContainer: {
        flexDirection: 'row',
        marginLeft: 12,
        marginRight: 12,
        marginVertical: 4,
    },
    question: {
        fontSize: 17,
        color: ColorsGray.gray400,
        lineHeight: 25
    },

})