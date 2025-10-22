'use client';

import React, { useState, useEffect } from 'react'
import { cn, configureAssistant } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import { useLottie } from 'lottie-react';
import soundwaves from '@/constants/soundwaves.json';
// removed unused imports

enum CallStatus {
    INACTIVE = 'inactive',
    CONNECTING = 'connecting',
    ACTIVE = 'active',
    FINISHED = 'finished',
}

const CompanionComponent = ({ companionId, name, subject, topic, userName, userImage, voice, style }: CompanionComponentProps) => {
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

        const assistant = configureAssistant(voice, style) as any;
        const variables = { subject, topic, style } as any;

        if (process.env.NODE_ENV !== 'production') {
            // Safe debug log (no secrets)
            console.log('Vapi start payload:', {
                model: assistant?.model,
                hasVoice: Boolean((assistant as any)?.voice),
                variables,
            });
        }

        const extractResponseInfo = async (err: any) => {
            try {
                const res: Response | undefined = err?.error;
                let body: any = undefined;
                if (res && typeof res.text === 'function') {
                    const txt = await res.text();
                    try { body = txt ? JSON.parse(txt) : undefined; } catch { body = txt; }
                }
                return { status: (res as any)?.status, statusText: (res as any)?.statusText, url: (res as any)?.url, type: (res as any)?.type, body };
            } catch { return {}; }
        };

        // Attempt 1: recommended object signature
        try {
            await vapi.start({ assistant, variables } as any);
            return;
        } catch (e) {
            console.error('Vapi start failed (assistant+variables):', await extractResponseInfo(e));
        }

        // Attempt 2: assistant only
        try {
            await vapi.start({ assistant } as any);
            return;
        } catch (e2) {
            console.error('Vapi start failed (assistant only):', await extractResponseInfo(e2));
        }

        // Attempt 3: assistant without voice (if present)
        try {
            const { voice: _omitVoice, ...assistantNoVoice } = assistant || {};
            await vapi.start({ assistant: assistantNoVoice } as any);
            return;
        } catch (e3) {
            console.error('Vapi start failed (assistant without voice):', await extractResponseInfo(e3));
        }

        setCallStatus(CallStatus.INACTIVE);
    }

    const handleDisconnect = async () => {
        try {
            await vapi.stop();
        } finally {
            setCallStatus(CallStatus.FINISHED);
        }
    }

    useEffect(() => {
        // Logic to handle companion interaction based on props  
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
        const onMessageReceive = (message: string) => { };
        const onSpeechStart = () => setSpeechStatus(true);
        const onSpeechEnd = () => setSpeechStatus(false);
        const onError = async (err: any) => {
            console.error('Vapi error:', err);
            try {
                if (err?.error && typeof err.error.json === 'function') {
                    const details = await err.error.json();
                    console.error('Vapi error body:', details);
                }
            } catch (_) {}
            setCallStatus(CallStatus.INACTIVE);
        };

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
                    <button
                        className={cn(
                            'rounded-lg py-2 cursor-pointer transition-colors w-full text-white',
                            callStatus === CallStatus.ACTIVE
                                ? 'bg-red-600 hover:bg-red-700'
                                : callStatus === CallStatus.CONNECTING
                                ? 'bg-yellow-600 hover:bg-yellow-700 animate-pulse'
                                : 'bg-primary hover:opacity-90'
                        )}
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                    >
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
