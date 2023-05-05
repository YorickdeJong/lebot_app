import React from 'react';
import { StyleSheet, View, Modal, Text, TouchableWithoutFeedback, Platform, TouchableOpacity} from 'react-native';
import { BlurView } from 'expo-blur';
import { ColorsBlue } from '../../constants/palet';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import PressableButton from '../../components/robot/robot_commands/PressableButton';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

function ModalCredentials({ isStopActive, setIsStopActive, isLogin}) {
    const navigation = useNavigation();


    function redirectLoginHandler(type){
        setIsStopActive(false);
        console.log('pressed')
        switch(type){
            case 'teacher':
                navigation.navigate('Login', {
                    type: 'teacher'
                })
                break;
            case 'student':
                navigation.navigate('Login', {
                    type: 'student'
                })
                break;

            case 'admin':
                navigation.navigate('Login', {
                    type: 'admin'
                })
                break;

        }
    }

    function redirectRegisterHandler(type){
        setIsStopActive(false);
        switch(type){
            case 'teacher':
                navigation.navigate('Signup', {
                    type: 'teacher'
                })
                break;
            case 'student':
                navigation.navigate('Signup', {
                    type: 'student'
                })
                break;
        }
    }
    
    
    return (
        <>

        {Platform.OS === 'ios' ?
        (<Modal visible={isStopActive} animationType="fade" transparent>
            <TouchableWithoutFeedback onPress={() => setIsStopActive(false)}>
                <View style={styles.outerContainer}>
                <TouchableWithoutFeedback onPress={() => {}}>
                    <BlurView intensity={20} tint="dark" style={[styles.modalBackground, {height: isLogin ? 250 : 220}]}>
                        <Text style={[styles.text, {marginBottom: 10, fontWeight: '500'}]}>{isLogin ? 'Login' : 'Register'}</Text>

                        <TouchableOpacity style={styles.button} onPress = {isLogin ? redirectLoginHandler.bind(this, 'teacher') : redirectRegisterHandler.bind(this, 'teacher')}>
                            <Text style={styles.text}>Docent</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress = {isLogin ? redirectLoginHandler.bind(this, 'student') : redirectRegisterHandler.bind(this, 'student')}>
                            <Text style={styles.text}>Leerling</Text>
                        </TouchableOpacity>

                        {isLogin && 
                        <>
                            <TouchableOpacity style={styles.button} onPress = {redirectLoginHandler.bind(this, 'admin')}>
                                <Text style={styles.text}>Admin</Text>
                            </TouchableOpacity>
                        </>
                        }

                    </BlurView>
                </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>) : 
        (
            <Modal visible={isStopActive} animationType="fade" transparent>
                <TouchableWithoutFeedback onPress={() => setIsStopActive(false)}>
                    <View style={styles.outerContainer}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View tint="dark" style={[styles.modalBackground, {height: isLogin ? 250 : 195, backgroundColor: 'rgba(100, 100, 100, 0.3)'}]}>
                            <Text style={[styles.text, {marginBottom: 10, fontWeight: '500'}]}>{isLogin ? 'Login' : 'Register'}</Text>
    
                            <TouchableOpacity style={styles.button} onPress = {isLogin ? redirectLoginHandler.bind(this, 'teacher') : redirectRegisterHandler.bind(this, 'teacher')}>
                                <Text style={styles.text}>Docent</Text>
                            </TouchableOpacity>
    
                            <TouchableOpacity style={styles.button} onPress = {isLogin ? redirectLoginHandler.bind(this, 'student') : redirectRegisterHandler.bind(this, 'student')}>
                                <Text style={styles.text}>Leerling</Text>
                            </TouchableOpacity>
    
                            {isLogin && 
                            <>
                                <TouchableOpacity style={styles.button} onPress = {redirectLoginHandler.bind(this, 'admin')}>
                                    <Text style={styles.text}>Admin</Text>
                                </TouchableOpacity>
                            </>
                            }
    
                        </View>
                    </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            )
        }
        </>
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
        marginTop: verticalScale(30),
    },
    modalBackground: {
        height: 250,
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
