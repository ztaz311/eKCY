import React from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const { width, height } = Dimensions.get('window');
const scale = width / 360

function CameraComponent({ isPlaying, cameraRef, setisPlaying, setTimer }) {
    return (
        <CountdownCircleTimer
            isPlaying={isPlaying}
            duration={17}
            size={260 * scale}
            // initialRemainingTime={0}
            onComplete={() => {
                console.log('cameraFinish');
                setisPlaying(false)
                // do your stuff here
                // return [true, 90000] // repeat animation in 1.5 seconds
            }}
            colors={[
                ['#004777', 0.4],
                ['#F7B801', 0.4],
                ['#A30000', 0.2],
            ]}
        >
            {({ remainingTime, animatedColor }) => {
                setTimer(17 - remainingTime)
                return (
                    <Animated.Text style={{ color: animatedColor, marginTop: 6 }}>

                        {/* {remainingTime} */}
                        <View style={{
                            height: 240 * scale,
                            width: 240 * scale,
                            borderRadius: (240 * scale) / 2,
                            overflow: 'hidden',
                            // paddingBottom: 100
                            // flex: 1,
                            // backgroundColor: 'red',
                        }}>
                            <Camera
                                style={{
                                    height: 240 * scale,
                                    width: 240 * scale,
                                }}

                                flashMode="off" // on/off/auto(default)
                                focusMode="on" // off/on(default)
                                zoomMode="off" // off/on(default)
                                torchMode="off" // on/off(default)
                                ratioOverlay="1:1" // optional
                                ratioOverlayColor="#00000077" // optional
                                // resetFocusTimeout={5000}
                                resetFocusWhenMotionDetected={true}

                                saveToCameraRollWithPhUrl={true}
                                ref={cameraRef}
                                saveToCameraRoll={false}
                                saveToInternalStorage={true}
                                cameraType={CameraType.Front} // front/back(default)
                            />
                        </View>
                    </Animated.Text>
                )
            }


            }
        </CountdownCircleTimer >
    )
}
export default React.memo(CameraComponent)
