import React, { useState, useRef, useEffect } from 'react'
import { Platform, Image, LogBox, View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native'
import { ProgressSteps, ProgressStep } from './src/components/react-native-progress-steps';
// import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import Step1 from './src/step/Step1';
import Step2 from './src/step/Step2';
import Step3 from './src/step/Step3';
import Step4 from './src/step/Step4';
import { Modalize } from 'react-native-modalize';
import callApi from './src/services/HTTP';
import Toast from 'react-native-simple-toast';
import { readFile as read, writeFile as write } from "react-native-fs";
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { width, height } = Dimensions.get('window');
const scale = width / 360

LogBox.ignoreAllLogs(['Warning: ...']);
console.disableYellowBox = true;


const defaultScrollViewProps = {
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor:
  },
  scrollEnabled: false
};


export default function App() {

  const requestPermission = (data) => {
    if (data == 'denied') {
      request(Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA).then((result) => {
        if (result === 'blocked') {
          Toast.showWithGravity('Bạn phải cấp quyền thiết bị!', Toast.LONG, Toast.CENTER)
        }
        if (result === 'denied') {
          requestPermission(result)
        }
      });
    }
  }

  const checkPermission = () => {
    check(Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA).then(res => {
      if (res === 'blocked') {
        Toast.showWithGravity('Bạn phải cấp quyền thiết bị!', Toast.LONG, Toast.CENTER)
      }
      if (res === 'denied') {
        requestPermission(res)
      }
    }).catch(e => {
      Toast.showWithGravity('Có lỗi', Toast.LONG, Toast.CENTER)
    })
  }
  useEffect(() => {
    checkPermission()
  }, [])


  const modalizeRef = useRef(null);
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    card_front: '',
    card_back: '',
    image: ''
  })
  const clearData = () => {
    setData({
      card_front: '',
      card_back: '',
      image: ''
    })
  }

  const [dataResponse, setDataResponse] = useState({})


  const [upload, setUpload] = useState({
    camera: 0,
    file: 0
  })




  const onOpenModalize = () => {
    modalizeRef.current?.open();
  };
  const onCloseModalize = () => {
    modalizeRef.current?.close();
  };

  const [activeStep, setActiveStep] = useState(0)


  const changeUpload = (name) => {
    setUpload({
      ...upload, [name]: upload[name] + 1
    })
  }


  const onNextStep1 = () => {
    var body = {
      "requests": [
        {
          "features": [
            {
              "type": "FRONT_ID_CARD"
            }
          ],
          "image": {
            "content": data.card_front
          }
        },
        {
          "features": [
            {
              "type": "BACK_ID_CARD"
            }
          ],
          "image": {
            "content": data.card_back
          }
        }
      ]
    }

    setLoading(true)
    callApi('v2/images:annotate', 'POST', body).then(res => {
      console.log('annotate', res);
      if (res?.responses?.length === 2 && res?.responses[0].results[0]?.objects?.length === 6 && res?.responses[1].results[0]?.objects?.length >= 2) {
        setDataResponse({
          ...dataResponse,
          card_front: res?.responses[0].results[0]?.objects,
          card_end: res?.responses[1].results[0]?.objects
        })
        setActiveStep(1)
      } else {
        Toast.showWithGravity('Có lỗi vui lòng thực hiện lại!', Toast.LONG, Toast.TOP)
      }
      setLoading(false)
    })
  };



  const onNextStep2 = async (data) => {
    // console.log('data', data);
    let center = []
    let left = []
    let right = []


    for await (let [index, element] of data.center?.entries()) {
      await read(element, "base64").then(contents => {
        center[index] = contents
      });
    }

    for await (let [index, element] of data.left?.entries()) {
      await read(element, "base64").then(contents => {
        left[index] = contents
      });
    }
    for await (let [index, element] of data.right?.entries()) {
      await read(element, "base64").then(contents => {
        right[index] = contents
      });
    }
    var body = await {
      "requests": [{
        "images": [{
          "content": center[0]
        },
        {
          "content": center[1]
        },
        {
          "content": center[2]
        }
        ],
        "action": 'FRONTAL_FACE'
      },
      {
        "images": [{
          "content": left[0]
        },
        {
          "content": left[1]
        },
        {
          "content": left[2]
        }
        ],
        "action": 'RIGHT_POSE_HEAD'
      },
      {
        "images": [{
          "content": right[0]
        },
        {
          "content": right[1]
        },
        {
          "content": right[2]
        }
        ],
        "action": 'LEFT_POSE_HEAD'
      }]
    }
    // console.log('body', body);
    callApi('v2/images:liveness', 'POST', body).then(res => {
      console.log('liveness', res);
      // [{score: 1, isLive: true},{score: 1, isLive: true},{score: 1, isLive: true}]
      setDataResponse({ ...dataResponse, liveness: res })
      setLoading(false)
      setActiveStep(2)
    })
  }

  const onNextStep3 = async (image) => {
    await read(image, "base64").then(contents => {
      var body = {
        "requests": [{
          "images": [{
            "content": data.card_front
          },
          {
            "content": contents
          }
          ]
        }]
      }

      callApi('v2/images:verify', 'POST', body).then(res => {
        // [{isMatch: true, score: 0.6105406284332275}]
        console.log('verify', res);
        setLoading(false)
        setDataResponse({ ...dataResponse, verify: res })
        setActiveStep(3)
        setData({ ...data, image })
      })
    });
  }

  // console.log('dataResss', dataResponse);


  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }} >
        <StatusBar
          animated={true}
          backgroundColor="#61dafb"
          barStyle={'light-content'}
          showHideTransition={'fade'}
          hidden={false} />
        {loading && <ActivityIndicator size="large" color="green" style={{ zIndex: 999, backgroundColor: '#c7c7c7', opacity: 0.9, flex: 1, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }} />}

        <View style={{ flex: 1, marginHorizontal: 12 * scale }}>
          <ProgressSteps activeStep={activeStep}>
            <ProgressStep
              onNext={onNextStep1}
              //  errors={state.errors}
              label="Chụp ảnh CMND/CCCD"
              //  scrollViewProps={defaultScrollViewProps}
              nextBtnText={"Tiếp tục"}>
              <Step1 data={data} setData={setData}
                onOpenModalize={onOpenModalize} upload={upload} onCloseModalize={onCloseModalize} setUpload={() => setUpload({ camera: 0, file: 0 })} />
            </ProgressStep>
            <ProgressStep
              removeBtnRow={true}
              label={`Xác nhận\nngười thật`}
              scrollViewProps={defaultScrollViewProps}

            >
              <Step2 setLoading={setLoading} onNextStep2={onNextStep2} setActiveStep={setActiveStep} />

            </ProgressStep>
            <ProgressStep
              removeBtnRow={true}
              label={`Xác thực\nkhuôn mặt`}
              scrollViewProps={defaultScrollViewProps}

            >
              <Step3 onNextStep3={onNextStep3} setLoading={setLoading} />
            </ProgressStep>
            <ProgressStep
              removeBtnRow={true}
              label={`Thông tin\nhợp đồng`}
            // scrollViewProps={defaultScrollViewProps}

            >
              <Step4 dataResponse={dataResponse} data={data} setActiveStep={setActiveStep} clearData={clearData} />
            </ProgressStep>
          </ProgressSteps>
        </View>
      </SafeAreaView>


      {/*  */}
      <Modalize
        overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        alwaysOpen={0}
        handlePosition="inside"
        modalHeight={80 * scale}
        // modalHeight={360 * scale}
        snapPoint={80 * scale}
        handleStyle={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
        scrollViewProps={{ scrollEnabled: false }}
        ref={modalizeRef}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 35 * scale, }}>
          <TouchableOpacity
            onPress={() => { checkPermission(), changeUpload('camera') }}
            style={{ flexDirection: 'row', paddingHorizontal: 20 * scale, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('./src/assets/upload_camera.png')} style={{ width: 24 * scale, height: 24 * scale, marginRight: 3 * scale }} />
            <Text style={{ fontSize: 16 * scale, fontWeight: 'bold' }}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeUpload('file')}
            style={{ flexDirection: 'row', paddingHorizontal: 20 * scale, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('./src/assets/upload_file.png')} style={{ width: 24 * scale, height: 24 * scale, marginRight: 3 * scale }} />
            <Text style={{ fontSize: 16 * scale, fontWeight: 'bold' }}>Library</Text>
          </TouchableOpacity>
        </View>
      </Modalize>


    </>
  )
}
