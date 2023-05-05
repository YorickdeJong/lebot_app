import {View, Text, StyleSheet, Modal, TextInput, TouchableOpacity} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../constants/palet'
import Icon from '../Icon'
import { BlurView } from 'expo-blur'



function SolarModal({showModal, setModal}) {
    return (
        <Modal
        visible={showModal} 
        animationType="fade"
        transparent
        >
            <BlurView style={styles.modalContainer} intensity={20}>
                <View style={styles.modal}>
                    <View style={styles.closeIcon}>
                            <Icon 
                            icon="close-circle"
                            size={25}
                            color={ColorsGray.gray700}
                            onPress={() => setModal(false)}
                            />
                        </View>
                        <Text style = {styles.text}>
                        In dit onderdeel test jij jouw gevonden weerstand tegen zonnestormen. Er worden willekeurige zonnestormen gesimuleerd. 
                        {'\n\n'}Er gaat dan een timer lopen, door op de knop te drukken kan je deze tegen gaan. {'\n\n'}Let op! Het kan voorkomen dat je meerdere keren op de knop moet drukken, je ziet links boven het aantal keer dat je moet drukken. 
                        </Text>
                </View>
                
            </BlurView>
        </Modal>
    )
}


export default SolarModal


const styles = StyleSheet.create({
    modal: {
        width: '80%',
        height: 350,
        borderRadius: 5,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        backgroundColor: 'rgba(20, 20, 80, 0.75)',
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
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
        color: ColorsBlue.blue50
      },
    createButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 5,
        padding: 10,
        width: 200
    },
    text: {
        color: ColorsBlue.blue50,
        fontSize: 16,
        marginTop: 15,
        marginLeft: 20,
        marginRight: 15,
        textShadowColor: ColorsBlue.blue1400,
        textShadowOffset: { height: 3, width: 1 },
        textShadowRadius: 1,
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
