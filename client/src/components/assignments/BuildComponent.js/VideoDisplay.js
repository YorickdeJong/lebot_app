import { StyleSheet,  View } from 'react-native';
import { ColorsBlue, ColorsGray, ColorsRed,  } from '../../../constants/palet';
import {Video} from 'expo-av';
import { useState } from 'react';
import Icon from '../../Icon';




function VideoDisplay({video}){
    const [playbackProgress, setPlaybackProgress] = useState(0);
    const [height, setHeight] = useState(221);

    const handlePlaybackStatusUpdate = (playbackStatus) => {
        if (playbackStatus.isPlaying) {
            const progress = playbackStatus.positionMillis / playbackStatus.durationMillis;
            setPlaybackProgress(progress);
        }
    };

    function closeIconHandler(){
        console.log('closeIconHandler called');
        if (height === 221){
            setHeight(40)
        }
        else {
            setHeight(221)
        }
    }

    return (

        <View style={styles.shadowContainer}>
            <View style={[styles.imageContainer, { height: height }]}>
                <View style={{ position: 'absolute', top: 5, left: 5, zIndex: 1 }}>
                <Icon
                    icon={height === 221 ? 'close' : 'open'}
                    size={25}
                    color={ColorsGray.gray200}
                    onPress={() => { closeIconHandler() }}
                />
                </View>
                {height === 221 &&
                <Video
                    source={video}
                    style={{ width: "100%", height: "100%", alignSelf: 'center', overflow: 'hidden', borderRadius: 20 }}
                    resizeMode={'cover'}
                    shouldPlay={true}
                    isLooping={true}
                    useNativeControls={true}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
                }
            </View>
        </View>

    );
}

export default VideoDisplay;


const styles = StyleSheet.create({
    shadowContainer: {
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 3, width: 1 },
        shadowRadius: 4,
        shadowOpacity: 1,
        elevation: 4,
        marginHorizontal: 8,
        borderRadius: 20,
      },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 21,
        borderColor: `rgba(77, 77, 77, 0.2)`,
        borderWidth: 1,
        overflow: 'hidden', // keep this here to make sure content respects the borderRadius
    },
    videoProgressIndicator: {
        position: 'absolute',
        backgroundColor: ColorsRed.ytRed, //ColorsBlue.blue900,
        height: 2,
    },
    playbackBall: {
        position: 'absolute',
        transform: [{ translateX: -8 }],
        backgroundColor: ColorsRed.ytRed,//ColorsBlue.blue900,
        width: 8,
        height: 8,
        borderRadius: 6,
    },
})