import { useContext } from "react";
import { Image, StyleSheet, Text, View, Animated } from "react-native"
import { ColorsTile } from "../../constants/palet"
import { ImagesContext } from "../../store/images-context";

function ImageContainer({imageHeight, title, assignment_number, tokens}) {
    let image;
    const imagesCtx = useContext(ImagesContext);

    try {
        image = imagesCtx.filterImageWithAssignment(title) 
    }
    catch (error){
        image = ""
    }

    const heightImage = imageHeight //image.length !== 0 ? imageHeight : null;

    console.log(title + " " + assignment_number)
    return (
        <>
            <View style = {[styles.borderNumber, {marginTop: 10}]}>
                <Text style = {{marginLeft: 35}}></Text>
                <Text style = {styles.questionNumber}>Robot Output Data</Text>
                <Text style = {styles.questionNumber}>€{tokens}</Text>
            </View>

            <View style={[styles.imageContainer]}>
                {title === 'Energie' && assignment_number === 5 ? 
                (
                <Animated.View style={[styles.image, {height: heightImage, width: heightImage}]}>
                    <Image
                    source={require('./../../../assets/distance_vs_time9.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="auto"
                    />
                </Animated.View>
                ) :
                (
                <View style={styles.replaceImageContainer}>
                    <Text style = {styles.replaceImageText}>
                        Drive around to produce data!
                    </Text>
                </View>
                )
            }
            </View>
        </>
    )
}

export default ImageContainer

function test(){
    
}





const styles= StyleSheet.create({
    borderNumber: {
        borderBottomColor: ColorsTile.blue200,
        borderBottomWidth: 1,
        marginHorizontal: 20,
        paddingBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    questionNumber: {
        color: ColorsTile.blue200,
        textAlign: 'center',
        fontSize: 24,
    },
    imageContainer: {
        borderRadius: 7,
        margin: 20,
        justifyContent: 'center',
    },  
    image: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    replaceImageContainer: {
        backgroundColor: ColorsTile.blue200,  //'rgba(211, 227, 243, 0.95)', //
        padding: 5, 
        borderRadius: 5, 
        height: 30
    },
    replaceImageText: {
        color: ColorsTile.blue900,
        textAlign: 'center',
        fontSize: 18,
    }
})