import React, { useCallback, useEffect, useState } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../constants/palet'

function ChatBoxGPT({ answer, isLastItem, thread_id, setTyping, typing, customColor}) {
    const [displayText, setDisplayText] = useState('');

    const updateText = useCallback(() => {
        let timer = null;
        if (isLastItem && typing && displayText.length < answer.length) {
            timer = setTimeout(() => setDisplayText(answer.slice(0, displayText.length + 1)), 15);
        } 
        else {
            setTyping(false);
            setDisplayText(answer);
        }
        return timer;
    }, [displayText, answer, isLastItem, typing]);

    useEffect(() => {
        let timer = updateText();
    
        if (displayText.length === answer.length) {
            setDisplayText(answer);
            setTyping(true);
        }
        return () => {
            if(timer) clearTimeout(timer);
        }
    }, [displayText, typing, updateText]);



    const showFullText = useCallback(() => {
        setTyping(false);
        setDisplayText(answer);
    }, [answer]);

    const shadowCustom = {
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 2, width: 1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        elevation: 4,
        borderRadius: 20,
    }

    const shadowOuterContainer = {
        shadowColor: customColor ? null: `rgba(0, 0, 0, 1)`, 
        shadowOpacity: customColor ? null : 1, 
        backgroundColor: customColor? null : ColorsBlue.blue1390, //Colors.blue1390
        borderColor: customColor ? null: `rgba(77, 77, 77, 0.25)`, //Colors.blue1390 
        marginRight: customColor ? 18 : 8,
        paddingBottom: customColor ? 0 : 15,
        borderWidth: customColor ? 0 :  1
    }

    return (
        <View style = {{flex: 1}}>
            <View style = {[styles.outerContainer, shadowOuterContainer]}>
                <Image
                style={[styles.profilePicture, {left: customColor ? '1%' : '4.5%'}]}
                source={thread_id > 5 ?
                    require(
                        "./../../../assets/robotIcon.png"
                    ) :require("./../../../assets/chatgptLogo.png")
                }
                resizeMode="cover"
                />
                    <View style = {[customColor && shadowCustom, {flex: 1, marginLeft: 50, backgroundColor: customColor}]}>
                        <TouchableOpacity onPress={showFullText}>
                            <View style={[styles.chatGPTTextBox]}>
                                <Text style={styles.chatGPTText}>{isLastItem ? displayText : answer}</Text>
                            </View>
                        </TouchableOpacity>
                </View> 
            </View>
            { displayText.length < answer.length &&
                <View style = {{marginTop: 40}}>
                    <TouchableOpacity onPress = {() => showFullText()} style = {{position: 'absolute', bottom: '3%', left: '45%'}}>
                        <Text style = {[styles.chatGPTText, {fontSize: 18}]}>Skip</Text>
                    </TouchableOpacity>
                </View>
            }

        </View>
    );
}

export default React.memo(ChatBoxGPT);





const styles = StyleSheet.create({
    chatGPTTextBox: {
        borderRadius: 20,
        padding: 15,
    },
    chatGPTText: {
        color: ColorsGray.gray300,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 30,
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 30,
        position: 'absolute',
        left: '4.5%',
        top: '45%',
    },
    outerContainer: {
        marginTop: 8,
        marginHorizontal: 8,
        borderRadius: 20,
        elevation: 4,
        flex: 1,
    },
});
