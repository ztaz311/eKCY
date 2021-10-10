import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View, Platform } from 'react-native';
import CameraComponent from '../components/CameraComponent';
var RNFS = require('react-native-fs');
import ImageResizer from 'react-native-image-resizer';
import ImageEditor from "@react-native-community/image-editor";

const { width, height } = Dimensions.get('window');
const scale = width / 360
export default function Step2({ onNextStep2, setLoading }) {
    const [isPlaying, setisPlaying] = useState(false)
    const [timer, setTimer] = useState(-1)
    const [data, setData] = useState({
        left: [],
        center: [],
        right: []
    })
    const [valueCapture] = useState(0)
    useEffect(() => {
        return () => setisPlaying(false)
    }, [])


    useEffect(async () => {
        if (isPlaying) {
            let i = timer
            if (i > 2 && i < 5) {
                let images = await Promise.all(Array.from(Array(5), () => cameraRef.current.capture()));
                let images2 = await Promise.all(Array.from(images, x => resize(x.uri)))
                setData(prevState => {
                    return { ...prevState, center: [...prevState.center, ...images2] }
                })
            }

            if (i > 8 && i < 11) {
                let images = await Promise.all(Array.from(Array(5), () => cameraRef.current.capture()));
                let images2 = await Promise.all(Array.from(images, x => resize(x.uri)))
                setData(prevState => {
                    return { ...prevState, left: [...prevState.left, ...images2] }
                })
            }
            if (i > 14 && i < 17) {
                let images = await Promise.all(Array.from(Array(5), () => cameraRef.current.capture()));
                let images2 = await Promise.all(Array.from(images, x => resize(x.uri)))
                await setData(prevState => {
                    return { ...prevState, right: [...prevState.right, ...images2] }
                })
            }
            if (i === 19) {
                setLoading(true)
                // setTimer(-1)
                // onNextStep2(data)
                // console.log('data', data);
            }
        }
    }, [timer])

    useEffect(() => {
        if (Array.isArray(data?.right) && data?.right.length === 10) {
            setLoading(true)
            onNextStep2(data)
        }
    }, [data])


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
    const cameraRef = useRef(null)
    const takePicture = React.useCallback(async () => {
        setisPlaying(true)
        setData({
            left: [], center: [], right: []
        })
    }, [valueCapture]);

    const getLogo = () => {
        if (timer < 6) {
            return <Image source={require('../assets/face-center.png')} style={{ width: 70 * scale, height: 70 * scale, alignSelf: 'center', marginTop: -5 }} resizeMode="contain" />
        } else if (timer > 5 && timer < 12) {
            return <Image source={require('../assets/face-left.png')} style={{ width: 55 * scale, height: 45 * scale, alignSelf: 'center' }} resizeMode="contain" />
        } else if (timer > 11 && timer < 19) {
            return <Image source={require('../assets/face-right.png')} style={{ width: 55 * scale, height: 45 * scale, alignSelf: 'center' }} resizeMode="contain" />
        } else {
            return <Image source={require('../assets/face-begin.png')} style={{ width: 45 * scale, height: 45 * scale, alignSelf: 'center' }} resizeMode="contain" />
        }
    }

    const getDes = () => {
        if (timer < 3) {
            let i = timer === 0 ? 3 : timer === 1 ? 2 : 1
            return (
                <>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, textAlign: 'center' }}>Nhìn thẳng</Text>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale }}>
                        Bắt đầu thu hình sau {i} giây
                    </Text>
                </>
            )

        } else if (timer === 6 || timer === 7 || timer === 8) {
            let i = timer === 6 ? 3 : timer === 7 ? 2 : 1
            return <>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, textAlign: 'center' }}>Quay sang trái</Text>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale }}>
                    Bắt đầu thu hình sau {i} giây
                </Text>
            </>

        } else if (timer === 12 || timer === 13 || timer === 14) {
            let i = timer === 12 ? 3 : timer === 13 ? 2 : 1
            return <>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, textAlign: 'center' }}>Quay sang phải</Text>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale }}>
                    Bắt đầu thu hình sau {i} giây
                </Text>
            </>

        } else if (timer === 3 || timer === 4 || timer === 5) {
            return <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale }}>
                Nhìn thẳng
            </Text>

        } else if (timer === 9 || timer === 10 || timer === 11) {
            return <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale }}>
                Quay sang trái
            </Text>

        } else if (timer === 15 || timer === 16 || timer === 17 || timer === 18) {
            return <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale }}>
                Quay sang phải
            </Text>

        }
        else {
            return <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale }}>Căn chỉnh khuyân mặt vào khung</Text>


        }
    }

    const renderDes = () => {
        return (
            <View style={{ marginTop: 25 * scale, height: 50 * scale }}>
                {
                    isPlaying ?
                        <>
                            {getLogo()}
                            {getDes()}
                        </>
                        :
                        <>
                            <Image source={require('../assets/face-begin.png')} style={{ width: 45 * scale, height: 45 * scale, alignSelf: 'center' }} resizeMode="contain" />
                            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale }}>Căn chỉnh khuôn mặt vào khung</Text>
                        </>
                }
            </View>
        )
    }

    return (
        <View style={{ style: 1, justifyContent: 'center', alignItems: 'center', marginTop: -150 * scale }}>
            <Image source={require('../assets/circle-progress.png')} style={{
                width: 300 * scale, height: 300 * scale, tintColor: 'white', position: 'absolute',
                right: Platform.OS === 'ios' ? 20 : 19, top: Platform.OS === 'ios' ? -22 : -17, zIndex: 999
                //ios   right: 20, top: -22,
            }} />
            <CameraComponent setTimer={setTimer} cameraRef={cameraRef} isPlaying={isPlaying} setisPlaying={setisPlaying} />
            {renderDes()}
            <TouchableOpacity
                disabled={isPlaying}
                onPress={takePicture} style={{
                    backgroundColor: '#e67b7b',
                    borderRadius: 50,
                    padding: 15,
                    alignSelf: 'center',
                    margin: 20,
                    width: 50 * scale,
                    height: 50 * scale,
                    position: 'absolute', bottom: -140 * scale,
                    justifyContent: 'center', alignItems: 'center'
                }}>

                {isPlaying &&
                    <View
                        style={{
                            width: 35 * scale,
                            height: 35 * scale,
                            backgroundColor: '#e84545',
                            borderRadius: 50,
                        }}
                    />}

            </TouchableOpacity>
        </View>
    )
}
