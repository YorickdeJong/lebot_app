import React from 'react';
import { StyleSheet, View, Modal, Text, TouchableWithoutFeedback } from 'react-native';
import { BlurView } from 'expo-blur';
import { ColorsBlue } from '../../constants/palet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

function ModalCredentials({ isStopActive, setIsStopActive, isLogin}) {
    const navigation = useNavigation();


    function redirectLoginHandler(type){
        setIsStopActive(false);
        switch(type){
            case 'teacher':
                navigation.navigate('Login', {
                    type: 'Docent'
                })
                break;
            case 'student':
                navigation.navigate('Login', {
                    type: 'Leerling'
                })
                break;
        }
    }

    function redirectRegisterHandler(type){
        setIsStopActive(false);
        switch(type){
            case 'teacher':
                navigation.navigate('Signup', {
                    type: 'Docent'
                })
                break;
            case 'student':
                navigation.navigate('Signup', {
                    type: 'Leerling'
                })
                break;
        }
    }
    
    
    return (
        <Modal visible={isStopActive} animationType="fade" transparent>
            <TouchableWithoutFeedback onPress={() => setIsStopActive(false)}>
                <View style={styles.outerContainer}>
                <TouchableWithoutFeedback onPress={() => {}}>
                    <BlurView intensity={20} tint="dark" style={styles.modalBackground}>
                    <Text style={[styles.text, {marginBottom: 10, fontWeight: '500'}]}>{isLogin ? 'Login' : 'Register'}</Text>

                    <TouchableOpacity style={styles.button} onPress = {isLogin ? redirectLoginHandler.bind(this, 'teacher') : redirectRegisterHandler.bind(this, 'teacher')}>
                        <Text style={styles.text}>Docent</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress = {isLogin ? redirectLoginHandler.bind(this, 'student') : redirectRegisterHandler.bind(this, 'student')}>
                        <Text style={styles.text}>Leerling</Text>
                    </TouchableOpacity>
                    </BlurView>
                </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default ModalCredentials;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { height: 2, width: 0 },
        shadowRadius: 5,
        shadowColor: ColorsBlue.blue1300,
        shadowOpacity: 0.8,
        marginTop: 55,
    },
    modalBackground: {
        height: 195,
        width: 250,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: ColorsBlue.blue1200,
        justifyContent: 'center',
    },
    text: {
        fontSize: 26,
        fontWeight: '400',
        color: ColorsBlue.blue100,
        textAlign: 'center',
    },
    button: {
        backgroundColor: ColorsBlue.blue1200,
        marginHorizontal: 20,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        borderColor: ColorsBlue.blue700,
        borderWidth: 0.9,
        padding: 7,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 2,
        shadowColor: ColorsBlue.blue1300,
        shadowOpacity: 1,
    },
});
