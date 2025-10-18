'use client';

import React, { useState } from 'react'
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';

enum CallStatus {
  INACTIVE = 'inactive',
  CONNECTING = 'connecting',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

const CompanionComponent = ({ companionId, subject, topic, userName, userImage, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [speechStatus, setSpeechStatus] = useState(false);

    useState(() => {
      // Logic to handle companion interaction based on props  
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessageReceive = (message: string) => {}

        const onSpeechStart = () => setSpeechStatus(true);
        const onSpeechEnd = () => setSpeechStatus(false);

        const onError = (error: Error) => console.log('Error: ', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message-receive', onMessageReceive);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

    }, [companionId, subject, topic, userName, userImage, voice]);

  return (
    <section className='flex flex-col h-[70vh]'>
        <section className='flex gap-8 max:sm:flex-col'>
            <div className="companion-section">
                <div className="companion-avatar">
                    <div className={cn('absolute transition-opacity duration-1000')}>

                    </div>
                </div>
            </div>
        </section>
    </section>
  )
}

export default CompanionComponent
