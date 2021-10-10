import React from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'

const { width, height } = Dimensions.get('window');
const scale = width / 360

export default function Step4({ dataResponse, data, setActiveStep, clearData }) {

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Image source={{ uri: `data:image/jpeg;base64,${data.card_front}` }} style={{ width: 120 * scale, height: 70 * scale, marginRight: 5 * scale }} resizeMode="contain" />
                    <Image source={{ uri: `data:image/jpeg;base64,${data.card_back}` }} style={{ width: 120 * scale, height: 70 * scale }} resizeMode="contain" />
                </View>
                <Image source={{ uri: `${data.image}` }} style={{ width: 85 * scale, height: 85 * scale, borderRadius: 50 }} />
            </View>
            <View style={{ flex: 1, marginTop: 35 * scale }}>
                <View style={{ flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1, paddingBottom: 10 }}>
                    <Text style={{ color: 'white', fontSize: 15 * scale, marginRight: 10 * scale, flex: 3 / 5 }}>KẾT QUẢ XÁC NHẬN KHUÔN MẶT</Text>
                    <Text style={{ fontSize: 15 * scale, fontWeight: 'bold', color: dataResponse?.verify?.responses[0]?.isMatch === true ? 'green' : 'red', flex: 2 / 5 }}>{dataResponse?.verify?.responses[0]?.isMatch === true ? 'THÀNH CÔNG' : 'THẤT BẠI'}</Text>
                </View>
                <View style={{ flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1, paddingBottom: 10 }}>
                    <Text style={{ color: 'white', fontSize: 15 * scale, marginRight: 10 * scale, flex: 3 / 5 }}>KẾT QUẢ XÁC NHẬN NGƯỜI THẬT</Text>
                    <Text style={{ fontSize: 15 * scale, fontWeight: 'bold', color: dataResponse?.liveness?.responses?.filter(s => s.isLive == true)?.length === 3 ? 'green' : 'red', flex: 2 / 5 }}>{dataResponse?.liveness?.responses?.filter(s => s.isLive == true)?.length === 3 ? 'THÀNH CÔNG' : 'THẤT BẠI'}</Text>
                </View>
                <View style={{ flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1, paddingBottom: 10 }}>
                    <Text style={{ color: 'white', fontSize: 15 * scale, marginRight: 10 * scale, flex: 3 / 5 }}>Họ tên</Text>
                    <Text style={{ color: 'white', fontSize: 15 * scale, fontWeight: 'bold', flex: 2 / 5 }}>{dataResponse?.card_front && dataResponse?.card_front[2]?.description || 'N/A'}</Text>
                </View>
                <View style={{ flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1, paddingBottom: 10 }}>
                    <Text style={{ color: 'white', fontSize: 15 * scale, marginRight: 10 * scale, flex: 3 / 5 }}>Ngày sinh</Text>
                    <Text style={{ color: 'white', fontSize: 15 * scale, fontWeight: 'bold', flex: 2 / 5 }}>{dataResponse?.card_front && dataResponse?.card_front[3]?.description || 'N/A'}</Text>
                </View>
                <View style={{ flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1, paddingBottom: 10 }}>
                    <Text style={{ color: 'white', fontSize: 15 * scale, marginRight: 10 * scale, flex: 3 / 5 }}>Số CMND/CCCD/Hộ chiếu giấy</Text>
                    <Text style={{ color: 'white', fontSize: 15 * scale, fontWeight: 'bold', flex: 2 / 5 }}>{dataResponse?.card_front && dataResponse?.card_front[1]?.description || 'N/A'}</Text>
                </View>
                <View style={{ flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1, paddingBottom: 10 }}>
                    <Text style={{ color: 'white', fontSize: 15 * scale, marginRight: 10 * scale, flex: 3 / 5 }}>Ngày cấp</Text>
                    <Text style={{ color: 'white', fontSize: 15 * scale, fontWeight: 'bold', flex: 2 / 5 }}>{dataResponse?.card_end && dataResponse?.card_end[1]?.description || 'N/A'}</Text>
                </View>
                <View style={{ flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1, paddingBottom: 10 }}>
                    <Text style={{ color: 'white', fontSize: 15 * scale, marginRight: 10 * scale, flex: 3 / 5 }}>Nơi cấp</Text>
                    <Text style={{ color: 'white', fontSize: 15 * scale, fontWeight: 'bold', flex: 2 / 5 }}>{dataResponse?.card_end && dataResponse?.card_end[2]?.description || 'N/A'}</Text>
                </View>

                <TouchableOpacity style={{ marginBottom: 20, marginTop: 50 * scale, alignSelf: 'center', backgroundColor: '#4BB543' }} onPress={() => { clearData(), setActiveStep(0) }}>
                    <Text style={{ color: 'white', paddingHorizontal: 30 * scale, paddingVertical: 15 * scale, fontSize: 16 * scale, fontWeight: 'bold' }}>Hoàn thành</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
