import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, Animated } from 'react-native';
import { ColorsBlue, ColorsGray } from '../../constants/palet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import Icon from '../../components/Icon';
import { useNavigation } from '@react-navigation/native';
import ModalCredentials from './ModalCredentials';


function LandingPageOne({blinkOpacity}){
    const navigation = useNavigation();
    const [isStopActive, setIsStopActive] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    function loginHandler(){
        setIsStopActive(true);
        setIsLogin(true);
    }

    function registerHandler(){
        setIsStopActive(true);
        setIsLogin(false);
    }

    return (
        <ImageBackground
        source={require('./../../../assets/planets/landing_page.png')}
        style={styles.backgroundImage}
        resizeMode="stretch"
    >

        <Text style={styles.title}>Learning Bot</Text>
        <Text style={[styles.title, { fontWeight: '200', marginTop: 0, fontSize: 24, marginRight: 2 }]}>Draait om jou</Text>
        <View style={styles.buttonOuterContainer}>
            <View style={styles.button}>

            <TouchableOpacity 
            style={styles.buttonContainer}
            onPress = {loginHandler}>
                <BlurView intensity={8} style={{ flex: 1, borderRadius: 5, overflow: 'hidden', justifyContent: 'center' }}>
                    
                    <Text style={styles.buttonText}>Login</Text>
                </BlurView>
            </TouchableOpacity>
                
            <TouchableOpacity 
            style={styles.buttonContainer}
            onPress = {registerHandler}>
                <BlurView intensity={8} style={{ flex: 1, borderRadius: 5, overflow: 'hidden', justifyContent: 'center' }}>
                    
                    <Text style={styles.buttonText}>Register</Text>
                </BlurView>
            </TouchableOpacity>
                
            <TouchableOpacity style={styles.buttonContainer}>
                <BlurView intensity={8} style={{ flex: 1, borderRadius: 5, overflow: 'hidden', justifyContent: 'center' }}>
                    
                    <Text style={styles.buttonText}>Contact</Text>
                </BlurView>
            </TouchableOpacity>
                
                
            </View>
        </View>
        <View style = {{marginBottom: 35}}>
            <Icon
                size = {50}
                icon = "robot"
                differentDir={true}
                color = {ColorsBlue.blue100}
                addStyle={{opacity: 0.2}}
            />
        </View>

        <Animated.View style={{ opacity: blinkOpacity, position: 'absolute', bottom: 10, left: 50 }}>
            <Icon
                size={25}
                icon="arrow-down-bold-circle-outline"
                differentDir={true}
                color={ColorsBlue.blue100}
                addStyle={{ opacity: 0.2 }}
            />
        </Animated.View>

        <Animated.View style={{ opacity: blinkOpacity, position: 'absolute', bottom: 10, right: 50 }}>
            <Icon
                size={25}
                icon="arrow-down-bold-circle-outline"
                differentDir={true}
                color={ColorsBlue.blue100}
                addStyle={{ opacity: 0.2 }}
            />
        </Animated.View>

        <ModalCredentials 
            isStopActive = {isStopActive}
            setIsStopActive={setIsStopActive}
            isLogin = {isLogin}
        />
    </ImageBackground>
    )
}

export default LandingPageOne;


const styles = StyleSheet.create({
    backgroundImage: {
        height: Dimensions.get('window').height * 0.905,//0.8925, // Set the height greater than the screen height
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        color: ColorsBlue.blue100,
        textAlign: 'center',
        marginTop: 100,
        fontWeight: 'bold',
    },
    buttonOuterContainer: {
        justifyContent: 'flex-end',
        width: "100%",
        flex: 1
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginBottom: 50,

    },
    buttonContainer: {
            width: 100,
            height: 55,
            paddingVertical: 0.4,
            borderRadius: 5,
            borderColor: ColorsBlue.blue700,
            borderWidth: 0.6,
            justifyContent: 'center',
            shadowColor: 'black', // Change shadow color to 'black' for better visibility
            shadowOffset: { width: 0, height: 2 }, // Increase the height offset
            shadowOpacity: 1, // Lower the shadow opacity to make it more subtle
            shadowRadius: 4,
            elevation: 2,
    },
    buttonText: {
        color: ColorsBlue.blue50,
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '400',
    },
});