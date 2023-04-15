
import { StyleSheet, View, StatusBar, Alert, Text, Modal, TouchableWithoutFeedback } from "react-native"
import Icon from "../../Icon";
import ToggleMenu from "../../robot/driving_on_command/ToggleMenu";
import { ColorsBlue, ColorsGray, ColorsLighterGold, ColorsTile } from "../../../constants/palet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useContext, useEffect, useState, useRef } from "react";
import {  Header } from 'react-navigation-stack';
import { BlurView } from "expo-blur";
import { Colors } from "react-native/Libraries/NewAppScreen";




function AssignmentOptionsBar({midIcon, rightIcon, midIconHandler, chartLength, currentIndex, redirectToMeasurementHandler, onMetingPressed}){
    const [isStopActive, setIsStopActive] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const metingRef = useRef(null);
    const [metingPosition, setMetingPosition] = useState({ x: 0, y: 0 });

    const toggleModal = () => {
        setIsStopActive(!isStopActive); 
    };

    useEffect(() => {
        const headerHeight = Header.HEIGHT + StatusBar.currentHeight;
        setHeaderHeight(headerHeight);
    }, []);

    function OptionsBox() {
        return (
            <TouchableWithoutFeedback onPress={() => setOptionsVisible(false)}>
                <View style={styles.modalBackground}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <BlurView
                            intensity={50}
                            tint="dark"
                            style={[
                            styles.optionsBox,
                            { top: metingPosition.y + 5, right: metingPosition.y - 25 },
                            ]}
                        >
                            {Array.from({ length: chartLength }).map((_, i) => (
                                <TouchableOpacity
                                    key={i + 1}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        onMetingPressed(i); 
                                    }}
                                    style={styles.pressed}
                                >
                                    <Text style={styles.option}>METING {i + 1}</Text>
                                </TouchableOpacity>
                            ))}
                                <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => redirectToMeasurementHandler()}
                                style={styles.pressed}
                                >
                                    <Text style={[styles.option, { fontSize: 16, fontWeight: "500" }]}>
                                        Start Meting
                                    </Text>
                                </TouchableOpacity>
                        </BlurView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        );
      }

    const toggleOptions = () => {
        if (optionsVisible) {
            setOptionsVisible(false);
        } else {
            measureMetingPosition();
            setOptionsVisible(true);
        }  
    };

    const measureMetingPosition = () => {
        metingRef.current.measureInWindow((x, y, width, height) => {
          setMetingPosition({ x, y: y + height });
        });
    };

    return(
            <BlurView intensity={10} tint = "dark" style = {styles.upperIcons}>
                <TouchableOpacity onPress={toggleModal}>
                    <View style={styles.stopContainer}>
                        <View
                        style={[
                            styles.stopCircle,
                            isStopActive ? styles.stopCircleActive : {},
                        ]}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleOptions}>
                    <View ref={metingRef} style = {{flexDirection: 'row', alignItems: 'center', marginLeft: 33 }}>
                            <Text  style = {styles.text}>
                                METING {currentIndex + 1}
                            </Text>
                        <Icon 
                        icon = {rightIcon} 
                        size={23}
                        color={ ColorsBlue.blue50 }//ColorsLighterGold.gold400}
                        onPress = {toggleOptions}
                        differentDir={true}
                        />
                    </View>
                </TouchableOpacity>
                <View style = {{marginLeft: 25}}>
                    <Icon 
                    icon = {midIcon}
                    size={26}
                    color={ColorsBlue.error300}
                    onPress = {midIconHandler}
                    differentDir={true}/>
                </View>
                <ToggleMenu
                headerHeight = {headerHeight}
                isStopActive = {isStopActive}
                toggleModal = {toggleModal}
                />
                {/* Options Box */}
                <Modal
                    transparent={true}
                    visible={optionsVisible}
                    onRequestClose={() => {
                        setOptionsVisible(false);
                    }}
                >
                    <OptionsBox />
                </Modal>
            </BlurView>
    )
}

export default AssignmentOptionsBar;

const styles = StyleSheet.create({
    upperIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        width: "101%",
        paddingHorizontal: 15,
        alignSelf: 'center',
        paddingVertical: 15
    },
    stopContainer: {
        width: 30,
        height: 15,
        marginHorizontal: 5,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: ColorsTile.blue500,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    stopCircle: {
        width: 15,
        height: 15,
        borderRadius: 20,
        backgroundColor: ColorsTile.blue500,
    },
    stopCircleActive: {
        transform: [{ translateX: 15 }],
    },
    text: {
        fontSize: 20,
        color: ColorsBlue.blue50,//ColorsLighterGold.gold400,
        marginRight: 5,
        textAlign: 'center',
    },
    optionsBox: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: 130,
        position: "absolute",
        zIndex: 1000, // Make sure the box appears above other elements
        borderColor: `rgba(77, 77, 77, 0.5)`,
        borderWidth: 1,
        padding: 1.6,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    option: {
        fontSize: 16,
        color: ColorsBlue.blue50,
        marginBottom: 8,
        textAlign: 'center',
    },  
    pressed: {
        width: 128,
        justifyContent: 'center',
        alignItems: 'center',
        height: 26
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },    
})