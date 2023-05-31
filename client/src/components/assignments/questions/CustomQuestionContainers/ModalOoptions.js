

import {Modal, View, Text, StyleSheet, TextInput} from 'react-native';
import { ColorsBlue } from '../../../../constants/palet';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../../../Icon';
import BlurWrapper from '../../../UI/BlurViewWrapper';

function ModalOptions({toggleModal, setToggleModal, chooseEqualityHandler, currentIndex}) {


    const addStyle = {marginHorizontal: 11}
    return (
        <Modal
        visible={toggleModal}
        animationType='fade'
        transparent
        >
          <BlurWrapper style={styles.modalContainer} intensity={20} customColor={'rgba(30, 30, 80, 1)'}>
                <View style = {styles.shadow}>
                    <LinearGradient 
                    style = {[styles.modal, ]}
                    colors={[ColorsBlue.blue1200, ColorsBlue.blue1100]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                        >
                        <View style = {styles.iconContainer}>
                            <Icon 
                                size = {40}
                                color = {ColorsBlue.blue100}
                                onPress = {() => chooseEqualityHandler(currentIndex.questionNumber, currentIndex.index, 'equal')}
                                icon = 'equal'
                                differentDir
                                addStyle = {addStyle}
                            />
                            <Icon 
                                size = {40}
                                color = {ColorsBlue.blue100}
                                onPress = {() => chooseEqualityHandler(currentIndex.questionNumber, currentIndex.index, 'greater-than-or-equal')}
                                icon = 'greater-than-or-equal'
                                differentDir
                                addStyle = {addStyle}
                            />
                            <Icon 
                                size = {40}
                                color = {ColorsBlue.blue100}
                                onPress = {() => chooseEqualityHandler(currentIndex.questionNumber, currentIndex.index, 'less-than-or-equal')}
                                icon = 'less-than-or-equal'
                                differentDir
                                addStyle = {addStyle}
                            />
                            <Icon 
                                size = {40}
                                color = {ColorsBlue.blue100}
                                onPress = {() => chooseEqualityHandler(currentIndex.questionNumber, currentIndex.index, 'greater-than')}
                                icon = 'greater-than'
                                differentDir
                                addStyle = {addStyle}
                            />
                            <Icon 
                                size = {40}
                                color = {ColorsBlue.blue100}
                                onPress = {() => chooseEqualityHandler(currentIndex.questionNumber, currentIndex.index, 'less-than')}
                                icon = 'less-than'
                                differentDir
                                addStyle = {addStyle}
                            />
                        </View>
                    <View style = {{position: 'absolute', top: 8, left: 5 }}>
                        <Icon
                        icon="close"
                        size={24}
                        color={ColorsBlue.blue100}
                        onPress={() => setToggleModal(false)}
                        />
                    </View>
                    </LinearGradient>
                </View>
            </BlurWrapper>
        </Modal>

    )
}


export default ModalOptions
const styles = StyleSheet.create({
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    modal: {
        borderRadius: 20,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        flex: 1,
    },
    shadow: {
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
        width: '88%',
        height: 100,
        marginBottom: 100
    },
    iconContainer: {
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1

    }
})