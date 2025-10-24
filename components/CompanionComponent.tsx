'use client';

import React, { useState, useEffect, useRef } from 'react'
import { cn, configureAssistant, type AssistantWithVoice } from '@/lib/utils';
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
    const callActiveRef = useRef(false);
    const transcriptRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [micNoticeOpen, setMicNoticeOpen] = useState(false);
    const [micNoticeText, setMicNoticeText] = useState('');
    const micNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Keep the transcript scrolled to the latest message
    useEffect(() => {
        const el = transcriptRef.current;
        if (!el) return;
        try {
            const top = el.scrollHeight;
            if (typeof el.scrollTo === 'function') {
                el.scrollTo({ top, behavior: callStatus === CallStatus.ACTIVE ? 'smooth' : 'auto' });
            } else {
                el.scrollTop = top;
            }
        } catch {}
    }, [messages.length, callStatus]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        const assistant: AssistantWithVoice = configureAssistant(subject, topic, voice, style);

        if (process.env.NODE_ENV !== 'production') {
            // Safe debug log (no secrets)
            console.log('Vapi start payload:', {
                model: assistant?.model,
                hasVoice: Boolean('voice' in assistant && assistant.voice),
                subject,
                topic,
                style,
                origin: typeof window !== 'undefined' ? window.location.origin : 'server',
            });
        }

        // Ensure microphone permission before starting the call
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permErr) {
            console.error('Microphone permission denied or unavailable:', permErr);
            setCallStatus(CallStatus.INACTIVE);
            return;
        }

        const extractResponseInfo = async (err: unknown) => {
            try {
                // Common Vapi error shape: { error: Response }
                const maybeObj = err as { error?: Response } | undefined;
                const res: Response | undefined = maybeObj?.error;
                let body: unknown = undefined;
                if (res && typeof (res as Response).text === 'function') {
                    const txt = await res.text();
                    try { body = txt ? JSON.parse(txt) : undefined; } catch { body = txt; }
                }
                return {
                    status: res?.status,
                    statusText: res?.statusText,
                    url: (res as unknown as { url?: string })?.url,
                    type: (res as unknown as { type?: string })?.type,
                    body,
                };
            } catch { return {}; }
        };

        // Attempt 1: minimal assistant only (no variables)
        try {
            await vapi.start(assistant);
            return;
        } catch (e) {
            console.error('Vapi start failed (assistant only):', await extractResponseInfo(e));
        }

        // Attempt 2 removed: SDK expects assistant directly; object wrapper isn't a valid signature.

        // Attempt 3: assistant without voice (if present)
        try {
            const assistantNoVoice: AssistantWithVoice = { ...(assistant as AssistantWithVoice) };
            delete (assistantNoVoice as Record<string, unknown>).voice;
            await vapi.start(assistantNoVoice);
            return;
        } catch (e3) {
            console.error('Vapi start failed (assistant without voice):', await extractResponseInfo(e3));
        }

        setCallStatus(CallStatus.INACTIVE);
    }

    const handleDisconnect = async () => {
        // If we somehow reached here without an active call, avoid stopping to prevent underlying processor errors
        if (!callActiveRef.current) {
            setCallStatus(CallStatus.FINISHED);
            return;
        }
        // Small delay to let any audio processors (e.g., Krisp) settle before teardown
        await new Promise((r) => setTimeout(r, 50));
        try {
            await vapi.stop();
        } catch (err) {
            const msg = String((err as Error)?.message || err);
            // Ignore known Krisp unload timing error to avoid noisy console logs
            if (msg.includes('WASM_OR_WORKER_NOT_READY') || msg.toLowerCase().includes('krisp')) {
                console.warn('Ignoring Krisp unload timing error during stop:', msg);
            } else {
                console.error('Error while stopping call:', err);
            }
        } finally {
            callActiveRef.current = false;
            setCallStatus(CallStatus.FINISHED);
        }
    }

    useEffect(() => {
        // Logic to handle companion interaction based on props  
        const onCallStart = () => {
            if (process.env.NODE_ENV !== 'production') console.log('Vapi event: call-start');
            callActiveRef.current = true;
            setCallStatus(CallStatus.ACTIVE);
            try {
                // Ensure we start unmuted so the assistant can hear the user
                vapi.setMuted(false);
                setISMuted(false);
            } catch {}
        };
        const onCallEnd = (payload?: unknown) => {
            if (process.env.NODE_ENV !== 'production') console.log('Vapi event: call-end', payload);
            callActiveRef.current = false;
            setCallStatus(CallStatus.FINISHED);
        };
        const onMessageReceive = (message: unknown) => {
            const m = message as { type?: string; transcriptType?: string; role?: 'user' | 'system' | 'assistant'; transcript?: string };
            if (m?.type === 'transcript' && m.transcriptType === 'final' && typeof m.transcript === 'string') {
                const newMessage: SavedMessage = { role: m.role === 'user' ? 'user' : 'assistant', content: m.transcript };
                setMessages((prev) => [...prev, newMessage]);
            }
        };
        const onSpeechStart = () => setSpeechStatus(true);
        const onSpeechEnd = () => setSpeechStatus(false);
        const onError = async (err: unknown) => {
            console.error('Vapi error:', err);
            try {
                const maybeObj = err as { error?: Response } | undefined;
                if (maybeObj?.error && typeof maybeObj.error.json === 'function') {
                    const details = await maybeObj.error.json();
                    console.error('Vapi error body:', details);
                }
            } catch { /* noop */ }
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
        // Avoid toggling mic when there is no active call; show a friendly popup
        if (!callActiveRef.current) {
            if (micNoticeTimerRef.current) clearTimeout(micNoticeTimerRef.current);
            setMicNoticeText('Start a session to use the microphone');
            setMicNoticeOpen(true);
            micNoticeTimerRef.current = setTimeout(() => setMicNoticeOpen(false), 2000);
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Mic toggle attempted without an active call.');
            }
            return;
        }
        try {
            const current = vapi.isMuted();
            vapi.setMuted(!current);
            setISMuted(!current);
        } catch (err) {
            console.error('Toggle microphone failed:', err);
        }
    }

    return (
        <>
            <section className='flex flex-col h-[70vh]'>
                <section className='flex gap-4 max-sm:flex-col'>
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
                        <button
                            className={cn('btn-mic', !callStatus || callStatus === CallStatus.INACTIVE ? 'opacity-50 cursor-not-allowed' : '')}
                            onClick={toggleMicrophone}
                            disabled={callStatus === CallStatus.CONNECTING}
                            title={callStatus === CallStatus.INACTIVE ? 'Start a session to use the mic' : undefined}
                        >
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
                    <div ref={transcriptRef} className="transcript-message no-scrollbar">
                        {messages.map((message: SavedMessage, idx: number) => {
                            if (message.role === 'assistant') {
                                const displayName = (name.split(' ')[0] || name).replace(/[^a-zA-Z0-9]/g, '');
                                return (
                                    <div key={`${idx}-assistant-${String(message.content).slice(0, 30)}`} className="assistant-message max-sm:text-sm">
                                        <span className="font-semibold">{displayName}:</span> {message.content}
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={`${idx}-user-${String(message.content).slice(0, 30)}`} className="user-message text-primary max-sm:text-sm">
                                        <span className="font-semibold">{userName}:</span> {message.content}
                                    </div>
                                );
                            }
                        })}
                    </div>

                    <div className="transcript-fade" />
                </section>
            </section>
            {micNoticeOpen && (
                <div
                    className="fixed bottom-4 right-4 z-50 rounded-md bg-gray-900 text-white px-4 py-2 shadow-lg border border-white/10"
                    role="status"
                    aria-live="polite"
                >
                    <div className="flex items-center gap-2">
                        <img src="/icons/mic-off.svg" alt="info" width={18} height={18} />
                        <span className="text-sm">{micNoticeText}</span>
                        <button
                            className="ml-2 text-xs opacity-70 hover:opacity-100"
                            onClick={() => setMicNoticeOpen(false)}
                            aria-label="Close notification"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default CompanionComponent
