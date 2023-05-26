
import {View, Image, StyleSheet, Animated, Dimensions} from 'react-native'
import {  useEffect, useRef, useState } from 'react';
import ImageRobot from './ImageRobot';
import ImageChat from './ImageChats';
import ImageAssignments from './ImageAssignments';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')
const widthIphone = 390
const heightIphone = 844
const ratioWidthIphoneScreen = widthIphone / SCREEN_WIDTH
const ratioHeightIphoneScreen = heightIphone / SCREEN_HEIGHT

function ImageDisplayContainer({image, slideCount}) {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
    const [imageCount, setImageCount] = useState(slideCount === 2 ? 1 : 0)
    const [upgradedTab, setUpgradedTab] = useState({
        afstand: false,
        snelheid: false,
        acceleration: false
    })

    const imageTwo = 1
    const imageThree = 1

    useEffect(() => {
        const animation = Animated.loop(
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: slideCount === 2 ? imageTwo: imageThree,
              duration: 2000,
              useNativeDriver: false,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: false,
            }),
          ]),
          {
            iterations: -1,
          },
        )
        
        animation.start();
        return () => {
            animation.stop();
        };
    }, [imageCount]);


    function setUpgradedTabHandler(type){
        setUpgradedTab(prevState => {
            return {...prevState, [type]: true}
        })
    }


    return (
            <View style={styles.shadowContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={image[imageCount]} 
                        style={styles.image}
                        // resizeMode='contain'
                    />
                    {slideCount == 1 && 
                        <ImageAssignments 
                            setImageCount={setImageCount}
                            imageCount={imageCount}
                            fadeAnim={fadeAnim}
                        />
                    }

                    {slideCount == 2 && 
                        <ImageRobot 
                            setImageCount={setImageCount}
                            imageCount={imageCount}
                            fadeAnim={fadeAnim}
                            setUpgradedTabHandler = {setUpgradedTabHandler}
                            upgradedTab = {upgradedTab}
                        />
                    }
                    {slideCount === 3 &&
                        <ImageChat 
                            imageCount={imageCount}
                            setImageCount={setImageCount}
                            fadeAnim={fadeAnim}
                        />
                    }
                </View>
            </View>
    );
}

export default ImageDisplayContainer


const styles = StyleSheet.create({
    shadowContainer: {
        borderRadius: 20,
        flex: 1,
        ...(Platform.OS === 'ios'
          ? {
              shadowColor: 'rgba(0, 0, 0, 1)',
              shadowOffset: { height: 3, width: 1 },
              shadowRadius: 4,
              shadowOpacity: 1,
            }
          : {
              elevation: 4,
        }),
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        borderRadius: 20,
        overflow: 'hidden', // keep this here to make sure content respects the borderRadius
        height: SCREEN_HEIGHT * ratioHeightIphoneScreen- 95, //Platform.OS === 'ios' ? 700 : hp('90%'),
        width:  SCREEN_WIDTH * ratioWidthIphoneScreen - 22, //Platform.OS === 'ios' ? '100%' : wp('90%'), //th
    },
    image: {
        borderRadius: 20,
        borderColor: `rgba(77, 77, 77, 0.4)`,
        borderWidth: 1,
        height: SCREEN_HEIGHT * ratioHeightIphoneScreen - 95, //Platform.OS === 'ios' ? 700 : hp('90%'),
        width:  SCREEN_WIDTH * ratioWidthIphoneScreen - 22, //Platform.OS === 'ios' ? '100%' : wp('90%'), // assuming you want the image to take full width
        opacity: 0.979,
        transform: [{translateY: -hp('1.1%')}]
    },

})