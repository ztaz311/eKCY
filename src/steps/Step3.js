import React, { useRef } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import convertLanguage from '../languages'
import ImageResizer from 'react-native-image-resizer';
import ImageEditor from "@react-native-community/image-editor";
const { width, height } = Dimensions.get('window');
const scale = width / 360
var RNFS = require('react-native-fs');

export default function Step3({ onNextStep3, setLoading, language }) {

    const cameraRef = useRef(null)

    const resize = async (pathName) => {
        return ImageResizer.createResizedImage(pathName, 500, 500, 'JPEG', 100, 0, null)
            .then(async (resizedImageUrl) => {
                return ImageEditor.cropImage(resizedImageUrl.uri, {
                    offset: { x: 0, y: 60 },
                    size: { width: resizedImageUrl.width, height: resizedImageUrl.width + 80 }
                }).then(async url => {
                    const base64 = await RNFS.readFile(url, 'base64');
                    return base64
                })
            })
            .catch((err) => console.log('failed to resize: ' + err));

    }
    // capture camera
    const takePicture = React.useCallback(async () => {
        setLoading(true)
        const images = await cameraRef?.current.capture()
        onNextStep3(await resize(images.uri))
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
                {convertLanguage(language, 'face_center')}
            </Text>
            <TouchableOpacity
                onPress={takePicture} style={{
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
