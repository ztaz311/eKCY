import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { RNCamera, FaceDetector } from 'react-native-camera';
import { readFile as read, writeFile as write } from "react-native-fs";

// import { createThumbnail } from "react-native-create-thumbnail";




export default function Step6() {
    const cameraRef = useRef(null)

    const [pictures, setPictures] = useState({
        center: {},
        left: {},
        right: {}
    })
    const takePicture = async () => {

        // const picturesLocal = [...pictures];

        const picture = await cameraRef?.current.takePictureAsync();
        // console.log('a1', picture);


        // const picture = await cameraRef?.current.recordAsync({ maxDuration: 5 });

        console.log('picture', picture);
        // await read(picture.uri, "base64").then(contents => {
        //     console.log('contentsLeft', contents);
        // });
        // await createThumbnail({
        //     url: 'file:///data/user/0/com.ekcy/cache/Camera/057f9004-b3ec-41d9-afce-f3b2a87915a0.mp4',
        //     timeStamp: 5,
        //     dirSize: 1000
        //     // cacheName
        // }).then(response => {
        //     console.log('test', response);
        // })
        //3s bc 0-2
        //center 3-5
        // let centerLocal = {}
        // let leftLocal = {}
        // let rightLocal = {}
        // for (let index = 3; index < 6; index++) {
        //     createThumbnail({
        //         url: picture.uri,
        //         timeStamp: index,
        //     })
        //         .then(response => {
        //             centerLocal[index] = response.path
        //         })
        // }

        // //3s bc 6-8
        // //left 9-11
        // for (let index = 9; index < 12; index++) {
        //     createThumbnail({
        //         url: picture.uri,
        //         timeStamp: index,
        //     })
        //         .then(response => {
        //             leftLocal[index] = response.path
        //         })
        // }

        // //3s bc 12-15
        // //right 15-17
        // for (let index = 15; index < 18; index++) {
        //     createThumbnail({
        //         url: picture.uri,
        //         timeStamp: index,
        //     })
        //         .then(response => {
        //             rightLocal[index] = response.path
        //         })
        // }
        // await setPictures({
        //     center: centerLocal,
        //     left: leftLocal,
        //     right: rightLocal
        // })
    };
    console.log('DDD', pictures);
    return (
        <View style={{
            flex: 1, justifyContent: 'center',
            alignItems: 'center',
        }}>
            <View style={{

                height: 240,
                width: 240,
                borderRadius: 120,
                overflow: 'hidden'
            }}>
                <RNCamera
                    ref={cameraRef}
                    style={{
                        height: 240,
                        width: 240
                    }}
                    focusDepth={0}
                    autoFocus={RNCamera.Constants.AutoFocus.off}
                    type={RNCamera.Constants.Type.front}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    ratio={'16:9'}
                    exposure={5}
                    // captureAudio={false}
                    saveToInternalStorage={true}
                    onFaceDetected={false}
                />
            </View>
            <TouchableOpacity style={styles.capture} onPress={takePicture}>
                <Text style={{ fontSize: 14 }}> SNAP </Text>
            </TouchableOpacity>
            <View>
                <Image source={{ uri: 'file:///data/user/0/com.ekcy/cache/thumbnails/thumb-9abca180-9a4d-40df-bc84-f17b814f1eb3' }} style={{ width: 200, height: 200 }} />
            </View>
            {/* <Image source={{ uri: 'file:///data/user/0/com.ekcy/cache/thumbnails/thumb-bf2c91b4-29ca-4426-90ee-9baf812fd51' }} style={{ width: 200, height: 200 }} /> */}
            {/* <Text>center</Text>
            {
                Object.values(pictures.center).map((item, index) => {
                    return (
                        <Image key={index + 'center'} source={{ uri: item }} style={{ width: 200, height: 200 }} />
                    )
                })
            }
            <Text>left</Text>
            {
                Object.values(pictures.left).map((item, index) => {
                    return (
                        <Image key={index + 'left'} source={{ uri: item }} style={{ width: 200, height: 200 }} />
                    )
                })
            }
            <Text>right</Text>
            {
                Object.values(pictures.right).map((item, index) => {
                    return (
                        <Image key={index + 'right'} source={{ uri: item }} style={{ width: 200, height: 200 }} />
                    )
                })
            } */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});
