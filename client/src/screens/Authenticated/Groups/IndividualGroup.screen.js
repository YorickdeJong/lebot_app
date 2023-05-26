
import {View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity} from 'react-native';
import { AssignmentDetailsContext } from '../../../store/assignment-Details-context';
import { UserProfileContext } from '../../../store/userProfile-context';
import { getGroupAssignmentDetails, } from '../../../hooks/assignmentDetails';
import { useContext, useEffect, useState } from 'react';
import TriesCorrectGraph from '../../../components/groups/statistics_page/tries_correct_graph';
import { ColorsBlue } from '../../../constants/palet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';

function IndividualGroup() {
    const route = useRoute();
    const {group_members, group_name, class_name} = route.params

    console.log('GROEP', group_members)


    const [tries, setTries] = useState([]);
    const [correct, setCorrect] = useState([]);
    const [triesAndCounts, setTriesAndCounts] = useState([
        {
            title: "Motors",
            data: [],
            left: "43%"
        },
        {
            title: "Circuits",
            data: [],
            left: "43%"
        },
        {
            title: "Car",
            data: [],
            left: "50%"
        }
    ]);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const userprofile = useContext(UserProfileContext);

    const {class_id, group_id, school_id} = userprofile.userprofile;

    useEffect(() => {
        async function fetchData() {
            const assignments = await getGroupAssignmentDetails(school_id, class_id, group_id);
            const triesPhaseOne = assignmentDetailsCtx.getTriesAssignmentsPerPhase('MOTOR', assignments)
            const correctPhaseOne = assignmentDetailsCtx.getCorrectAnswerCount('MOTOR', assignments)
            const triesAndCountsPhaseOne = assignmentDetailsCtx.getCorrectAndTriesCount('MOTOR', assignments)
            setTries(prevData => [...prevData, triesPhaseOne])
            setCorrect(prevData => [...prevData, correctPhaseOne])
            setTriesAndCounts(prevData => prevData.map(item => {
                if (item.title === "Motors") {
                    return {...item, data: triesAndCountsPhaseOne}
                } 
                else if (item.title === "Circuits") {
                    return {...item, data: triesAndCountsPhaseOne}
                }
                else if (item.title === "Car") {
                    return {...item, data: triesAndCountsPhaseOne}
                }
                else {
                    return item;
                }
            }));

        }
        fetchData();
    }, []);
    

    function renderCharts({item, index}) {
        return (
            <TriesCorrectGraph 
            groupData={item.data}
            title = {item.title}
            left = {item.left}
        />
        )
    }


    return (
        <LinearGradient style = {styles.container}
        colors={[ColorsBlue.blue1390, 'rgba(3,3,10,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
            <ImageBackground
            source={require('./../../../../assets/chatbackground.png')} 
            style={
            {flex: 1, resizeMode: 'contain', paddingTop: 15, paddingHorizontal: 15}}
            imageStyle={{opacity: 0.08}}
            >
            <View style = {styles.groupInfo}>
                <Text style = {styles.groupInfoText}>Groupsnaam: {group_name}</Text>
                <Text style = {styles.groupInfoText}>Klas: {class_name}</Text>
                <Text style = {styles.groupInfoText}>Groupsleden: {group_members.join(', ')}</Text>
            </View>
            <FlatList 
                horizontal
                data = {triesAndCounts}
                keyExtractor = {(item, index) => index}
                showsHorizontalScrollIndicator = {false}
                renderItem = {renderCharts}
                pagination = {true}
            />
            {/* Display all assignments here */}
            <View style = {styles.assignmentInfo}>
                <Text style = {styles.header}>Fase 1</Text>

                <FlatList 
                />
            </View>
            </ImageBackground>
        </LinearGradient>
    )
}

export default IndividualGroup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1400,
    },
    groupInfo: {
        marginHorizontal: 10,
        borderColor: `rgba(77, 77, 77, 0.17)`,
        borderWidth: 1,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: {height: 3, width: 1},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
        borderRadius: 20,
        padding: 15,
        backgroundColor: ColorsBlue.blue1400,
        marginVertical: 8
    },
    groupInfoText: {
        fontSize: 16,
        color: ColorsBlue.blue100,
        marginLeft: 15,
        marginVertical: 8
    },
    assignmentInfo: {
        marginHorizontal: 10,
        borderColor: `rgba(77, 77, 77, 0.17)`,
        borderWidth: 1,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: {height: 3, width: 1},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
        borderRadius: 20,
        padding: 15,
        backgroundColor: ColorsBlue.blue1400,
        marginVertical: 8
    },
    header: {
        fontSize: 20,
        color: ColorsBlue.blue200,
        marginTop: 10,
        marginBottom: 10
    }
})