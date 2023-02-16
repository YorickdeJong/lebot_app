import {View, StyleSheet, Pressable, Text} from 'react-native'
import { ColorsBlue } from '../../constants/palet'
import {Ionicons} from '@expo/vector-icons'

function UserProfileBar({text, isBorder, style, onPress, userInfo}) {
    
    return (
        <View>
            <Pressable 
            onPress = {onPress}
            style = {({pressed}) => {
                return [[styles.bar, style], pressed && styles.pressed]}}>
                
                <View style ={styles.textContainer}>
                    <Text style={styles.text}>
                        {text}
                    </Text>
                    <Text style = {[styles.text, {marginLeft: 0, marginRight: 50}]}>
                        {userInfo}
                    </Text>
                </View>
            </Pressable>
            <View style = {styles.container}>	
                <View style = {isBorder ? styles.border : null} />  
            </View>
        </View>

    )
}

export default UserProfileBar

const styles = StyleSheet.create({
    container: {
        backgroundColor: ColorsBlue.blue900,
    },      
    bar: {
        height: 50,
        backgroundColor: ColorsBlue.blue900,
        justifyContent: 'center',
    },
    text: {
        width: 100,
        marginLeft: 20,
        fontSize: 16,
        color: ColorsBlue.blue200,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    border: {
        height: 1,
        marginLeft: 20,
        backgroundColor: ColorsBlue.blue400,
        elevation: 3, 
        shadowColor: ColorsBlue.blue1200,
        shadowOpacity: 1,
        shadowRadius: 10000,
        shadowOffset: {height: 2, width: 0}
    },
    pressed: {
        opacity: 0.7
    },
})