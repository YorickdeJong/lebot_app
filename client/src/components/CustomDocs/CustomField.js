import React, { useState, useRef, useEffect, createRef } from 'react';
import { View, StyleSheet, TextInput, Text, PanResponder } from 'react-native';
import { ColorsBlue } from '../../constants/palet';
import Svg, { Text as SvgText, TSpan } from 'react-native-svg';


const CustomField = ({ children, onLayout, panHandlers }) => {
    return (
      <Svg {...panHandlers} onLayout={onLayout} style={{ minHeight: 30 }}>
        <SvgText>
          <TSpan>{children}</TSpan>
        </SvgText>
      </Svg>
    );
  };

const CustomFieldContainer = ({ questions }) => {
    const [lines, setLines] = useState(Array.from({ length: 10 }));
    const [selectedLine, setSelectedLine] = useState(0);
    const [texts, setTexts] = useState(Array(10).fill(''));
    const textInputRef = useRef(null);
    const [dimensions, setDimensions] = useState([]);

    const panResponder = useRef(
            PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                const lineIndex = dimensions.findIndex(
                (d) => locationY >= d.y && locationY <= d.y + d.height
                );
                if (lineIndex !== -1) {
                setSelectedLine(lineIndex);
                // Here you would calculate the character position within the line
                // based on the `locationX` value and the character widths.
                // This is a non-trivial task and depends on the font metrics.
                }
            },
            })
    ).current;

    useEffect(() => {
        textInputRef.current.focus();
    }, [selectedLine]);

    const handleTextChange = (text) => {
        let newLines = [...texts];
        newLines[selectedLine] = text;
        setTexts(newLines);
    };

    const handleLayout = (index, event) => {
        const { width, height, x, y } = event.nativeEvent.layout;
        const newDimensions = [...dimensions];
        newDimensions[index] = { width, height, x, y };
        setDimensions(newDimensions);
    };

    return (
        <View style={styles.textInput}>
        <Text style={[styles.text, { color: 'black', paddingBottom: 3 }]}>{questions}</Text>
        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 10 }} />
        {texts.map((text, index) => (
            <CustomField
            key={index}
            onLayout={(event) => handleLayout(index, event)}
            panHandlers={panResponder.panHandlers}
            >
            <TSpan>{text}</TSpan>
            </CustomField>
        ))}
        <TextInput
            ref={textInputRef}
            style={{ height: 0, width: 0 }}
            value={texts[selectedLine]}
            onChangeText={handleTextChange}
        />
        </View>
    );
};


const styles = StyleSheet.create({
  textInput: {
    borderColor: 'gray', 
    borderWidth: 1, 
    backgroundColor: 'rgba(235, 235, 245, 0.8)', 
    margin: 10, 
    paddingHorizontal: 20, 
    borderRadius: 10, 
    padding: 10, 
    marginBottom: 10, 
    fontSize: 20,
    paddingBottom: 10,
  },
  text: {
    fontSize: 23,
    fontWeight: '300',
    color: ColorsBlue.blue50,
    textAlign: 'center',

},
});

export default CustomFieldContainer;