import { useRef, useState, useEffect, useMemo } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import {
    getPathProps,
    getStartAt,
    getGradientId,
    getWrapperStyle,
} from '@countdown-circle-timer/shared'
import { getStroke } from '../utils/getStroke'

export const useCountdown = ({
    isPlaying,
    duration,
    size,
    strokeWidth,
    colors,
    initialRemainingTime,
    onComplete,
    gradientUniqueKey,
    rotation,
}) => {
    const elapsedTime = useRef(0)
    const [isInFinishedState, setIsInFinishedState] = useState(false)
    // time related props can NOT be changed once the component is mounted because animation relays on elapsed time since the timer is running
    // to change them pass a new value to the "key" prop of the component, which will reinitialize/restart the timer and use the new props
    const { durationMilliseconds, startAt } = useRef({
        durationMilliseconds: duration * 1000,
        startAt: getStartAt(initialRemainingTime, duration) * 1000, // in milliseconds
    }).current
    const repeatTimeoutRef = useRef(null)
    const isMountedRef = useRef(false)
    const animatedElapsedTime = useRef(new Animated.Value(0)).current
    const totalElapsedTime = useRef((startAt / 1000) * -1) // in seconds
    const { path, pathLength } = getPathProps(size, strokeWidth, rotation)
    const gradientId = useMemo(() => getGradientId(gradientUniqueKey), [
        gradientUniqueKey,
    ])
    const styles = StyleSheet.create({ wrapper: getWrapperStyle(size) })
    const animatedStroke = getStroke({
        colors,
        animatedElapsedTime,
        durationMilliseconds,
    })
    const strokeDashoffset = animatedElapsedTime.interpolate({
        inputRange: [0, durationMilliseconds],
        outputRange: [0, pathLength],
    })

    useEffect(() => {
        // set isMounted prop to true when the component is mounted
        isMountedRef.current = true

        // set initial remaining time if it is provided
        if (startAt) {
            elapsedTime.current = startAt
            animatedElapsedTime.setValue(startAt)
        }

        // keep track of the elapsed time
        animatedElapsedTime.addListener(({ value }) => {
            elapsedTime.current = value
        })

        // final cleanup
        return () => {
            isMountedRef.current = false
            animatedElapsedTime.stopAnimation()
            animatedElapsedTime.removeAllListeners()
            clearTimeout(repeatTimeoutRef.current)
        }
    }, [animatedElapsedTime, startAt])

    // toggle playing effect
    useEffect(() => {
        const animateTime = () => {
            Animated.timing(animatedElapsedTime, {
                toValue: durationMilliseconds,
                easing: Easing.linear,
                duration: durationMilliseconds - elapsedTime.current,
                useNativeDriver: false,
            }).start(({ finished }) => {
                const isDurationReached = elapsedTime.current === durationMilliseconds

                // finished - React Native state, it is set to true even when paused
                // isInFinishedState - keeps track if animation is currently in finished state and prevents running onComplete callback again if in finished state
                // isDurationReached - tells us that we can fire the onComplete callback
                if (finished && !isInFinishedState && isDurationReached) {
                    setIsInFinishedState(true)

                    if (typeof onComplete === 'function') {
                        totalElapsedTime.current += durationMilliseconds / 1000

                        const [shouldRepeat = false, delay = 0] =
                            onComplete(totalElapsedTime.current) || []

                        if (shouldRepeat && isMountedRef.current) {
                            repeatTimeoutRef.current = setTimeout(() => {
                                // reset animation and start over
                                elapsedTime.current = 0
                                animatedElapsedTime.resetAnimation()
                                setIsInFinishedState(false)
                                animateTime()
                            }, delay)
                        }
                    }
                }
            })
        }

        if (isPlaying) {
            animateTime()

            return () => {
                animatedElapsedTime.stopAnimation()
            }
        }
    }, [
        isPlaying,
        animatedElapsedTime,
        durationMilliseconds,
        onComplete,
        isInFinishedState,
    ])

    return {
        path,
        pathLength,
        styles,
        gradientId,
        animatedElapsedTime,
        animatedStroke,
        strokeDashoffset,
        durationMilliseconds,
        isProgressPathVisible: !isInFinishedState,
    }
}