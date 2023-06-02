
import {View, Text, StyleSheet, ImageBackground, FlatList, Dimensions, Animated, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { AssignmentDetailsContext } from '../../../store/assignment-Details-context';
import { UserProfileContext } from '../../../store/userProfile-context';
import { getGroupAssignmentDetails, } from '../../../hooks/assignmentDetails';
import { useContext, useEffect, useRef, useState } from 'react';
import TriesCorrectGraph from '../../../components/groups/statistics_page/tries_correct_graph';
import { ColorsBlue, ColorsGray } from '../../../constants/palet';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { InformationContext } from '../../../store/information-context';
import { TextBubbleLeft } from '../../../components/UI/TextBubble';
import { getRobotWifi } from '../../../hooks/robotWifi';


const {height, width} = Dimensions.get('window');
function IndividualGroup() {
    const route = useRoute();
    const {group_members, group_name, class_name} = route.params
    const [explanationState, setExplanationState] = useState(false);
    const informationCtx = useContext(InformationContext)
    const userprofileCtx = useContext(UserProfileContext);
    const {user_role, class_id, group_id, school_id} = userprofileCtx.userprofile;
    const [robotCredentials, setRobotCredentials] = useState({
        robot_wifi_name: '',
        robot_password: ''
    });
    const [tries, setTries] = useState([]);
    const [correct, setCorrect] = useState([]);
    const [triesAndCounts, setTriesAndCounts] = useState([
        {
            title: "Fase 1",
            data: [],
            left: "43%"
        },
        {
            title: "Fase 2",
            data: [],
            left: "43%"
        },
        {
            title: "Fase 3",
            data: [],
            left: "50%"
        }
    ]);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const fadeAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 0
    const navigation = useNavigation();

    useEffect(() => {
        fadeAnim.setValue(1)
        const animation = Animated.loop(
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0.4,
              duration: 2000,
              useNativeDriver: false,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: false,
            }),
          ]),
          {
            iterations: -1,
          },
        )
        
        animation.start();
        return () => {
            animation.stop();
        };
    }, []);


    useEffect(() => {
        async function fetchData() {
            const assignments = await getGroupAssignmentDetails(school_id, class_id, group_id);
            const triesPhaseOne = assignmentDetailsCtx.getTriesAssignmentsPerPhase('MOTOR', assignments)
            const correctPhaseOne = assignmentDetailsCtx.getCorrectAnswerCount('MOTOR', assignments)
            const triesAndCountsPhaseOne = assignmentDetailsCtx.getCorrectAndTriesCount('MOTOR', assignments)
            const wifiCredentials = await getRobotWifi(school_id, class_id, group_id);

            setRobotCredentials(wifiCredentials);
            setTries(prevData => [...prevData, triesPhaseOne])
            setCorrect(prevData => [...prevData, correctPhaseOne])
            setTriesAndCounts(prevData => prevData.map(item => {
                if (item.title === "Fase 1") {
                    return {...item, data: triesAndCountsPhaseOne}
                } 
                else if (item.title === "Fase 2") {
                    return {...item, data: triesAndCountsPhaseOne}
                }
                else if (item.title === "Fase 3") {
                    return {...item, data: triesAndCountsPhaseOne}
                }
                else {
                    return item;
                }
            }));

        }
        fetchData();
    }, []);

    function navigateToAppHandler() {
        if (class_id === '' && group_id === ''){
            Alert.alert('Voeg een klas en/of groep toe voordat je verder kan!')
            return;
        }

        informationCtx.setShowBeginningScreen(false)
        navigation.navigate('BottomMenu', {screen: 'Assignments'})
    }

    function renderCharts({item, index}) {
        return (
            <TriesCorrectGraph 
            groupData={item.data}
            title = {item.title}
            left = {item.left}
        />
        )
    }
    
    const renderItem = (title, initialIndex, subject, { item, index }) => {
        function navigateToAssignmentHandler() {
            navigation.navigate('BottomMenu', {
                screen: 'Assignments',
                params: {
                    screen: 'Assignment',
                    params: {
                        title: title,
                        initialIndex: initialIndex, // here the title is automatically filtered on
                        subject: subject,
                        initSlideCount: item
                    },
                },
            });
        }
        // add an onpress function to navigate to the assignment
        return (
            <TouchableOpacity style={styles.item}
            onPress = {() => navigateToAssignmentHandler()}>
              <Text style={styles.title}>{index + 1}</Text>
            </TouchableOpacity>
        );
    }


    const assignmentSlidesFaseOne = [3, 5, 7, 8,  10, 12, 14]
    const assignmentSlidesFaseTwo = [3, 5, 7, 8, 9]
    const assignmentSlidesFaseThree = [3, 5, 7, 8,  10, 12, 14, 16]
    return (
        <LinearGradient style = {styles.container}
        colors={[ColorsBlue.blueblack1600, ColorsBlue.blueblack1500]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
            <ImageBackground
            source={require('./../../../../assets/chatbackground.png')} 
            style={
            {flex: 1, resizeMode: 'contain'}}
            imageStyle={{opacity: 0.08}}
            >
            <ScrollView style = {{flex: 1}}>
                
                <View style = {styles.groupInfo}>
                    <Text style = {styles.groupInfoText}>Groupsnaam: {group_name}</Text>
                    <View style = {styles.border} />
                    <Text style = {styles.groupInfoText}>Klas: {class_name}</Text>
                    <View style = {styles.border} />
                    <Text style = {styles.groupInfoText}>Groupsleden: {group_members.join(', ')}</Text>
                    <View style = {styles.border} />
                    <Text style = {styles.groupInfoText}>Wifi Naam: {robotCredentials.robot_id}</Text>
                    <View style = {styles.border} />
                    <Text style = {styles.groupInfoText}>Wifi Wachtwoord: {robotCredentials.password}</Text>
                </View>
                <FlatList 
                    horizontal
                    data = {triesAndCounts}
                    keyExtractor = {(item, index) => 'tries' + index}
                    showsHorizontalScrollIndicator = {false}
                    renderItem = {renderCharts} 
                    pagination = {true}
                />
                {/* Display all assignments here */}
                <View style = {styles.assignmentInfo}>
                    <Text style = {styles.header}>Opdrachten Fase 1</Text>
                    <FlatList
                        data={assignmentSlidesFaseOne}
                        renderItem={renderItem.bind(this, 'Onderzoek', 3, 'MOTOR')}
                        keyExtractor={(item, index) => 'fase-1-' + index}
                        numColumns={4}
                    />
                </View>

                <View style = {styles.assignmentInfo}>
                    <Text style = {styles.header}>Opdrachten Fase 2</Text>
                    <FlatList
                        data={assignmentSlidesFaseTwo}
                        renderItem={renderItem.bind(this, 'Onderzoek', 3, 'LED')}
                        keyExtractor={(item, index) => 'fase-2-' + index}
                        numColumns={4}
                    />
                </View>

                <View style = {[styles.assignmentInfo, { marginBottom: 100}]}>
                    <Text style = {styles.header}>Opdrachten Fase 3</Text>
                    <FlatList
                        data={assignmentSlidesFaseThree}
                        renderItem={renderItem.bind(this, 'Onderzoek', 3, 'CAR')}
                        keyExtractor={(item, index) => 'fase-3-' + index}
                        numColumns={4}
                    />
                </View>


                    {informationCtx.showBeginningScreen &&  user_role === 'student' && !explanationState && 
                            <View style = {{position: 'absolute', top: height > 750 ? '20%' : '25%', left: '12%'}}>
                                <View style = {{}}>
                                        <TextBubbleLeft
                                            title = 'Resultaten & Gegevens'
                                            text = {`• Hier zie je de resultaten van de opdrachten die je hebt gemaakt.\n\n• Verder zie je hier de gegevens van je groepje.\n\n• Let op! Je kunt hier ook de wifi gegevens vinden om met de robot te verbinden.`}
                                            setExplanationState={setExplanationState.bind(this, true)}

                                        />
                                    </View>
                                    <View style = {{ position: 'absolute', left: '-10%', top: '89%',}}>
                                        <Image
                                            style={styles.profilePicture}
                                            source={require("./../../../../assets/robotIcon.png")}
                                            resizeMode="cover"
                                            />
                                    </View>
                            </View>
                    } 
            </ScrollView>
                    {informationCtx.showBeginningScreen &&  user_role === 'student' &&
                        <Animated.View style = {{position: 'absolute', bottom: height > 750 ? '5%' : '2%', left: '28%', padding: 15, backgroundColor: ColorsBlue.blue1325,
                                borderRadius: 10, borderColor: 'rgba(77,77,77,0.3)', borderWidth: 1, shadowColor: 'rgba(0,0,0,1)',
                                shadowRadius: 4, shadowOffset: {width: 2, height: 3}, shadowOpacity: 1, elevation: 4, opacity: fadeAnim}}>
                                <TouchableOpacity 
                                    onPress={() => navigateToAppHandler()}
                                >
                                    <Text style = {{fontSize: 27, color: ColorsGray.gray300}}>Naar de App</Text>
                                </TouchableOpacity>
                            </Animated.View>
                    } 
            </ImageBackground>
        </LinearGradient>
    )
}

export default IndividualGroup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    border: {
        borderColor: ColorsGray.gray700,
        borderWidth: 0.6,
        marginVertical: 8,
        marginHorizontal: 10,
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
        backgroundColor: ColorsBlue.blue1200,
        marginVertical: 8
    },
    groupInfoText: {
        fontSize: 16,
        color: ColorsBlue.blue100,
        marginLeft: 15,
        marginVertical: 8,
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
        backgroundColor: ColorsBlue.blue1200,
        marginTop: 8,
        alignItems: 'center',

    },
    header: {
        fontSize: 22,
        color: ColorsBlue.blue200,
        marginTop: 10,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 30,
        zIndex: 3,
    },
    item: {
        backgroundColor: 'rgba(30, 55, 140, 1)',
        justifyContent: 'center',
        borderColor: 'rgba(77,77,77,1)',
        borderWidth: 1,
        marginVertical: 10,
        marginHorizontal: 15,
        borderRadius: 30,
        width: 45, 
        height: 45
      },
    title: {
        fontSize: 16,
        color: ColorsBlue.blue100,
        textAlign: 'center'
    },
})