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

    return(
        <>
            <View style = {[styles.imageContainer, {height: height}]}>
                <View style = {{position: 'absolute', top: 5, left: 5, zIndex: 1}}>
                    <Icon 
                        icon={height === 221 ? 'close' : 'open'}
                        size = {25}
                        color = {ColorsGray.gray400}
                        onPress={() => {closeIconHandler()}}
                    />
                </View>
                {height === 221 &&
                <Video
                    source= {video} // You can use a remote or local video file
                    style={{width: "100%", height: "100%", alignSelf: 'center'}}
                    resizeMode={'cover'} // Set the resizeMode
                    shouldPlay={true} // Set the video to play
                    isLooping={true} // Set the video to loop
                    useNativeControls={true} // Show the video controls
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
                }
            </View>
        </>
    )
}

export default VideoDisplay;


const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: ColorsGray.gray900,//ColorsBlue.blue1200,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 1,
        shadowOpacity: 1,
        elevation: 4,
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