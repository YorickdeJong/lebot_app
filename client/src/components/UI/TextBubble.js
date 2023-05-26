
import {View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import Svg, {Path} from 'react-native-svg';
import { ColorsBlue, ColorsGray } from '../../constants/palet';

const {width} = Dimensions.get('window');
export function TextBubbleLeft({text, setExplanationState, title}) {
    return (
        <View style={[styles.item, styles.itemIn]}>
            <View style={[styles.balloon, {backgroundColor: ColorsBlue.blue1100}]}>
                <Text style = {{paddingTop: 5, color: ColorsGray.gray200, fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>{title}</Text>
                <Text style={{paddingTop: 5, color: ColorsGray.gray300, lineHeight: 26, fontWeight: '302', fontSize: 15}}>{text}</Text>
                <TouchableOpacity
                onPress={setExplanationState}>
                    <Text style={{paddingTop: 5, color: ColorsGray.gray300, marginVertical: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>Begrepen</Text>
                </TouchableOpacity>
                <View
                style={[
                    styles.arrowContainer,
                    styles.arrowLeftContainer,
                ]}
                >
                
                <Svg style={styles.arrowLeft} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.484 17.5 15.515 17.5"  enable-background="new 32.485 17.5 15.515 17.5">
                        <Path
                            d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                            fill={ColorsBlue.blue1100}//"rgba(222,222,255, 1)"
                            x="0"
                            y="0"
                        />
                    </Svg>
                </View>
            </View>
        </View>
    )
}

export function TextBubbleRight({text, setExplanationState, title}) {
    return (
        <View style={[styles.item, styles.itemOut]}>
            <View style={[styles.balloon, {backgroundColor: ColorsBlue.blue1100}]}>
            <Text style = {{paddingTop: 5, color: ColorsGray.gray200, fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>{title}</Text>
            <Text style={{paddingTop: 5, color: ColorsGray.gray200, lineHeight: 26, fontWeight: '302'}}>{text}</Text>
            <TouchableOpacity
                onPress={setExplanationState}>
                    <Text style={{paddingTop: 5, color: ColorsGray.gray200, marginVertical: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>Begrepen</Text>
            </TouchableOpacity>
            <View
            style={[
                styles.arrowContainer,
                styles.arrowRightContainer,
            ]}
            >
            <Svg style={styles.arrowRight} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.485 17.5 15.515 17.5"  enable-background="new 32.485 17.5 15.515 17.5">
                    <Path
                        d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                        fill={ColorsBlue.blue1100}
                        x="0"
                        y="0"
                    />
                </Svg>
            </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        marginVertical: moderateScale(7, 2),
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 20,
     },
     itemIn: {
         marginLeft: 20
     },
     itemOut: {
        alignSelf: 'flex-end',
        marginRight: 20
     },
     balloon: {
        width: width - 100,
        // maxWidth: moderateScale(270, 2),
        paddingHorizontal: moderateScale(10, 2),
        paddingTop: moderateScale(5, 2),
        paddingBottom: moderateScale(7, 2),
        borderRadius: 20,
        marginRight: 3,
        marginBottom: 3,
     },
     arrowContainer: {
         position: 'absolute',
         top: 0,
         left: 0,
         right: 0,
         bottom: 0,
         zIndex: -1,
         flex: 1
     },
     arrowLeftContainer: {
         justifyContent: 'flex-end',
         alignItems: 'flex-start'
     },
 
     arrowRightContainer: {
         justifyContent: 'flex-end',
         alignItems: 'flex-end',
     },
 
     arrowLeft: {
         left: moderateScale(-6, 0.5),
     },
 
     arrowRight: {
         right:moderateScale(-6, 0.5),
     }
});