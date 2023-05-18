
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../constants/palet'
import BlurWrapper from '../UI/BlurViewWrapper';


const {width, height} = Dimensions.get('window');  
function ChatBoxGPT({ answer,  isLastItem, thread_id, setTyping, typing, extraStyle, customColor}) {
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
        shadowOpacity: customColor ? 0 : 1, 
        backgroundColor: customColor? null : ColorsBlue.blue1390, 
        borderColor: customColor ? ColorsBlue.blue1390 : `rgba(77, 77, 77, 0.17)`,
        marginRight: customColor ? 18 : 8,
        paddingBottom: customColor ? 0 : 15,
    }

    return (
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
        borderWidth: 1,
        marginHorizontal: 8,
        borderRadius: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 2, width: 1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        elevation: 4,
        flex: 1,
    },
});
