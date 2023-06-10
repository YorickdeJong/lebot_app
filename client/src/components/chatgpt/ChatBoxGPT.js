import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../constants/palet'

function ChatBoxGPT({ answer: initialAnswer, isLastItem, thread_id, setTyping, typing, customColor}) {
    const [answerPieces, setAnswerPieces] = useState(initialAnswer.split('§').map(piece => piece.trim()));
    const [activeIndex, setActiveIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');

    const updateText = useCallback(() => {
        let timer = null;
        if (isLastItem && typing && displayText.length < answerPieces[activeIndex].length) {
            timer = setTimeout(() => setDisplayText(answerPieces[activeIndex].slice(0, displayText.length + 1)), 19);
        } 
        else {
            setTyping(false);
            setDisplayText(answerPieces[activeIndex]);
        }
        return timer;
    }, [displayText, answerPieces, activeIndex, isLastItem, typing]);

    useEffect(() => {
        let timer = updateText();
    
        if (displayText.length === answerPieces[activeIndex].length) {
            setDisplayText(answerPieces[activeIndex]);
            setTyping(true);
        }
        return () => {
            if(timer) clearTimeout(timer);
        }
    }, [displayText, typing, updateText, answerPieces, activeIndex]);

    const showFullText = useCallback(() => {
        setTyping(true);
        setDisplayText(answerPieces[activeIndex]);

        // Show next text bubble when user gives input
        if (activeIndex < answerPieces.length - 1) {
            setActiveIndex(activeIndex + 1);
            setDisplayText('');
        }
    }, [answerPieces, activeIndex]);

    const showFullTextBubble = useCallback(() =>{
        setTyping(false);
        setDisplayText(answerPieces[activeIndex]);
    }, [answerPieces])

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

    const formatText = (text) => {
        const splitText = text.split('¿');
        return splitText.map((text, index) => 
            <Text key={index} style={index % 2 === 1 ? styles.boldText : styles.regularText}>{text}</Text>
        );
    }

    const renderBubbles = useMemo(() => {
        let viewedBubbles = answerPieces.slice(0, activeIndex + 1);
        return viewedBubbles.map((piece, index) => (
            <React.Fragment key={index}>
                <View style={[styles.outerContainer, shadowOuterContainer]}>
                    <Image
                        style={[styles.profilePicture, {left: customColor ? '1%' : '4.5%'}]}
                        source={thread_id > 5 ?
                            require(
                                "./../../../assets/robotIcon.png"
                            ) :require("./../../../assets/chatgptLogo.png")
                        }
                        resizeMode="cover"
                    />
                    <View style={[customColor && shadowCustom, {flex: 1, marginLeft: 50, backgroundColor: customColor}]}>
                        <TouchableOpacity   TouchableOpacity onPress={showFullText}>
                            <View style={[styles.chatGPTTextBox]}>
                                <Text 
                                style={styles.regularText}
                                selectable={true}
                                >{isLastItem && index === activeIndex ? formatText(displayText) : formatText(piece)}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>  
                </View>
                {
                    index === activeIndex && index < answerPieces.length - 1 && displayText.length === piece.length ?
                    <View style={{marginTop: 40}}>
                        <TouchableOpacity onPress={() => showFullText()} style={{position: 'absolute', bottom: '3%', left: '45%'}}>
                            <Text style={[styles.regularText, {fontSize: 18}]}>Verder</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    index === activeIndex && displayText.length < piece.length && 
                    <View style={{marginTop: 40}}>
                        <TouchableOpacity onPress={() => typing ? showFullTextBubble() : showFullText()} style={{position: 'absolute', bottom: '3%', left: '45%'}}>
                            <Text style={[styles.regularText, {fontSize: 18}]}>
                                Skip
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            </React.Fragment>
        ));
    }, [answerPieces, activeIndex, displayText, typing]);
    
    return (
        <View style={{flex: 1}}>
            {renderBubbles}
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
    boldText: {
        fontWeight: 'bold',
        color: ColorsBlue.blue600,
        fontSize: 17,
        lineHeight: 30,
    },
    regularText: {
        color: ColorsGray.gray300,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 30,
    }
});
