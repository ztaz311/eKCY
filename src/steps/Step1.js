import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import convertLanguage from '../languages'
const { width, height } = Dimensions.get('window');
const scale = width / 360

export default function Step1({ onOpenModalize, upload, onCloseModalize, setUpload, data, setData, language }) {
    const [choose, setChoose] = useState('front')


    // Open Camera
    const onUploadCamera = () => {
        ImagePicker.openCamera({
            width: 700,
            height: 400,
            includeBase64: true,
            cropping: true,
        }).then(image => {
            setData({
                ...data,
                [`card_${choose}`]: image.data
            })
            onCloseModalize()
        });
    }

    // Open Open Library image
    const onUploadFile = () => {
        ImagePicker.openPicker({
            width: 700,
            height: 400,
            cropping: true,
            mediaType: 'photo',
            includeBase64: true,
        }).then(image => {
            setData({
                ...data,
                [`card_${choose}`]: image.data
            })
            onCloseModalize()
        });
    }

    useEffect(() => {
        if (upload.camera !== 0) {
            setUpload()
            onUploadCamera()
        }
    }, [upload.camera])

    useEffect(() => {
        if (upload.file !== 0) {
            setUpload()
            onUploadFile()
        }
    }, [upload.file])



    return (
        <View>
            {/* <Text style={styles.txtLabel}>Ảnh hộ chiếu/ CMND:</Text> */}
            <Text style={styles.txtChoose}>{convertLanguage(language, 'font')}</Text>
            {
                data.card_front === '' ?
                    <TouchableOpacity style={styles.boxUpload} onPress={() => { onOpenModalize(), setChoose('front') }}>
                        <View style={styles.boxPick}>
                            <Image source={require('../assets/PhotoAdd2.png')} style={styles.imgUpload} resizeMode="contain" />
                            <Text style={styles.txtPickImage}>{convertLanguage(language, 'upload_image')}</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <View style={styles.boxUpload}>
                        <Image source={{ uri: `data:image/png;base64,${data.card_front}` }} style={styles.imgPick} />
                        <TouchableOpacity style={[styles.boxUpdateImage, styles.btnUpdateImage]}
                            onPress={() => { onOpenModalize(), setChoose('front') }}
                        >
                            <Image style={styles.ic_camera} source={require('../assets/camera2.png')} />
                            <Text style={styles.txtUpdateImage}>{convertLanguage(language, 'edit_image')}</Text>
                        </TouchableOpacity>
                    </View>
            }
            <Text style={[styles.txtChoose, { marginTop: 20 * scale }]}>{convertLanguage(language, 'back')}</Text>
            {
                data.card_back === '' ?
                    <TouchableOpacity style={styles.boxUpload} onPress={() => { onOpenModalize(), setChoose('back') }}>
                        <View style={styles.boxPick}>
                            <Image source={require('../assets/PhotoAdd2.png')} style={styles.imgUpload} resizeMode="contain" />
                            <Text style={styles.txtPickImage}>{convertLanguage(language, 'upload_image')}</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <View style={styles.boxUpload}>
                        <Image source={{ uri: `data:image/png;base64,${data.card_back}` }} style={styles.imgPick} />
                        <TouchableOpacity style={[styles.boxUpdateImage, styles.btnUpdateImage]}
                            onPress={() => { onOpenModalize(), setChoose('back') }}
                        >
                            <Image style={styles.ic_camera} source={require('../assets/camera2.png')} />
                            <Text style={styles.txtUpdateImage}>{convertLanguage(language, 'edit_image')}</Text>
                        </TouchableOpacity>
                    </View>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    txtChoose: {
        marginBottom: 10 * scale,
        color: 'white'
    },
    imgPick: {
        width: 295 * scale,
        height: 165 * scale,
        borderRadius: 16
    },
    boxPick: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    txtPickImage: {
        color: 'white',
        fontSize: 17 * scale,
        fontWeight: 'bold'
    },
    txtLabel: {
        color: 'white',
        fontWeight: 'bold'
    },
    boxUpload: {
        borderColor: 'white',
        borderRadius: 16,
        width: 295 * scale,
        height: 165 * scale,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    txtUpload: {
        color: 'white',
        fontWeight: 'bold'
    },
    imgUpload: {
        width: 28 * scale,
        height: 28 * scale,
        tintColor: 'white'
    },
    handleStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxUpdateImage: {
        position: 'absolute',
        bottom: 16 * scale,
        right: 16 * scale
    },
    btnUpdateImage: {
        paddingHorizontal: 12 * scale,
        paddingVertical: 8 * scale,
        backgroundColor: 'rgba(51, 51, 51, 0.75)',
        borderRadius: 35 * scale,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ic_camera: {
        width: 16 * scale,
        height: 16 * scale,
        marginRight: 4,
    },
    txtUpdateImage: {
        color: '#FFFFFF',
        fontSize: 12,
    },
})
