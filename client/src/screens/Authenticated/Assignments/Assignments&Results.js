import { useNavigation } from "@react-navigation/native";
import { Text, FlatList, StyleSheet, ImageBackground, View } from "react-native";
import {assignments} from "../../../data/AssignmentData";
import AssignmentTile from "../../../components/assignments/AssignmentTile";
import { ColorsBlue } from "../../../constants/palet";

function AssignmentsResults() {
    const navigation = useNavigation();

    function renderAssignment(itemData) {

        // when a tile is pressed, we are navigating to the assignment screen
        // there it is decided which title we choose
        function onPressHandler() {
            navigation.replace('Assignment', {
                title: itemData.item.title //here the title is automatically filtered on
            })
        }

        return (
            <AssignmentTile 
            {...itemData.item}
            onPress = {onPressHandler}
            />
        )
    }
    
    const physicsAssignmentsData = assignments("Physics"); //hier filteren op physicsdata title
    const mathAssignmentsData = assignments("Mathematics");

    return (
        <View style = {styles.backgroundColor}>
        <ImageBackground
            source={require('./../../../../assets/grid.jpg')} 
            style={
            styles.backgroundImage
            }
            imageStyle={{opacity: 0.4}}
        >
            <Text style={[styles.text, {marginTop: 20}]}>Natuurkunde Vragen</Text>
            <FlatList 
            horizontal
            data={physicsAssignmentsData} 
            keyExtractor = {(item) => item.assignment_id}
            numColumns = {1}
            renderItem = {renderAssignment} 
            showsHorizontalScrollIndicator={false}
            />
            <Text style={styles.text}>Wiskunde Vragen</Text>
            <FlatList 
            horizontal
            data={mathAssignmentsData} 
            keyExtractor = {(item) => item.assignment_id}
            numColumns = {1}
            renderItem = {renderAssignment} 
            showsHorizontalScrollIndicator={false}
            />
            <Text style={styles.text}>Gecombineerde Vragen</Text>
            <FlatList 
            horizontal
            data={physicsAssignmentsData} 
            keyExtractor = {(item) => item.assignment_id}
            numColumns = {1}
            renderItem = {renderAssignment} 
            showsHorizontalScrollIndicator={false}
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
        color: "white",
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 20
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
        borderTopColor: ColorsBlue.blue100,
        borderTopWidth: 0.2
    },
    backgroundColor: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1100
    }
})