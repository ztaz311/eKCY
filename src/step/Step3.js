import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View, Platform } from 'react-native';
var RNFS = require('react-native-fs');
import { Camera, CameraType } from 'react-native-camera-kit';

const { width, height } = Dimensions.get('window');
const scale = width / 360
export default function Step3({ onNextStep3, setLoading }) {

    const cameraRef = useRef(null)
    const takePicture = React.useCallback(async () => {
        setLoading(true)
        const images = await cameraRef?.current.capture()
        onNextStep3(images.uri)
    }, []);



    return (
        <View style={{ style: 1, justifyContent: 'center', alignItems: 'center', marginTop: -150 * scale }}>
            <View style={{
                height: 240 * scale,
                width: 240 * scale,
                borderRadius: (240 * scale) / 2,
                overflow: 'hidden',
                backgroundColor: 'black'
            }}>
                <Camera
                    style={{
                        height: 240 * scale,
                        width: 240 * scale,
                        borderRadius: (240 * scale) / 2,
                        overflow: 'hidden',
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
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginTop: 30 * scale }}>
                Căn chỉnh khuôn mặt vào khung
            </Text>
            <TouchableOpacity
                // disabled={isPlaying}
                onPress={takePicture} style={{
                    // flex: 0,
                    backgroundColor: '#e67b7b',
                    borderRadius: 50,
                    padding: 15,
                    // paddingHorizontal: 20,
                    alignSelf: 'center',
                    margin: 20,
                    width: 50 * scale,
                    height: 50 * scale,
                    position: 'absolute', bottom: -140 * scale,
                    justifyContent: 'center', alignItems: 'center'
                }}>
            </TouchableOpacity>

        </View>
    )
}
