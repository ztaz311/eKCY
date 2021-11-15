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

  const modalizeRef = useRef(null); // call method modal cardID
  const [loading, setLoading] = useState(false) // set loading 
  const [language, setLanguage] = useState(null) // set language 

  const [data, setData] = useState({     // data image cardID base64
    card_front: '',
    card_back: '',
    image: ''
  })
  const clearData = () => {           // clear data cardID
    setData({
      card_front: '',
      card_back: '',
      image: ''
    })
  }
  const [state, setState] = useState({    // body request 
    step1: {},
    step2: {},
    step3: {}
  })
  const [dataResponse, setDataResponse] = useState({}) //  resonse api return

  const [upload, setUpload] = useState({          // flag camera or library 
    camera: 0,
    file: 0
  })

  const onOpenModalize = () => {              // method open modalize
    modalizeRef.current?.open();
  };
  const onCloseModalize = () => {              // method close modalize
    modalizeRef.current?.close();
  };

  const [activeStep, setActiveStep] = useState(0)         // value step - step1 is 0 


  const changeUpload = (name) => {                // chage camera or library
    setUpload({
      ...upload, [name]: upload[name] + 1
    })
  }


  const fetchStep1 = (body) => {
    return callApi('v2/images:annotate', 'POST', body)
    // .then(res => {
    //   if (res?.responses?.length === 2 && res?.responses[0].results[0]?.objects?.length === 6 && res?.responses[1].results[0]?.objects?.length >= 2) {
    //     console.log('step1', res)
    //     setDataResponse({
    //       ...dataResponse,
    //       card_front: res?.responses[0].results[0]?.objects,
    //       card_end: res?.responses[1].results[0]?.objects
    //     })
    //   } else {
    //     // Toast.showWithGravity(res.data.message, Toast.LONG, Toast.CENTER)
    //   }
    //   // setLoading(false)
    // })
  }

  const fetchStep2 = (body) => {
    return callApi('v2/images:liveness', 'POST', body)
    // .then(res => {
    //   console.log('step2', res)
    //   // [{score: 1, isLive: true},{score: 1, isLive: true},{score: 1, isLive: true}]
    //   if (res.responses !== undefined) {
    //     setDataResponse({ ...dataResponse, liveness: res })
    //   } else {
    //     // Toast.showWithGravity(res.data.message, Toast.LONG, Toast.CENTER)
    //   }
    // })
  }

  const fetchStep3 = (body) => {
    return callApi('v2/images:verify', 'POST', body)
    // .then(res => {
    //   console.log('step3', res)
    //   // [{isMatch: true, score: 0.6105406284332275}]
    //   if (res.responses !== undefined) {
    //     setDataResponse({ ...dataResponse, verify: res })
    //     setData({ ...data, image })
    //   } else {
    //     // setLoading(false)
    //     // Toast.showWithGravity('Có lỗi!', Toast.LONG, Toast.CENTER)
    //   }

    // }).catch(e => {
    //   Toast.showWithGravity(e, Toast.LONG, Toast.CENTER)
    // })
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


    setState({ ...state, step1: body })
    setActiveStep(1)
    // setLoading(true)
    // callApi('v2/images:annotate', 'POST', body).then(res => {
    //   console.log('res', res);
    //   if (res?.responses?.length === 2 && res?.responses[0].results[0]?.objects?.length === 6 && res?.responses[1].results[0]?.objects?.length >= 2) {
    //     setDataResponse({
    //       ...dataResponse,
    //       card_front: res?.responses[0].results[0]?.objects,
    //       card_end: res?.responses[1].results[0]?.objects
    //     })
    //     setActiveStep(1)
    //   } else {
    //     // setLoading(false)
    //     Toast.showWithGravity(res.data.message, Toast.LONG, Toast.CENTER)
    //     // Toast.showWithGravity('Có lỗi vui lòng thực hiện lại!', Toast.LONG, Toast.TOP)
    //   }
    //   setLoading(false)
    // })
  };


  // Call Api Liveness
  const onNextStep2 = async (data) => {
    try {

      const changePos = (action) => {
        switch (action) {
          case 'RIGHT_POSE_HEAD':
            return 'LEFT_POSE_HEAD'
          case 'LEFT_POSE_HEAD':
            return 'RIGHT_POSE_HEAD'
          case 'CLOSE_LEFT_EYSE':
            return 'CLOSE_RIGHT_EYSE'
          case 'CLOSE_LEFT_EYSE':
            return 'CLOSE_RIGHT_EYSE'

          default:
            return action
        }
      }

      let requests = []
      for await (const [key, value] of Object.entries(data)) {
        requests.push({
          images: data[key],
          action: changePos(key)
        })
      }

      let body = await { requests }
      setState({ ...state, step2: body })
      setActiveStep(2)
      // setLoading(false)

      // await callApi('v2/images:liveness', 'POST', body).then(res => {
      //   console.log('liveness', res.responses);
      //   // [{score: 1, isLive: true},{score: 1, isLive: true},{score: 1, isLive: true}]
      //   if (res.responses !== undefined) {
      //     setDataResponse({ ...dataResponse, liveness: res })
      //     setLoading(false)
      //     setActiveStep(2)
      //   } else {
      //     setLoading(false)
      //     Toast.showWithGravity(res.data.message, Toast.LONG, Toast.CENTER)
      //   }
      // })

    } catch (error) {
      Toast.showWithGravity('Có lỗi', Toast.LONG, Toast.CENTER)
    }
  }


  // Call Api check face
  const onNextStep3 = async (image) => {
    var body = {
      "requests": [{
        "images": [{
          "content": data.card_front
        },
        {
          "content": image
        }
        ]
      }]
    }

    setLoading(true)
    try {
      await Promise.all([fetchStep1(state.step1), fetchStep2(state.step2), fetchStep3(body)]).then(res => {
        if (res.length === 3) {
          setDataResponse({
            ...dataResponse,
            card_front: res[0]?.responses[0].results[0]?.objects,
            card_end: res[0]?.responses[1].results[0]?.objects,
            liveness: res[1],
            verify: res[2]
          })
        }
        setLoading(false)
        setActiveStep(3)
      })
    } catch (e) {
      setLoading(false)
      setActiveStep(3)
    }

    // callApi('v2/images:verify', 'POST', body).then(res => {
    //   // [{isMatch: true, score: 0.6105406284332275}]
    //   if (res.responses !== undefined) {
    //     setLoading(false)
    //     setDataResponse({ ...dataResponse, verify: res })
    //     setActiveStep(3)
    //     setData({ ...data, image })
    //   } else {
    //     setLoading(false)
    //     Toast.showWithGravity('Có lỗi!', Toast.LONG, Toast.CENTER)
    //   }

    // }).catch(e => {
    //   Toast.showWithGravity(e, Toast.LONG, Toast.CENTER)
    // })
    // });
  }

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
