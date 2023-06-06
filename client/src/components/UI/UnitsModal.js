import { Modal, StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import { ColorsBlue } from "../../constants/palet";
import Icon from "../Icon";
import { LinearGradient } from "expo-linear-gradient";
import BlurWrapper from "./BlurViewWrapper";
import { Text } from "react-native";


function UnitsModal({showModal, setShowModal, setUnitText}) {

    function setUnitTextHandler(unit) {
        setUnitText(unit);
        setShowModal(false);
    }

    const addStyle = {marginHorizontal: 11}
    return (
        <Modal
        visible={showModal}
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
                            <View style = {{ flexDirection: 'row',}}>
                                <TouchableOpacity 
                                onPress = {() => setUnitTextHandler('m')}
                                style = {styles.unitContainer}
                                >
                                    <Text style = {styles.unitText}>m</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                onPress = {() => setUnitTextHandler('s')}
                                style = {styles.unitContainer}
                                >
                                    <Text style = {styles.unitText}>s</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                onPress = {() => setUnitTextHandler('m/s')}
                                style = {styles.unitContainer}
                                >
                                    <Text style = {styles.unitText}>m/s</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                onPress = {() => setUnitTextHandler('m/s²')}
                                style = {styles.unitContainer}
                                >
                                    <Text style = {styles.unitText}>m/s²</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    onPress = {() => setUnitTextHandler('N')}
                                    style = {styles.unitContainer}
                                    >
                                    <Text style = {styles.unitText}>N</Text>
                                </TouchableOpacity>

                            </View>
                            <View style = {{ flexDirection: 'row',}}>

                                <TouchableOpacity 
                                onPress = {() => setUnitTextHandler('A')}
                                style = {styles.unitContainer}
                                >
                                    <Text style = {styles.unitText}>A</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                onPress = {() => setUnitTextHandler('V')}
                                style = {styles.unitContainer}
                                >
                                    <Text style = {styles.unitText}>V</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                onPress = {() => setUnitTextHandler('Ω')}
                                style = {styles.unitContainer}
                                >
                                    <Text style = {styles.unitText}>Ω</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress = {() => setUnitTextHandler('W')}
                                    style = {styles.unitContainer}
                                    >
                                    <Text style = {styles.unitText}>W</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    <View style = {{position: 'absolute', top: 8, left: 5 }}>
                        <Icon
                        icon="close"
                        size={24}
                        color={ColorsBlue.blue100}
                        onPress={() => setShowModal(false)}
                        />
                    </View>
                    </LinearGradient>
                </View>
            </BlurWrapper>
        </Modal>
    )
}

export default UnitsModal;

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
        width: '90%',
        height: 130,
        marginBottom: 100
    },
    iconContainer: {
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    unitContainer: {
        width: 50,
        height: 50,
        borderRadius: 20,
        backgroundColor: ColorsBlue.blue1100,
        justifyContent: 'center',
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
        marginHorizontal: 5,
        marginVertical: 5
    },
    unitText: {
        fontSize: 20,
        color: ColorsBlue.blue100,
        textAlign: 'center',
    }
})