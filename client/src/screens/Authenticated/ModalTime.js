
import {Modal, View, StyleSheet, Text} from 'react-native';
import Icon from '../../components/Icon';
import BlurWrapper from '../../components/UI/BlurViewWrapper';
import { ColorsBlue, ColorsGray } from '../../constants/palet';
import { useContext, useEffect, useState } from 'react';
import { TimeContext } from '../../store/time-context';
import { UserProfileContext } from '../../store/userProfile-context';

function CountDownModal({lesson}) {
    const timeCtx = useContext(TimeContext);
    const [timeLeft, setTimeLeft] = useState(0);
    const userprofileCtx = useContext(UserProfileContext)
    const class_id = userprofileCtx.userprofile.class_id
    const currentActiveLessonData = timeCtx.filterSpecificLesson(class_id)

    useEffect(() => {
        if (currentActiveLessonData && currentActiveLessonData.duration !== 10000) {
            const interval = setInterval(() => {
                const time = timeCtx.calculateTimeLeft(currentActiveLessonData);
                setTimeLeft(time);
            }, 1000); // Update every second
        
            return () => {
            clearInterval(interval);
            };
        }
      }, [currentActiveLessonData]);

    //add timerCtx -> check if active for certain class_id, then display green color else gray
    
    const timeDisplay = (currentActiveLessonData && currentActiveLessonData.duration !== 10000) ? `Resterende tijd: ${timeCtx.formatTimeLeft(timeLeft)}` : `Les Actief: Geen tijds limiet`
    return (
        <Modal
        visible={timeCtx.showTimeModal}
        transparent
        animationType="fade"
        >
            <BlurWrapper style={styles.modalContainer} intensity={20}>
                <View style={styles.modal}>
                    <View style={styles.closeIcon}>
                        <Icon 
                        icon="close-circle"
                        size={25}
                        color={ColorsGray.gray700}
                        onPress={() => timeCtx.toggleTimeModal()}
                        />
                    </View> 
                    <Text style={styles.title}>{timeDisplay}</Text>
                </View>
            </BlurWrapper>
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
        width: '90%',
        height: 90,
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