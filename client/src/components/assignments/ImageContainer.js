import { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, Animated, FlatList } from "react-native"
import { ColorsLighterGold, ColorsTile, StoreColors } from "../../constants/palet"
import { ImagesContext } from "../../store/images-context";
import Icon from "../Icon";

function ImageContainer({imageHeight, title, assignment_number, tokens}) {
    const imagesCtx = useContext(ImagesContext);
    const [imageSource, setImageSource] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lengthImagesArray, setLengthImagesArray] = useState([]);
    const heightImage = imageHeight 
    const DATA = [
    {
        id: '1',
        imageUri: require('./../../../assets/distance_vs_time9.png')//'https://picsum.photos/id/237/200/300',
    },
    {
        id: '2',
        imageUri: require('./../../../assets/distance_vs_time9.png'),
    },
    {
        id: '3',
        imageUri: require('./../../../assets/distance_vs_time9.png'),
    },
    ];
    const dataArrayLength = Array.from({ length: DATA.length }, (_, index) => index)

    useEffect(() => {
        let mounted = true

        const fetchDecodedImages = () => {
        // Get the decoded images from the database
        const decodedImages = imagesCtx.getDecodedImages(assignment_number, title, mounted);

        // Set the image source to a data URL
        if (decodedImages){
            const dataURLs = decodedImages.map((decodedImage) => {
                return `data:${decodedImage.mime_type};base64,${btoa(decodedImage.data)}`; //this should be a map
            })
            setImageSource(dataURLs);

            const ImageLengthArray = Array.from({ length: dataURLs.length }, (_, index) => index)
            setLengthImagesArray(ImageLengthArray)
        }
        else{
            console.log("decodedImages is null/ not set")
        }
        }

        fetchDecodedImages();

        return () => {
            mounted = false;
        }
    }, [imagesCtx, assignment_number, title]);



    function handleScroll(event) {
        const { contentOffset, layoutMeasurement } = event.nativeEvent;
        const index = Math.floor(contentOffset.x / layoutMeasurement.width);
        setCurrentIndex(index);
    }
    
    // const newHeightImage = heightImage + 20
    function renderImage({item}){
        return (
            //width = imageWidth + marginContainer + margin QuestionTileContianer
            <Animated.View style={[styles.image, {height: heightImage, width: 319.2, marginHorizontal: 5}]}> 
                <Image
                source={item.imageUri} //should be imagSource
                style={{width: "100%", height: "100%"}}
                resizeMode="auto"
                />
            </Animated.View>
        )
    }


    //TODO: Add such that multiple images can be shown in the image container
    return (
        <>
            <View style = {[styles.borderNumber, {marginTop: 10}]}>
                <Text style = {{marginLeft: 35}}></Text>
                <Text style = {styles.questionNumber}>Robot Output Data</Text>
                <Text style = {styles.tokens}>€{tokens}</Text>
            </View>

            <View style={[styles.imageContainer]}>
                {!imageSource  ? 
                ( //TODO: Add a flatlist to show multiple images in the image container, there needs to be one image displayed
                <>
                <FlatList 
                    data={DATA}
                    keyExtractor={(item) => item.id}
                    renderItem={renderImage}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onScroll={handleScroll}
                />  
                <View style = {{alignItems: 'center'}}>
                    <FlatList
                    data={dataArrayLength}
                    keyExtractor={(item, index) => index}
                    renderItem = {({item, index}) => (
                        <View style = {{margin: 5}}>
                            <Icon 
                            icon = {index === currentIndex ? "ellipse-sharp" : "ellipse-outline"}
                            color = {index === currentIndex ? ColorsLighterGold.gold900: ColorsTile.blue200}
                            size = {36} 
                            />
                        </View>
                    )}
                    horizontal
                    />
                </View>
                </>
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
    tokens: {
        color: ColorsLighterGold.gold900,
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
        borderColor: ColorsTile.blue200,
        borderWidth: 2,
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