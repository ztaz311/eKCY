import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const { width, height } = Dimensions.get('window');
const scale = width / 360
export default function Step1({ onOpenModalize, upload, onCloseModalize, setUpload, data, setData }) {


    const [choose, setChoose] = useState('front')

    const onUploadCamera = () => {
        ImagePicker.openCamera({
            width: 600,
            height: 400,
            includeBase64: true,
            cropping: true,
        }).then(image => {
            console.log('image', image)
            setData({
                ...data,
                [`card_${choose}`]: image.data
            })
            onCloseModalize()
        });
    }

    const onUploadFile = () => {
        ImagePicker.openPicker({
            width: 700,
            height: 400,
            cropping: true,
            mediaType: 'photo',
            includeBase64: true,
        }).then(image => {
            console.log('image2', image)
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
            <Text style={styles.txtLabel}>Ảnh hộ chiếu/ CMND:</Text>
            <Text style={{ marginBottom: 10 * scale, color: 'white' }}>Mặt trước</Text>
            {
                data.card_front === '' ?
                    <TouchableOpacity style={styles.boxUpload} onPress={() => { onOpenModalize(), setChoose('front') }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../assets/PhotoAdd2.png')} style={styles.imgUpload} resizeMode="contain" />
                            <Text style={{ color: 'white', fontSize: 17 * scale, fontWeight: 'bold' }}>Tải ảnh lên</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <View style={styles.boxUpload}>
                        <Image source={{ uri: `data:image/png;base64,${data.card_front}` }} style={{ width: 328 * scale, height: 182 * scale, borderRadius: 16 }} />
                        <TouchableOpacity style={[styles.boxUpdateImage, styles.btnUpdateImage]}
                            onPress={() => { onOpenModalize(), setChoose('front') }}
                        >
                            <Image style={styles.ic_camera} source={require('../assets/camera2.png')} />
                            <Text style={styles.txtUpdateImage}>Sửa ảnh</Text>
                        </TouchableOpacity>
                    </View>
            }

            <Text style={{ marginVertical: 10 * scale, color: 'white', marginTop: 20 * scale }}>Mặt sau</Text>

            {
                data.card_back === '' ?
                    <TouchableOpacity style={styles.boxUpload} onPress={() => { onOpenModalize(), setChoose('back') }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../assets/PhotoAdd2.png')} style={styles.imgUpload} resizeMode="contain" />
                            <Text style={{ color: 'white', fontSize: 17 * scale, fontWeight: 'bold' }}>Tải ảnh lên</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <View style={styles.boxUpload}>
                        <Image source={{ uri: `data:image/png;base64,${data.card_back}` }} style={{ width: 328 * scale, height: 182 * scale, borderRadius: 16 }} />
                        <TouchableOpacity style={[styles.boxUpdateImage, styles.btnUpdateImage]}
                            onPress={() => { onOpenModalize(), setChoose('back') }}
                        >
                            <Image style={styles.ic_camera} source={require('../assets/camera2.png')} />
                            <Text style={styles.txtUpdateImage}>Sửa ảnh</Text>
                        </TouchableOpacity>
                    </View>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    txtLabel: {
        color: 'white',
        fontWeight: 'bold'
    },
    boxUpload: {
        borderColor: 'white',
        borderRadius: 16,
        width: 328 * scale,
        height: 182 * scale,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtUpload: {
        color: 'white',
        fontWeight: 'bold'
    },
    imgUpload: {
        width: 48 * scale,
        height: 48 * scale,
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
        width: 16,
        height: 16,
        marginRight: 4,
    },
    txtUpdateImage: {
        color: '#FFFFFF',
        fontSize: 12,
    },
})
