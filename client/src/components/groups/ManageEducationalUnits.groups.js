
import { View,  ImageBackground, StyleSheet, FlatList, Alert, Text, TouchableOpacity, Dimensions, Animated} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../constants/palet'
import { useNavigation } from '@react-navigation/native';
import GroupCategoryTile from './GroupTile.groups';
import TeacherModal from '../Teacher/TeacherModal.components';
import TeacherTimeModal from '../Teacher/TeacherTimeModal';
import { TimeContext } from '../../store/time-context';
import { useContext, useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfileContext } from '../../store/userProfile-context';
import { InformationContext } from '../../store/information-context';
import ChatBoxGPT from '../chatgpt/ChatBoxGPT';
import { TextBubbleLeft } from '../UI/TextBubble';
import { Image } from 'react-native';

const { width, height } = Dimensions.get('window');

function  ManageEducationalUnits({user_role, tileType, deletehHandler, editHandler, addUserHandler, classroom_id, className, data, setDbUpdate, tabNav}){
    const navigation = useNavigation();
    const userprofileCtx = useContext(UserProfileContext)
    const user_class_id = userprofileCtx.userprofile.class_id
    const user_group_id = userprofileCtx.userprofile.group_id
    const informationCtx = useContext(InformationContext)
    const fadeAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 0
    const [explanationState, setExplanationState] = useState(false);

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


    function renderGroups({item, index}) {   
        //Don't display tiles that do not have the selected classroom
        function navigationHandler(tile) {
            if (user_role === 'teacher'){
                switch(tile){
                    case 'Class':
                        navigation.navigate('groups', {
                            screen: 'Grouproom',
                            params: {
                                classroom_id: item.class_id,
                                class_name: item.name,
                            },
                        });
                        break;
                    case 'Group':
                        //REPLACE WITH USER SCREENS
                        navigation.navigate('groups', {
                            screen: 'IndividualGroup', 
                            params: {
                                group_id: item.group_id,
                                group_name: item.name,
                                classroom_id: item.class_id,
                                class_name: item.name,
                            },
                    }) // add specfic group info
                }
            } 
            else {
                switch(tile){
                    case 'Class':
                        navigation.navigate('groups', {
                            screen: 'Grouproom',
                            params: {
                                classroom_id: item.class_id,
                                class_name: item.name,
                            },
                        });
                        break;

                    case 'Group':
                        if (user_class_id === item.class_id && user_group_id === item.group_id) {
                            //REPLACE WITH USER SCREENS
                            navigation.navigate('groups', {
                                screen: 'IndividualGroup', 
                                params: {
                                    group_members: item.usernames,
                                    group_name: item.name,
                                    class_name: className,
                                },
                            }) // add specfic group info
                        }
                        else {
                            Alert.alert('Dit is niet jouw groep', 'Je kan alleen je eigen groep bekijken')
                        }
                }
            }
        }

        return (           
                <GroupCategoryTile
                    navigationHandler={navigationHandler.bind(this, tileType)}
                    addUserHandler={addUserHandler}
                    groupNames={item.name}
                    groupMembers={item.usernames} //change this to 
                    groupCount={item.current_count + '/' + item.max_count} // change that it contains max number of members + current participants
                    user_role={user_role}
                    tileType={tileType}
                    deletehHandler={deletehHandler}
                    editHandler={editHandler}
                    class_id = {item.class_id}
                    group_id = {tileType === 'Group' ? item.group_id : false }
                    className = {className}
                    fadeAnim = {fadeAnim}
                />  

        )
    }


    return (
        <LinearGradient style = {styles.container}
        colors={[ColorsBlue.blueblack1600, ColorsBlue.blueblack1500, ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
            <ImageBackground
            source={require('./../../../assets/chatbackground.png')} 
            style={
            {flex: 1, resizeMode: 'contain'}
            }
            imageStyle={{opacity: 0.1}}
            >
                <View style = {{flex: 1}}>
                    <FlatList
                    KeyExtractor = {(item) => item.classroom_id.to_String()}
                    data = {data} //toevoegen dat deze data alleen voor teacher geldt -> wil eigenlijk dat dit gefetch wordt via een socket
                    renderItem = {renderGroups}
                    />
                    {informationCtx.showBeginningScreen &&  user_role === 'student' && tileType === 'Class'  && 
                    <>
                        {!explanationState && 
                        
                            <View style = {{position: 'absolute', top: height > 750 ? '45%' : '50%', left: '12%'}}>  
                                <View style = {{}}>
                                    <TextBubbleLeft
                                        title = 'Kies je klas en groep'
                                        text = {`• Je deelt alle antwoorden en metingen met je groepsleden\n• Werk samen als een team! \n• Brainstorm met elkaar, dit zal jullie helpen om de juiste antwoorden te vinden! \n• Druk op het hoofd icoon om een klas of groep toe te voegen`}
                                        setExplanationState={setExplanationState.bind(this, true)}

                                    />
                                </View>
                                <View style = {{ position: 'absolute', left: '-10%', top: '89%',}}>
                                    <Image
                                        style={styles.profilePicture}
                                        source={require("./../../../assets/robotIcon.png")}
                                        resizeMode="cover"
                                        />
                                </View>
                            </View>
                        }
                        {explanationState &&
                            <View style = {{position: 'absolute', bottom: '20%', right: 20, left: 20}}>
                                <View style = {styles.textContainer}>
                                    <Animated.Text style= {[styles.text, {opacity: fadeAnim}]}>Druk op het hoofd-plus-icoontje om een klas toe te voegen verder te gaan</Animated.Text>
                                </View>
                            </View>
                        }
                        
                    </>
                    } 
                    {informationCtx.showBeginningScreen &&  user_role === 'student' && tileType === 'Group' && 
                    <>
                        {
                        !explanationState && 
                            <View style = {{position: 'absolute', top: height > 750 ? '45%' : '50%', left: '12%'}}>
                                <View style = {{}}>
                                        <TextBubbleLeft
                                            title = 'Kies je groep'
                                            text = {`• Als je een groep hebt gekozen, dan kan je jouw gegevens zien door op de groep te drukken`}
                                            setExplanationState={setExplanationState.bind(this, true)}

                                        />
                                    </View>
                                    <View style = {{ position: 'absolute', left: '-10%', top: '89%',}}>
                                        <Image
                                            style={styles.profilePicture}
                                            source={require("./../../../assets/robotIcon.png")}
                                            resizeMode="cover"
                                            />
                                    </View>
                            </View>
                        }
                        {explanationState &&
                            <View style = {{position: 'absolute', bottom: '20%', right: 20, left: 20}}>
                                <View style = {styles.textContainer}>
                                    <Animated.Text style= {[styles.text, {opacity: fadeAnim}]}>Druk op het hoofd-plus-icoontje om een groep toe te voegen verder te gaan</Animated.Text>
                                </View>
                            </View>
                        }
                    </>
                    }
                </View>
            </ImageBackground>
        <TeacherModal
        tileType={tileType}
        classroom_id={classroom_id}
        setDbUpdate={setDbUpdate}
        />
        <TeacherTimeModal />

        </LinearGradient>
    )
}

export default ManageEducationalUnits

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1300,
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 30,
        zIndex: 3,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        color: ColorsBlue.blue100,
        textAlign: 'center',
    },
    textContainer: {
        backgroundColor: ColorsBlue.blue1300,
        borderRadius: 20,
        padding: 21,
        borderColor: ColorsBlue.blue700,
        borderWidth: 0.8,
    }

})
