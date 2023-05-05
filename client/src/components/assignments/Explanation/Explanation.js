
import {  ImageBackground, ScrollView, StyleSheet,  View, Text } from 'react-native';
import {useRef} from 'react';
import { ColorsBlue,} from '../../../constants/palet';
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT';
import { LinearGradient } from 'expo-linear-gradient';
import VideoDisplay from '../BuildComponent.js/VideoDisplay';
import SwitchScreens from '../BuildComponent.js/SwitchScreens';
import SwitchScreensQuestions from '../questions/SwitchScreensQuestions';
import Icon from '../../Icon';



function Explanation({nextSlideHandler, prevSlideHandler, slideCount, setTyping, typing, answer, thread_id, video, isFocused, slideCountEnd, topic, videoPlay, ExplanationAnimation}) {
        const scrollViewRef = useRef(null);

        const extraStyle = {
            marginLeft: 8,
            borderRadius: 10,
            paddingLeft: 5
        }

        const addStyle = {marginBottom: 20}
        return (
            <LinearGradient 
                    colors={[ColorsBlue.blue1400, ColorsBlue.blue1400, ColorsBlue.blue1400, ColorsBlue.blue1400, ColorsBlue.blue1300, ColorsBlue.blue1400]} 
                    style = {styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    >
                    <ImageBackground
                    source={require('./../../../../assets/chatbackground.png')} 
                    style={
                    {flex: 1}
                    }
                    imageStyle={{opacity: slideCount >= 0 ? 0.10 : 0.15}}
                    >
                    
                    {/* <VideoDisplay 
                    video = {video}/> */}
                    
                    <ExplanationAnimation/>
                

            
                    <View style = {styles.textContainer}>
                        <Text style = {styles.text}>{topic}</Text>
                        <View style = {styles.leftSlider}>
                            {slideCount > 0  && (
                            
                                <Icon 
                                onPress = {() => {
                                    console.log('Calling prevSlideHandler');
                                    prevSlideHandler();
                                    console.log('prevSlideHandler called');
                                }}
                                size = {35}
                                icon = "play-back-circle-outline"
                                color = {ColorsBlue.blue400}
                                addStyle={{marginHorizontal: 10, marginVertical: 2}}
                                />
                            )}
                        </View>
                        <View style = {styles.rightSlider}>
                            {!slideCountEnd && <Icon 
                                onPress = {nextSlideHandler}
                                size = {35}
                                color = {ColorsBlue.blue400}
                                icon = "play-forward-circle-outline"
                                addStyle={{marginHorizontal: 10, marginVertical: 2}}
                                />
                            }
                        </View>
                    </View>
                        <ScrollView 
                        style = {{flex: 1}}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                        >
                        
                                    <View style={{ alignItems: 'flex-start', marginLeft: 10, paddingTop: 10 }}>
                                        {isFocused && <ChatBoxGPT 
                                        answer={answer}
                                        isLastItem={true}
                                        thread_id={thread_id}
                                        setTyping={setTyping}
                                        typing={typing}
                                        extraStyle={extraStyle}
                                        />}
                                    </View>

                               
                            </ScrollView>   
                    </ImageBackground>
                </LinearGradient>
        )
}

export default Explanation
    
const styles = StyleSheet.create({
        container: {
            flex: 1, 
            paddingBottom: 5
        },
        imageBackground: { 
            flex: 1, 
            resizeMode: 'contain',
        },
        textContainer: {
            backgroundColor: `rgba(25, 25, 85, 0.6)`,
            height: 60,
            shadowColor: `rgba(11, 11, 11)`,
            shadowOffset: {height: 2, width: 0},
            shadowOpacity: 1,
            shadowRadius: 3,
            elevation: 2,
            borderTopColor: `rgba(77, 77, 77, 0.6)`,
            borderTopWidth: 0.6,
            borderBottomColor: `rgba(77, 77, 77, 0.6)`,
            borderBottomWidth: 0.6,
            justifyContent: 'center',
        },
        text: {
            fontSize: 25,
            fontWeight: '300',
            color: ColorsBlue.blue50,
            textAlign: 'center',

        },
        leftSlider: {
            position: 'absolute',
            top: 8,
            left: 8
        },
        rightSlider: {
            position: 'absolute',
            top: 8,
            right: 8
        }
})
