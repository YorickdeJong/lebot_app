import { useNavigation } from "@react-navigation/native";
import { Text, FlatList, StyleSheet, ImageBackground, View } from "react-native";
import {assignments} from "../../../data/AssignmentData";
import AssignmentTile from "../../../components/assignments/questions/AssignmentTile";
import { ColorsBlue } from "../../../constants/palet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import ButtonList from "../../../components/UI/ButtonList.UI";
import { useEffect, useState } from "react";


function chooseKey(title){
    switch(title){
        case 'Test Opstelling':
            return 0;
        case 'Codeer Theorie':
            return 1;
        case 'Codeer Vragen':
            return 2;
        case 'Vragen Opdracht':
            return 3;
    }
    return 'first';
}

function AssignmentsResults() {
    const firstAssignment = assignments("MOTOR");
    const secondAssignment = assignments("LED");
    const thirdAssignment = assignments("CAR");

    const navigation = useNavigation();
    const [selectFase, setSelectFase] = useState(1);
    const [titleFase, setTitleFase] = useState("Motoren Testen");
    const [assignmentData, setAssignmentData] = useState(firstAssignment);
    
    useEffect(() => {
        switch (selectFase) {
          case 1:
            setTitleFase('BEWEGING');
            setAssignmentData(firstAssignment);
            break;
          case 2:
            setTitleFase('SCHAKELINGEN');
            setAssignmentData(secondAssignment);
            break;
          case 3:
            setTitleFase('ENERGIE');
            setAssignmentData(thirdAssignment);
            break;
        }
      }, [selectFase]);

      
    function renderAssignment(itemData) {
        // when a tile is pressed, we are navigating to the assignment screen
        // there it is decided which title we choose
        function onPressHandler() {
            navigation.replace('Assignment', {
                title: itemData.item.title,
                initialIndex: chooseKey(itemData.item.title), //here the title is automatically filtered on
                subject: itemData.item.subject
            })
        }

        return (
            <AssignmentTile 
            {...itemData.item}
            onPress = {onPressHandler}
            marginLeft
            />
        )
    }

    function onPressFaseHandler(fase){
        switch(fase){
            case 1:
                setSelectFase(1);
                break;
            case 2:
                setSelectFase(2);
                break;
            case 3:
                setSelectFase(3);
                break;
        }
    }
    return (
        <View style = {styles.backgroundColor}>
            <ImageBackground
                source={require('./../../../../assets/planets/home_screen196.png')} 
                style={
                styles.backgroundImage
                }
                imageStyle={{opacity: 0.8}}
            >

                <Text style={[styles.text]}>{titleFase}</Text>
                <View style = {styles.tileContainer}>
                    <FlatList 
                        horizontal
                        data={assignmentData[0] ? assignmentData : firstAssignment} 
                        keyExtractor = {(item) => item.assignment_id}
                        numColumns = {1}
                        renderItem = {renderAssignment} 
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <ButtonList 
                    textButtonOne={"Fase 1"}
                    textButtonTwo={"Fase 2"}
                    textButtonThree={"Fase 3"}
                    firstButtonHandler={onPressFaseHandler.bind(this, 1)}
                    secondButtonHandler={onPressFaseHandler.bind(this, 2)}
                    thirdButtonHandler={onPressFaseHandler.bind(this, 3)}
                />
            </ImageBackground>
        </View>

    )
}

export default AssignmentsResults

const styles = StyleSheet.create({
    outercontainer: {
        marginTop: 20,
        flex: 1
    },
    text: {
        color: ColorsBlue.blue100,
        fontSize: 30,
        shadowColor: 'rgba(1, 1, 1, 1)',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        textAlign: 'center',
        marginTop: 17,
        fontWeight: '450',

    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
    },
    backgroundColor: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1400,
    },
    tileContainer: {
        position: 'absolute',
        top: "16%",
        marginHorizontal: "3.6%",
        borderRadius: "200%",
        overflow: 'hidden',
        height: "56%",
    },
    buttonContainer: {
        width: 100,
        height: 55,
        paddingVertical: 0.4,
        borderRadius: 5,
        borderColor: ColorsBlue.blue700,
        borderWidth: 0.6,
        justifyContent: 'center',
        shadowColor: 'black', // Change shadow color to 'black' for better visibility
        shadowOffset: { width: 0, height: 2 }, // Increase the height offset
        shadowOpacity: 1, // Lower the shadow opacity to make it more subtle
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: ColorsBlue.blue50,
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '400',
    },
    buttonOuterContainer: {
        justifyContent: 'flex-end',
        width: "100%",
        flex: 1
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginBottom: 10,
    },
})