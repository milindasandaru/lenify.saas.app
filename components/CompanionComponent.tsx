'use client';

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import { useLottie } from 'lottie-react';
import soundwaves from '@/constants/soundwaves.json';

enum CallStatus {
    INACTIVE = 'inactive',
    CONNECTING = 'connecting',
    ACTIVE = 'active',
    FINISHED = 'finished',
}

const CompanionComponent = ({ companionId, subject, topic, userName, userImage, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [speechStatus, setSpeechStatus] = useState(false);

    // const lottieRef = React.useRef<LottieComponentProps>(null);

    // useEffect(() => {
    //     if (lottieRef.current) {
    //         if (speechStatus) {
    //             lottieRef.current.play();
    //         } else {
    //             lottieRef.current.stop();
    //         }
    //     }
    // }, [speechStatus, lottieRef]);

    const options = {
        animationData: soundwaves,
        loop: true,
        autoplay: speechStatus,
    };

    const { View, play, stop } = useLottie(options);

    useEffect(() => {
        if (speechStatus) {
            play();
        } else {
            stop();
        }
    }, [speechStatus, play, stop]);

    useEffect(() => {
        // Logic to handle companion interaction based on props  
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
        const onMessageReceive = (message: string) => { };
        const onSpeechStart = () => setSpeechStatus(true);
        const onSpeechEnd = () => setSpeechStatus(false);
        const onError = (error: Error) => console.log('Error: ', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessageReceive);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessageReceive);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        };
    }, [companionId, subject, topic, userName, userImage, voice]);

    return (
        <section className='flex flex-col h-[70vh]'>
            <section className='flex gap-8 max:sm:flex-col'>
                <div className="companion-section">
                    <div className="companion-avatar">
                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0', callStatus === CallStatus.CONNECTING ? 'opacity-100 animate-pulse' : '')}>
                            <img src={`/icons/${subject}.svg`} alt={subject} width={70} height={70} className='max:sm:w-fit' />
                        </div>
                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                            {View}
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default CompanionComponent
