import { ScrollView, StyleSheet,  View, Dimensions } from 'react-native';
import {useContext, useEffect,useRef} from 'react';
import ChatBoxGPT from '../../../components/chatgpt/ChatBoxGPT';
import ImageDisplayContainer from '../../../components/UI/imageDisplayContainer/ImageDisplayContainer';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

function AppExplanationContainer({message, typing, setTyping, index, currentIndex, image}){
    const scrollViewRef = useRef(null);

    return (
            <View style = {styles.container}>
                    <ScrollView 
                        style = {{flex: 1, }}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                        >
                                {currentIndex > 0 && 
                                    <ImageDisplayContainer 
                                    image = {image}
                                    slideCount = {currentIndex}
                                    />
                                }
                                {currentIndex === 0 &&
                                    <ChatBoxGPT 
                                    answer={message.answer}
                                    isLastItem={true}
                                    thread_id={message.thread_id}
                                    setTyping={setTyping}
                                    typing={typing}
                                    />
                                }
                    </ScrollView>
            </View>

    )
}

export default AppExplanationContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: SCREEN_WIDTH,
    },
})