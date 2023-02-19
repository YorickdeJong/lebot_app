import { StyleSheet, Text, View, Image } from "react-native"

function Assignment({navigation, route}) {
    const assignmentData = route.params.assignmentData

    return (
    <View style = {styles.container}>
        <Image 
        source = {require('../../../../assets/ForcesImage.jpg')}
        style={styles.image}
        resizeMode="contain"
        />
    </View>
    )
}

export default Assignment


const styles = StyleSheet.create({
    container:{
        flex: 1,
        margin: 20
    },  
    image: {
        alignSelf: 'center',
        width: '100%',
        height: '100%',
    }
})