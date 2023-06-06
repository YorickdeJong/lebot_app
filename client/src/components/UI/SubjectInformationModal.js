import { Modal, StyleSheet, Text, View } from "react-native";
import BlurWrapper from "./BlurViewWrapper";
import Icon from "../Icon";
import { ColorsBlue, ColorsGray } from "../../constants/palet";



function SubjectInformationModal({showModal, setShowModal, text}) {

    return (
        <Modal
        visible={showModal}
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
                        onPress={() => setShowModal(false)}
                        />
                    </View>
                    <Text style={{fontSize: 16, lineHeight: 26, marginVertical: 15,  color: ColorsGray.gray300}}>{text}</Text>
                </View>
            </BlurWrapper>
        </Modal>
    )
}

export default SubjectInformationModal

const styles = StyleSheet.create({
    modal: {
        width: '90%',
        padding: 10,
        paddingHorizontal: 35,
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


