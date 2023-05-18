import { ColorsBlue } from "../../constants/palet";
import {View, Text, StyleSheet} from 'react-native';



function TextContainerInformation({text}){
    return (
        <>
            <Text style = {[styles.title, {marginTop: 20, marginBottom: 15}]}>Stel jezelf de volgende vragen:</Text>
            <Text style = {[styles.title, {marginBottom: 15}]}>{text}</Text>
        </>
    )
}


export default TextContainerInformation;


const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 30,
        color: ColorsBlue.blue100,
        fontSize: 18,
        marginTop: 8,
        textShadowColor: ColorsBlue.blue1400,
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 2,
        lineHeight: 23,
    },
})