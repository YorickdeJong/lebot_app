import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Animated, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { ColorsBlue, ColorsGray } from '../../constants/palet';
import { BlurView } from 'expo-blur';
import Icon from '../../components/Icon';
import { useNavigation } from '@react-navigation/native';
import ModalCredentials from './ModalCredentials';


const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
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
        resizeMode='cover'
    >

        <Text style={styles.title}>Learning Bot</Text>
        <Text style={[styles.title, { fontWeight: '200', marginTop: 0, fontSize: 24, marginRight: 2 }]}>Draait om jou</Text>
        <View style={styles.buttonOuterContainer}>
            <View style={styles.button}>

            { Platform.OS === 'ios'  ? 
            (<>
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
            </>) : 
            (
            <>
                <TouchableOpacity 
                style={styles.buttonContainer}
                onPress = {loginHandler}>
                    <View style={{ flex: 1, borderRadius: 5, overflow: 'hidden', justifyContent: 'center', backgroundColor: 'rgba(50,50,50,0.12)' }}>
                        <Text style={styles.buttonText}>Login</Text>
                    </View>
                </TouchableOpacity>
                    
                <TouchableOpacity 
                style={styles.buttonContainer}
                onPress = {registerHandler}>
                    <View  style={{ flex: 1, borderRadius: 5, overflow: 'hidden', justifyContent: 'center', backgroundColor: 'rgba(50,50,50,0.12)' }}>
                        
                        <Text style={styles.buttonText}>Register</Text>
                    </View>
                </TouchableOpacity>
                    
                <TouchableOpacity style={styles.buttonContainer}>
                    <View style={{ flex: 1, borderRadius: 5, overflow: 'hidden', justifyContent: 'center', backgroundColor: 'rgba(50,50,50,0.12)' }}>
                        
                        <Text style={styles.buttonText}>Contact</Text>
                    </View>
                </TouchableOpacity>
            </>
            )
            }  
                
            </View>
        </View>
        <View style = {{position: 'absolute', bottom: '3%'}}>
            <Icon
                size = {50}
                icon = "robot"
                differentDir={true}
                color = {ColorsBlue.blue100}
                addStyle={{opacity: 0.2}}
            />
        </View>

        <Animated.View style={{ opacity: blinkOpacity, position: 'absolute', bottom: '3%', left: 50 }}>
            <Icon
                size={25}
                icon="arrow-down-bold-circle-outline"
                differentDir={true}
                color={ColorsBlue.blue100}
                addStyle={{ opacity: 0.2 }}
            />
        </Animated.View>

        <Animated.View style={{ opacity: blinkOpacity, position: 'absolute', bottom: '3%', right: 50 }}>
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
        alignItems: 'center',
        flex: 1
        // width: screenWidth,
        // height: screenHeight,
    },
    title: {
        fontSize: 36,
        color: ColorsBlue.blue100,
        textAlign: 'center',
        marginTop: 100,
        fontWeight: 'bold',
    },
    buttonOuterContainer: {
        position: 'absolute',
        bottom: '15%',
        width: "100%",
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,

    },
    buttonContainer: {
        width: 100,
        height: 55,
        paddingVertical: 0.4,
        borderRadius: 5,
        borderColor: ColorsBlue.blue700,
        borderWidth: 0.6,
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
            }),
    },
    buttonText: {
        color: ColorsBlue.blue50,
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '400',
    },
});