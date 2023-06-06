



        


import { Modal, StyleSheet, Text, View } from "react-native";
import BlurWrapper from "../../../UI/BlurViewWrapper";
import Icon from "../../../Icon";
import { ColorsBlue, ColorsGray } from "../../../../constants/palet";


function ModalMotorCriteria({toggleInfoModal, setToggleInfoModal, acceleration, meanSpeed}) {
    const accelerationLower = acceleration * 0.9;
    const accelerationHigher = acceleration * 1.1;
    const distance = (meanSpeed * 15 * 0.8 * 0.9).toFixed(3);
    const meanSpeedLower = (meanSpeed * 0.8 * 1.1).toFixed(3);

    return (
        <Modal
        visible={toggleInfoModal}
        transparent
        animationType="fade"
        >
            <BlurWrapper
            style={styles.modalContainer} 
            intensity={20}
            customColor={'rgba(40,40,72, 0.95)'}>
            <View style={[styles.modal]}>
                    <View style={styles.closeIcon}>
                        <Icon 
                        icon="close-circle"
                        size={25}
                        color={ColorsGray.gray700}
                        onPress={() => setToggleInfoModal(false)}
                        />
                    </View>
                    <Text style={{fontSize: 21, marginBottom: 15, marginTop: 15, color: ColorsBlue.blue100, fontWeight: 'bold'}}>Motor Criteria</Text>
                    <View style = {styles.textContainer}>
                        <Text style = {styles.buttonText}>1. De snelheid is groter dan, of gelijk aan {accelerationLower} m/s² en kleiner dan, of gelijk aan {accelerationHigher} m/s²</Text>
                    </View>
                    <View style = {styles.textContainer}>
                        <Text style = {styles.buttonText}>2. De gemiddelde snelheid is groter dan {meanSpeedLower} m/s</Text>
                    </View>

                    <View style = {styles.textContainer}>
                        <Text style = {styles.buttonText}>3. De afgelegde afstand na 15 seconden bij de maximale snelheid is groter dan {distance} m</Text>
                    </View>

                    <View style = {styles.textContainer}>
                        <Text style = {styles.buttonText}>4. De maximale snelheid is groter dan 0.33 m/s</Text>
                    </View>

                    <View style = {[styles.textContainer, {marginBottom: 20}]}>
                        <Text style = {styles.buttonText}>5. De motor staat still na 1 seconde</Text>
                    </View>
            </View>
            </BlurWrapper>
        </Modal>
    )
}

export default ModalMotorCriteria;

const styles = StyleSheet.create({
    textContainer: {
        marginVertical: 10,
        width: '100%',
        borderTopColor: ColorsBlue.blue700,
        borderTopWidth: 1,
        paddingTop: 15,
        paddingHorizontal: 15
    },
    modal: {
        width: '85%',
        borderRadius: 20,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue900,
        backgroundColor: ColorsBlue.blue1300,
        shadowColor: 'rgba(0,0,0,1)',
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
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },    
    closeIcon: {
        position: 'absolute',
        top: 5,
        left: 5
    },
    button: {
        backgroundColor: ColorsBlue.blue1200,
        borderRadius: 15,
        padding: 13,
        width: 200,
        marginVertical: 5,
        alignItems: 'center',
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
        elevation: 5,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    buttonText: {
        color: ColorsGray.gray200,
        textAlign: 'center',
        fontSize: 17,
        lineHeight: 28,

    }
})
