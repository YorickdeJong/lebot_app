import { CarContext } from "../../store/car-context"
import {Modal, View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator} from 'react-native';
import Icon from "../Icon";
import { BlurView } from "expo-blur";
import { ColorsBlue, ColorsGray } from "../../constants/palet";
import { useContext, useState } from "react";
import BlurWrapper from "../UI/BlurViewWrapper";




function InstructionModalRobotStore({showModalTemp, setShowModalTemp}) {
    const carCtx = useContext(CarContext)

    return (
        <Modal
        visible={!carCtx.showModal ? carCtx.showModal : showModalTemp}
        transparent
        animationType="fade"
        >
            <BlurWrapper 
            style={styles.modalContainer} 
            intensity={20}
            customColor={'rgba(40,40,72, 0.95)'}>

                <View style={styles.modal}>
                    <View style={styles.closeIcon}>
                        <Icon 
                        icon="close-circle"
                        size={25}
                        color={ColorsGray.gray700}
                        onPress={() => setShowModalTemp(false)}
                        />
                    </View>
                    <Text style={{fontSize: 22, marginBottom: 15, marginTop: 15, textAlign: 'center', color: ColorsBlue.blue100}}>Uitleg Rover Winkel</Text>
                    <Text style={{fontSize: 16, lineHeight: 26, paddingLeft: 15, color: ColorsGray.gray300}}>In deze winkel kan je upgrades kopen voor je robot met je verdiende geld. Zo kan je de maximale snelheid, versnelling en energie opslag verbeteren. {'\n\n'}Je kunt hier ook de rover verbinnen met een wifi netwerk door op het cast icoontje te drukken, links boven. Hierdoor heb je internet toegang hebt terwijl je verbonden bent met de rover</Text>
                    
                    <TouchableOpacity onPress={() => carCtx.setShowModalHandler()} style={styles.createButton}>
                        <Text style={styles.buttonText}>{'Laat niet meer zien'}</Text>
                    </TouchableOpacity>
                </View>
            </BlurWrapper>
        </Modal>
    )
}

export default InstructionModalRobotStore

const styles = StyleSheet.create({
    modal: {
        width: '85%',
        padding: 10,
        paddingHorizontal: 30,
        maxheight: Platform.OS === 'ios' ? 400 : 435,
        borderRadius: 20,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        backgroundColor: ColorsBlue.blue1150,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    createButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 20,
        padding: 10,
        width: 180,
        marginTop: 30,
        marginBottom: 15
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },    
    closeIcon: {
        position: 'absolute',
        top: '3%',
        left: '5%'
    }
})


