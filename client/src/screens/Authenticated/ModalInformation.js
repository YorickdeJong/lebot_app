
import {Modal, View, StyleSheet, Text, Platform} from 'react-native';
import Icon from '../../components/Icon';
import BlurWrapper from '../../components/UI/BlurViewWrapper';
import { ColorsBlue, ColorsGray } from '../../constants/palet';
import { useContext, useEffect, useState } from 'react';
import { TimeContext } from '../../store/time-context';
import { UserProfileContext } from '../../store/userProfile-context';
import { InformationContext } from '../../store/information-context';
import { LinearGradient } from 'expo-linear-gradient';
import ChangeButton from '../../components/UI/ChangeButton';
import InformationButton from '../../components/UI/InformationButton';
import TextContainerInformation from '../../components/UI/TextContainerInformation';
import { useNavigation } from '@react-navigation/native';


function ModalInformation({}) {
    const informationCtx = useContext(InformationContext);
    const navigation = useNavigation()

    const [subModal, setSubModal] = useState({
        modalOne: false,
        modalTwo: false,
        modalThree: false,
        modalFour: false,
    })
    const [title, setTitle] = useState("Aanpak Problemen")
    const [text, setText] = useState("")

    function subModalHandler(choice){
        switch(choice){
            case 0:
                console.log('check')
                informationCtx.setShowInformationModal(false)
                informationCtx.setShowBeginningScreen(true)
                navigation.navigate('AppExplanation')
                break;
            case 1:
                setSubModal({
                    modalOne: true,
                    modalTwo: false,
                    modalThree: false,
                    modalFour: false,
                })
                setTitle("Probleem Begrijpen")
                setText(`- Welke informatie heb je gekregen? \n\n- Welk probleem moet je oplossen? \n\n- Kan je het probleem in je eigen woorden opschrijven? \n\n- Hoe kan ik dit probleem visualiseren? Met een tekening of schets?`)
                break;
            case 2:
                setSubModal({
                    modalOne: false,
                    modalTwo: true,
                    modalThree: false,
                    modalFour: false,
                })
                setTitle("Strategie Kiezen")
                setText(`- Waar ben je dit probleem eerder tegengekomen? \n\n- Hoe zou je dit probleem kunnen opsplitsen in kleinere problemen? \n\n- Welke formules kan je gebruiken en waarom?`)
                break;
            case 3:
                setSubModal({
                    modalOne: false,
                    modalTwo: false,
                    modalThree: true,
                    modalFour: false,
                })
                setTitle("Uitvoeren")
                setText(`- Is de volgorde van jouw stappen correct? \n\n- Kloppen de eenheden?`)
                break;
            case 4:
                setSubModal({
                    modalOne: false,
                    modalTwo: false,
                    modalThree: false,
                    modalFour: true,
                })
                setTitle("Controleren")
                setText(`- Is jouw oplossing logisch? Bijv. een vliegtuig die 5 km/uur vliegt is niet mogelijk. \n\n- Heb je daadwerkelijk het probleem opgelost?`)
                break;
            default:
                setSubModal({
                    modalOne: false,
                    modalTwo: false,
                    modalThree: false,
                    modalFour: false,
                })
                setTitle("Aanpak Problemen")
                setText("")
                break;
        }
    }

    const isSubModule = subModal.modalOne || subModal.modalTwo || subModal.modalThree || subModal.modalFour

    return (
        <Modal
        visible={informationCtx.showInformationModal}
        transparent
        animationType="fade"
        style = {{flex: 1}}
        >
            <BlurWrapper style={styles.modalContainer} intensity={20} tint = 'dark' customColor={'rgba(20, 20, 35, 0.6)'}> 
                <View style = {[styles.shadow, {marginTop: 15 }]}>
                        <LinearGradient
                            style = {styles.textContainer}
                            colors={[ColorsBlue.blue1150, ColorsBlue.blue1200]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                                >
                                <View style = {styles.header}>
                                    <View style = {styles.iconRight}>
                                            <Icon 
                                            icon="close" 
                                            size={28} 
                                            color={ColorsBlue.blue200} 
                                            onPress={() => informationCtx.setShowInformationModal(false)}
                                            />
                                    </View>
                                    {isSubModule &&
                                        <View style = {styles.iconLeft}>
                                            <Icon 
                                                icon="arrow-left"
                                                size={24}
                                                color={ColorsBlue.blue100}
                                                onPress={() => subModalHandler(0)}
                                                differentDir={true}
                                            />
                                        </View>
                                    }
                                    <Text style = {[styles.title, {marginBottom: 0}]}>{title}</Text>
                                </View>
                                {!isSubModule &&
                                <>
                                    <InformationButton 
                                        text = "App Instructies"
                                        headerHeight={30}
                                        onPress = {() => subModalHandler(0)}
                                    />
                                    <InformationButton 
                                        text = "Probleem Begrijpen"
                                        onPress = {() => subModalHandler(1)}
                                    />
                                    <InformationButton 
                                        text = "Strategie Kiezen"
                                        onPress = {() => subModalHandler(2)}
                                    />
                                    <InformationButton 
                                        text = "Uitvoeren"
                                        onPress = {() => subModalHandler(3)}
                                    />
                                    <InformationButton 
                                        text = "Controleren"
                                        marginBottom = {30}
                                        onPress = {() => subModalHandler(4)}
                                    />
                                </>
                                }
                            {isSubModule &&
                            <View style = {{marginBottom: 20}}>
                                <TextContainerInformation 
                                    text = {text}
                                />
                            </View>
                                
                            }
                        </LinearGradient>
                    </View>
            </BlurWrapper>
        </Modal>
    )
}

export default ModalInformation


const styles = StyleSheet.create({
    textContainer: {
        marginBottom: 0, 
        borderRadius: 20,
        borderWidth: 0.6,
        borderColor: 'rgba(77, 77, 77, 0.40)',
    },
    shadow: {
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 5,
        backgroundColor: Platform.OS === 'android' ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
        paddingRight: 3,
        paddingBottom: 3,
        width: '90%',
        marginBottom: 100,
        borderRadius: 20,
        // alignSelf: 'center',
    },
    header: {
        height: 60,
        backgroundColor: 'rgba(30, 30, 120, 1)',
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    iconRight: {
        position: 'absolute',
        right: 8,
        top: 16,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
    },  
    iconLeft: {
        position: 'absolute',
        left: 8,
        top: 12,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
    },
    modal: {
        borderRadius: 5,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        flex: 1,

    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        
    },
    title: {
        color: ColorsBlue.blue100,
        fontSize: 25    ,
        alignSelf: 'center',
        textShadowColor: ColorsBlue.blue1400,
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 2,
    },
})