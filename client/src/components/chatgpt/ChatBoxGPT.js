
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../constants/palet'

function ChatBoxGPT({ answer,  isLastItem, thread_id, setTyping, typing, extraStyle}) {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {

        if (!isLastItem){
            return;
        }
        if (typing) {
            if (displayText.length < answer.length) {
                setTimeout(() => {
                    setDisplayText(answer.slice(0, displayText.length + 1));
                    return;
                }, 15);
            } else {
                setTyping(false);
                setDisplayText(answer);
                return;
            }
        }
        else {
            setDisplayText(answer);
            setTyping(false);
        }

        // Cleanup function
        if (displayText.length === answer.length) {
            return () => {
                setDisplayText(answer);
                setTyping(true);
            }
        }
    }, [displayText, typing]);
    
    const showFullText = () => {
        setTyping(false);
        setDisplayText(answer);
    };

    return (
        <View style = {[styles.outerContainer, extraStyle && { marginLeft: extraStyle.marginLeft, backgroundColor: 'rgba(10,10,60,0.2)', }]}>
            <View style={styles.blurContainer}>
                <BlurView style={[styles.textBox, 
                    ]} 
                    intensity={extraStyle ? 18 : 0}  //backgroundColor={ColorsBlue.blue1300}
                    >
                        <Image
                        style={[styles.profilePicture, extraStyle && { marginLeft: extraStyle.marginLeft }]}
                        source={thread_id > 5 ?
                            require(
                                "./../../../assets/robotIcon.png"
                            ) :require("./../../../assets/chatgptLogo.png")
                        }
                        resizeMode="cover"
                        />
                        <View style = {{flex: 1, borderRadius: 10, overflow: 'hidden'}}>
                            <BlurView  
                                intensity={extraStyle ? 0 : 20}// tint = 'dark'//backgroundColor={ColorsBlue.blue1300}
                                style={{backgroundColor: 'rgba(10,10,60,0.2)',paddingLeft: !extraStyle && 10}}
                            >
                                <TouchableOpacity onPress={showFullText}>
                                    <View style={[styles.chatGPTTextBox, extraStyle && { paddingLeft: extraStyle.paddingLeft, backgroundColor: extraStyle.backgroundColor }]}>
                                        <Text style={styles.chatGPTText}>{isLastItem ? displayText : answer}</Text>
                                    </View>
                                </TouchableOpacity>
                            </BlurView>
                        </View> 
                </BlurView>
            </View>
        </View>
    );
}

export default React.memo(ChatBoxGPT);

const styles = StyleSheet.create({
    chatGPTTextBox: {
        // backgroundColor: ColorsBlue.blue1100,
        borderRadius: 10,
        padding: 10,
    },
    chatGPTText: {
        color: ColorsBlue.blue50,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    textBox: {
        flexDirection: "row",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 30,
        marginRight: 10,
    },
    outerContainer: {
        width: 355,
        borderRadius: 10,
        marginVertical: 10,
    },
    blurContainer: {
        borderRadius: 10,
        overflow: 'hidden', // This ensures the borderRadius is applied correctly
    },

});
