'use client';

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import { useLottie } from 'lottie-react';
import soundwaves from '@/constants/soundwaves.json';
import { set } from 'zod';
import { connect } from 'http2';
import { Variable } from 'lucide-react';

enum CallStatus {
    INACTIVE = 'inactive',
    CONNECTING = 'connecting',
    ACTIVE = 'active',
    FINISHED = 'finished',
}

const CompanionComponent = ({ companionId, name, subject, topic, userName, userImage, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [speechStatus, setSpeechStatus] = useState(false);
    const [isMuted, setISMuted] = useState(false);

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

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        const assistantOverrides = {
            Variable: {
                subject, topic
            },
            clientMessages: ['transcript'],
            serverMessage: [],
        }

        // vapi.start()
    }

    const handleDisconnect = async () => {

    }

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

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setISMuted(!isMuted);   
    }

    return (
        <section className='flex flex-col h-[70vh]'>
            <section className='flex gap-8 max-sm:flex-col'>
                <div className="companion-section">
                    <div className="companion-avatar">
                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0', callStatus === CallStatus.CONNECTING ? 'opacity-100 animate-pulse' : '')}>
                            <img src={`/icons/${subject}.svg`} alt={subject} width={70} height={70} className='max-sm:w-fit' />
                        </div>
                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                            {View}
                        </div>
                    </div>
                    <p className='font-semibold text-2xl'>{name}</p>
                </div>

                <div className="user-section">
                    <div className="user-avatar">
                        <img src={userImage} alt={userName} width={120} height={120} />
                        <p className='font-semibold text-lg'>
                            {userName}
                        </p>
                    </div>
                    <button className='btn-mic' onClick={toggleMicrophone}>
                        <img src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"} alt="mic" width={24} height={24} />
                        <p className='max-sm:hidden'>{isMuted ? "Turn on microphone" : "Turn off microphone"}</p>
                    </button>
                    <button className={cn('rounded-lg py-2 cursor-pointer transition-colors w-full text-white', callStatus === CallStatus.ACTIVE ? 'bg-red-600 hover:bg-red-700' : callStatus === CallStatus.CONNECTING ? 'bg-yellow-600 hover:bg-yellow-700 animate-pulse' : '')} onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}>
                        {callStatus === CallStatus.ACTIVE ? 'End Session'
                         : callStatus === CallStatus.CONNECTING ? 'Connecting...' 
                         : 'Start Session'
                         }
                    </button>
                </div>
            </section>

            <section className='transcript'>
                <div className="transcript-message no-scrollbar">
                    Messages
                </div>

                <div className="transcript-fade" />
            </section>
        </section>
    )
}

export default CompanionComponent
