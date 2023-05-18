import { useContext} from "react";
import { GroupTeacherContext } from "../../store/group-teacher-context";
import { Modal, View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import Icon from '../Icon';
import { ColorsBlue, ColorsGray} from "../../constants/palet";
import { TimeContext } from "../../store/time-context";




function CountDownModal({timeLeft, lesson}) {
    const timeCtx = useContext(TimeContext);


    //add timerCtx -> check if active for certain class_id, then display green color else gray
    return (
        <Modal
        visible={timeCtx.showTimeModal}
        transparent
        animationType="fade"
        >
            <BlurView style={styles.modalContainer} intensity={20}>
                <View style={styles.modal}>
                    <View style={styles.closeIcon}>
                        <Icon 
                        icon="close-circle"
                        size={25}
                        color={ColorsGray.gray700}
                        onPress={() => timeCtx.toggleTimeModal()}
                        />
                    </View> 
                    <Text style={styles.title}>Tijd voor Les {lesson}: {timeCtx.formatTimeLeft(timeLeft)}</Text>
                </View>
            </BlurView>
        </Modal>
    )
}

export default CountDownModal


const styles = StyleSheet.create({
    title: {
        fontSize: 22, 
        color: ColorsBlue.blue50, 
        textShadowColor: ColorsBlue.blue1400,
        textShadowOffset: { height: 3, width: 1 },
        textShadowRadius: 4,
    },
    modal: {
        width: '80%',
        height: 100,
        borderRadius: 5,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        backgroundColor: ColorsBlue.blue1100,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: 180,
        color: ColorsBlue.blue50,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 4
    },
    createButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 5,
        padding: 10,
        width: 180,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 4
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },    
    closeIcon: {
        position: 'absolute',
        top: 5,
        left: 5,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
    }
})