import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View, Platform } from 'react-native';
import CameraComponent from '../components/CameraComponent';
var RNFS = require('react-native-fs');
import ImageResizer from 'react-native-image-resizer';
import ImageEditor from "@react-native-community/image-editor";
import convertLanguage from '../languages'


const group1 = ['LEFT_POSE_HEAD', 'RIGHT_POSE_HEAD', 'FRONTAL_FACE']
const group2 = ['CLOSE_LEFT_EYE', 'CLOSE_RIGHT_EYE', 'FRONTAL_FACE']
const group3 = ['SMILE_TRANSITION', 'FRONTAL_FACE']

const { width, height } = Dimensions.get('window');
const scale = width / 360
export default function Step2({ onNextStep2, setLoading, language }) {
    const [isPlaying, setisPlaying] = useState(false)
    const [timer, setTimer] = useState(-1)
    // const [data, setData] = useState({
    //     left: [],
    //     center: [],
    //     right: [],

    //     LEFT_POSE_HEAD: [],
    //     RIGHT_POSE_HEAD: [],
    //     FRONTAL_FACE: [],
    //     CLOSE_LEFT_EYSE: [],
    //     CLOSE_RIGHT_EYSE: [],
    //     SMILE_TRANSITION: [],
    // })
    const [data, setData] = useState({})
    const [action, setAction] = useState([])
    const [valueCapture] = useState(0)


    useEffect(() => {
        let group = get_random([group1, group2, group3])
        let randomAction = group.sort(() => (Math.random() > .5) ? 1 : -1)
        setAction(randomAction)
        return () => setisPlaying(false)
    }, [])

    function get_random(list) {
        return list[Math.floor((Math.random() * list.length))];
    }
    console.log('action', action);
    // capturing camera
    useEffect(async () => {
        if (isPlaying) {
            let i = timer
            if (i > 2 && i < 5) {
                let images = await Promise.all(Array.from(Array(5), () => cameraRef.current.capture()));
                let images2 = await Promise.all(Array.from(images, x => resize(x.uri)))
                // console.log(i, images2);
                setData(prevState => {
                    if (prevState[action[0]] === undefined) {
                        return { ...prevState, [action[0]]: [...images2] }
                    } else {
                        return { ...prevState, [action[0]]: [...prevState[action[0]], ...images2] }
                    }
                })
            }

            if (i > 8 && i < 11) {
                let images = await Promise.all(Array.from(Array(5), () => cameraRef.current.capture()));
                let images2 = await Promise.all(Array.from(images, x => resize(x.uri)))
                // console.log(i, images2);
                // setData(prevState => {
                //     return { ...prevState, [action[1]]: [...prevState[action[1]], ...images2] }
                // })
                setData(prevState => {
                    if (prevState[action[1]] === undefined) {
                        return { ...prevState, [action[1]]: [...images2] }
                    } else {
                        return { ...prevState, [action[1]]: [...prevState[action[1]], ...images2] }
                    }
                })
            }
            if (i > 14 && i < 17) {
                let images = await Promise.all(Array.from(Array(5), () => cameraRef.current.capture()));
                let images2 = await Promise.all(Array.from(images, x => resize(x.uri)))
                // console.log(i, images2);
                // await setData(prevState => {
                //     return { ...prevState, [action[2]]: [...prevState[action[2]], ...images2] }
                // })
                await setData(prevState => {
                    if (prevState[action[2]] === undefined) {
                        return { ...prevState, [action[2]]: [...images2] }
                    } else {
                        return { ...prevState, [action[2]]: [...prevState[action[2]], ...images2] }
                    }
                })
            }
            // if (i === 19) {
            //     setLoading(true)
            //     // setTimer(-1)
            //     // onNextStep2(data)
            //     // console.log('data', data);
            // }
        }
    }, [timer])


    // check data capture and call api
    useEffect(() => {
        // if (Array.isArray(data?.right) && data?.right.length === 10) {
        //     setLoading(true)
        //     onNextStep2(data)
        // }
        if (Array.isArray(data[action[action.length - 1]]) && data[action[action.length - 1]].length === 10) {
            setLoading(true)
            onNextStep2(data)
            // console.log('data', data);
        }
    }, [data])



    // crop , resize image and convert base64 
    const resize = async (pathName) => {
        return ImageResizer.createResizedImage(pathName, 500, 500, 'JPEG', 100, 0, null)
            .then(async (resizedImageUrl) => {
                return ImageEditor.cropImage(resizedImageUrl.uri, {
                    offset: { x: 0, y: 60 },
                    size: { width: resizedImageUrl.width, height: resizedImageUrl.width + 80 }
                }).then(async url => {
                    const base64 = await RNFS.readFile(url, 'base64');
                    return { content: base64 }
                })
            })
            .catch((err) => console.log('failed to resize: ' + err));

    }
    const cameraRef = useRef(null)


    //  begin capture camera
    const takePicture = React.useCallback(async () => {
        setisPlaying(true)
        // setData({
        //     left: [], center: [], right: []
        // })
    }, [valueCapture]);




    // render icon liveness
    const getLogo = () => {
        if (action.length > 0) {
            const getIcon = (value) => {
                switch (value) {
                    case 'LEFT_POSE_HEAD':
                        return require(`../assets/LEFT_POSE_HEAD.png`)
                    case 'RIGHT_POSE_HEAD':
                        return require(`../assets/RIGHT_POSE_HEAD.png`)
                    case 'FRONTAL_FACE':
                        return require(`../assets/FRONTAL_FACE.png`)
                    case 'CLOSE_LEFT_EYSE':
                        return require(`../assets/CLOSE_LEFT_EYSE.png`)
                    case 'CLOSE_RIGHT_EYSE':
                        return require(`../assets/CLOSE_RIGHT_EYSE.png`)
                    case 'SMILE_TRANSITION':
                        return require(`../assets/SMILE_TRANSITION.png`)
                    default:
                        return require(`../assets/face-begin.png`)
                }
            }

            if (timer < 6) {
                return <Image source={getIcon(action[0])} style={{ width: 45 * scale, height: 45 * scale, alignSelf: 'center', marginTop: -5 }} resizeMode="contain" />
            } else if (timer > 5 && timer < 12) {
                return <Image source={getIcon(action[1])} style={{ width: 45 * scale, height: 45 * scale, alignSelf: 'center' }} resizeMode="contain" />
            } else if (timer > 11 && timer < 19) {
                return <Image source={getIcon(action[2])} style={{ width: 45 * scale, height: 45 * scale, alignSelf: 'center' }} resizeMode="contain" />
            } else {
                return <Image source={require(`../assets/face-begin.png`)} style={{ width: 45 * scale, height: 45 * scale, alignSelf: 'center' }} resizeMode="contain" />
            }
        }
    }

    const returnTextSecons = (i) => convertLanguage(language, 'recording', { i })

    // render description
    const getDes = () => {
        if (timer < 3) {
            let i = timer === 0 ? 3 : timer === 1 ? 2 : 1
            return (
                <>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, textAlign: 'center' }}>
                        {/* {convertLanguage(language, 'FRONTAL_FACE')} */}
                        {convertLanguage(language, action[0])}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale, textAlign: 'center' }}>
                        {returnTextSecons(i)}
                    </Text>
                </>
            )

        } else if (timer === 6 || timer === 7 || timer === 8) {
            let i = timer === 6 ? 3 : timer === 7 ? 2 : 1
            return <>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, textAlign: 'center' }}>
                    {/* {convertLanguage(language, 'LEFT_POSE_HEAD')} */}
                    {convertLanguage(language, action[1])}
                </Text>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale, textAlign: 'center' }}>
                    {returnTextSecons(i)}
                </Text>
            </>

        } else if (timer === 12 || timer === 13 || timer === 14) {
            let i = timer === 12 ? 3 : timer === 13 ? 2 : 1
            return <>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, textAlign: 'center' }}>
                    {/* {convertLanguage(language, 'RIGHT_POSE_HEAD')} */}
                    {convertLanguage(language, action[2])}
                </Text>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale, textAlign: 'center' }}>
                    {returnTextSecons(i)}
                </Text>
            </>

        } else if (timer === 3 || timer === 4 || timer === 5) {
            return <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale, textAlign: 'center' }}>
                {/* {convertLanguage(language, 'FRONTAL_FACE')} */}
                {convertLanguage(language, action[0])}
            </Text>

        } else if (timer === 9 || timer === 10 || timer === 11) {
            return <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale, textAlign: 'center' }}>
                {/* {convertLanguage(language, 'LEFT_POSE_HEAD')} */}
                {convertLanguage(language, action[1])}
            </Text>

        } else if (timer === 15 || timer === 16 || timer === 17 || timer === 18) {
            return <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale, textAlign: 'center' }}>
                {/* {convertLanguage(language, 'RIGHT_POSE_HEAD')} */}
                {convertLanguage(language, action[2])}
            </Text>

        }
        else {
            return <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale, textAlign: 'center' }}>
                {convertLanguage(language, 'face_begin')}
            </Text>
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
                            {/* <Image source={require('../assets/left-eye.png')} style={{ width: 45 * scale, height: 45 * scale, alignSelf: 'center' }} resizeMode="contain" />
                            <Image source={require('../assets/right-eye.png')} style={{ width: 45 * scale, height: 45 * scale, alignSelf: 'center' }} resizeMode="contain" />
                            <Image source={require('../assets/smile1.png')} style={{ width: 45 * scale, height: 45 * scale, alignSelf: 'center' }} resizeMode="contain" /> */}
                            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', lineHeight: 20 * scale, marginVertical: 10 * scale }}>
                                {convertLanguage(language, 'face_begin')}
                            </Text>
                        </>
                }
            </View>
        )
    }

    const _renderCamera = useCallback(() => {
        if (action.length > 0)
            return (
                <CameraComponent playing={action.length === 3 ? 19 : 11} setTimer={setTimer} cameraRef={cameraRef} isPlaying={isPlaying} setisPlaying={setisPlaying} />
            )
    }, [action, isPlaying])


    return (
        <View style={{ style: 1, justifyContent: 'center', alignItems: 'center', marginTop: -150 * scale }}>
            <Image source={require('../assets/circle-progress.png')} style={{
                width: 300 * scale, height: 300 * scale, tintColor: 'white', position: 'absolute',
                right: Platform.OS === 'ios' ? 20 : 19, top: Platform.OS === 'ios' ? -22 : -17, zIndex: 999
                //ios   right: 20, top: -22,
            }} />
            {_renderCamera()}
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
