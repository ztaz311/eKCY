import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, LogBox, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { readFile as read } from "react-native-fs";
import { Modalize } from 'react-native-modalize';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import Toast from 'react-native-simple-toast';
import { ProgressStep, ProgressSteps } from './src/components/react-native-progress-steps';
import callApi from './src/services/HTTP';
import Step1 from './src/steps/Step1';
import Step2 from './src/steps/Step2';
import Step3 from './src/steps/Step3';
import Step4 from './src/steps/Step4';
import convertLanguage from './src/languages'

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



  // Check permission camera
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
  const [language, setLanguage] = useState(null)

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



  // Call Api CMND
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
      console.log('res', res);
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


  // Call Api Liveness
  const onNextStep2 = async (data) => {
    try {
      var body = await {
        "requests": [{
          "images": Array.from(data.center, x => ({ 'content': x })),//Array.from(data.center.slice(0, -2), x => ({ 'content': x })),
          "action": 'FRONTAL_FACE'
        },
        {
          "images": Array.from(data.left, x => ({ 'content': x })),
          "action": 'RIGHT_POSE_HEAD'
        },
        {
          "images": Array.from(data.right, x => ({ 'content': x })),
          "action": 'LEFT_POSE_HEAD'
        }]
      }
      console.log('body', body);
      await callApi('v2/images:liveness', 'POST', body).then(res => {
        console.log('liveness', res.responses);
        // [{score: 1, isLive: true},{score: 1, isLive: true},{score: 1, isLive: true}]
        setDataResponse({ ...dataResponse, liveness: res })
        setLoading(false)
        setActiveStep(2)
      })

    } catch (error) {
      console.log('error', error)
    }
  }


  // Call Api check face
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
        // console.log('verify', res);
        setLoading(false)
        setDataResponse({ ...dataResponse, verify: res })
        setActiveStep(3)
        setData({ ...data, image })
      })
    });
  }


  console.log('lan', language);
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

        {language === null && <View style={{ position: 'absolute', top: 0, bottom: 0, backgroundColor: 'black', right: 0, left: 0, zIndex: 999, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setLanguage('en')} style={{ backgroundColor: 'white', width: 150 * scale, height: 70 * scale, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 * scale }}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage('vi')} style={{ marginTop: 20 * scale, backgroundColor: 'white', width: 150 * scale, height: 70 * scale, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 * scale }}>Tiếng việt</Text>
          </TouchableOpacity>
        </View>}


        <View style={{ flex: 1, marginHorizontal: 12 * scale }}>
          <ProgressSteps activeStep={activeStep}>
            <ProgressStep
              onNext={onNextStep1}
              //  errors={state.errors}
              label={convertLanguage(language, 'titleStep1')}
              //  scrollViewProps={defaultScrollViewProps}
              nextBtnText={convertLanguage(language, 'continue')}>
              <Step1 data={data} setData={setData} language={language}
                onOpenModalize={onOpenModalize} upload={upload} onCloseModalize={onCloseModalize} setUpload={() => setUpload({ camera: 0, file: 0 })} />
            </ProgressStep>
            <ProgressStep
              removeBtnRow={true}
              label={convertLanguage(language, 'titleStep2')}
              scrollViewProps={defaultScrollViewProps}

            >
              <Step2 language={language} setLoading={setLoading} onNextStep2={onNextStep2} setActiveStep={setActiveStep} />

            </ProgressStep>
            <ProgressStep
              removeBtnRow={true}
              label={convertLanguage(language, 'titleStep3')}
              scrollViewProps={defaultScrollViewProps}

            >
              <Step3 language={language} onNextStep3={onNextStep3} setLoading={setLoading} />
            </ProgressStep>
            <ProgressStep
              removeBtnRow={true}
              label={convertLanguage(language, 'titleStep4')}
            // scrollViewProps={defaultScrollViewProps}

            >
              <Step4 language={language} dataResponse={dataResponse} data={data} setActiveStep={setActiveStep} clearData={clearData} />
            </ProgressStep>
          </ProgressSteps>
        </View>
      </SafeAreaView >


      {/*  */}
      <Modalize Modalize
        overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }
        }
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
            <Text style={{ fontSize: 16 * scale, fontWeight: 'bold' }}>{convertLanguage(language, 'camera')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeUpload('file')}
            style={{ flexDirection: 'row', paddingHorizontal: 20 * scale, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('./src/assets/upload_file.png')} style={{ width: 24 * scale, height: 24 * scale, marginRight: 3 * scale }} />
            <Text style={{ fontSize: 16 * scale, fontWeight: 'bold' }}>{convertLanguage(language, 'library')}</Text>
          </TouchableOpacity>
        </View>
      </Modalize >


    </>
  )
}
