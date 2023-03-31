import {  ImageBackground, ScrollView, StyleSheet,  View } from 'react-native';
import { ColorsBlue, ColorsGray, } from '../../../constants/palet';
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import TextDisplay from './TextDisplay';
import VideoDisplay from './VideoDisplay';
import SwitchScreens from './SwitchScreens';


function BatteryScreen({nextSlideHandler, prevSlideHandler, slideCount, setTyping, typing, message, video, title, description, isFocused}){
    const extraStyle = {
        marginLeft: 8,
        borderRadius: 10,
        paddingLeft: 5
    }

    console.log(`check BatteryScreen`)
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
                <VideoDisplay 
                video = {video}/>
                    <ScrollView style = {{flex: 1}}>
                    <TextDisplay 
                    title={title}
                    description={description}/>
                    
                                <View style={{ alignItems: 'flex-start', marginLeft: 10, paddingTop: 10 }}>
                                    {isFocused && <ChatBoxGPT 
                                    answer={message.answer}
                                    isLastItem={true}
                                    thread_id={message.thread_id}
                                    setTyping={setTyping}
                                    typing={typing}
                                    extraStyle={extraStyle}
                                    />}
                                </View>
                                    {!typing && (
                                        <SwitchScreens 
                                        prevSlideHandler={prevSlideHandler}
                                        nextSlideHandler={nextSlideHandler}
                                        slideCount={slideCount}
                                        />
                                    )}
                        </ScrollView>   
                </ImageBackground>
            </LinearGradient>
    )
}

export default BatteryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        paddingBottom: 5
    },
    imageBackground: {
        flex: 1, 
        resizeMode: 'contain',
    },

})