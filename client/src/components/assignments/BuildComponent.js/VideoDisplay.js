import { StyleSheet,  View } from 'react-native';
import { ColorsBlue, ColorsRed,  } from '../../../constants/palet';
import {Video} from 'expo-av';
import { useState } from 'react';




function VideoDisplay({video}){
    const [playbackProgress, setPlaybackProgress] = useState(0);

    const handlePlaybackStatusUpdate = (playbackStatus) => {
        if (playbackStatus.isPlaying) {
            const progress = playbackStatus.positionMillis / playbackStatus.durationMillis;
            setPlaybackProgress(progress);
        }
    };

    return(
        <>
            <View style = {styles.imageContainer}>
                <Video
                    source= {video} // You can use a remote or local video file
                    style={{width: "100%", height: "100%", alignSelf: 'center'}}
                    resizeMode={Video.RESIZE_MODE_COVER} // Set the resizeMode
                    shouldPlay={true} // Set the video to play
                    isLooping={true} // Set the video to loop
                    useNativeControls={true} // Show the video controls
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', zIndex: 1 }}>
                <View style={{ backgroundColor: 'gray', width: '100%', height: 2 }} />
                <View
                    style={[styles.videoProgressIndicator, {width: `${playbackProgress * 100}%`,}]}
                    />
                    <View
                        style={[styles.playbackBall, {left: `${playbackProgress * 100}%`,}]}
                    />
            </View>
        </>
    )
}

export default VideoDisplay;


const styles = StyleSheet.create({
    imageContainer: {
        height: 221,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: ColorsBlue.blue700,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 6,
        shadowOpacity: 0.5,
        elevation: 4,
        borderTopColor: ColorsBlue.blue900,
        borderTopWidth: 1.2,
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