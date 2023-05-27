import {View, StyleSheet, Pressable, Text, TouchableOpacity} from 'react-native'
import { ColorsBlue } from '../../constants/palet'
import {Ionicons} from '@expo/vector-icons'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from '../Icon';

function UserProfileBar({text, isBorder, style, onPress, userInfo}) {
    
    return (
        <View>
            <TouchableOpacity 
            onPress = {onPress}
            style = {[styles.bar, style]}>
                
                <View style ={styles.textContainer}>
                    <Text style={styles.text}>
                        {text}
                    </Text>
                    <Text style = {[styles.text, {marginLeft: 0, width: 120, marginRight: scale(80)}]}>
                        {userInfo}
                    </Text>
                    {(text === "Wachtwoord" || text === "Email address" || text === 'Gebruikers naam' )&& 
                        <Icon 
                            icon = "chevron-forward-outline"
                            size = {20}
                            color = {ColorsBlue.blue200}
                            addStyle = {{position: 'absolute', right: scale(20)}}
                            onPress = {onPress}
                        />
                    }
                </View>
            </TouchableOpacity>
            <View style = {isBorder ? styles.border : null} />  
        </View>

    )
}

export default UserProfileBar

const styles = StyleSheet.create({ 
    bar: {
        height: verticalScale(50),
        justifyContent: 'center',
    },
    text: {
        width: scale(132),
        marginLeft: scale(20),
        fontSize: 16,
        color: ColorsBlue.blue200,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
    },
    border: {
        height: 1,
        marginHorizontal:15,
        backgroundColor: ColorsBlue.blue400,
        elevation: 3, 
        shadowColor: ColorsBlue.blue1200,
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowOffset: {height: 2, width: 0}
    },
    pressed: {
        opacity: 0.7
    },
})