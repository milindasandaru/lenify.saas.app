import React from 'react'
import { cn } from '@/lib/utils';

const CompanionComponent = ({ companionId, subject, topic, userName, userImage, voice }: CompanionComponentProps) => {
  return (
    <section className='flex flex-col h-[70vh]'>
        <section className='flex gap-8 max:sm:flex-col'>
            <div className="companion-section">
                <div className="companion-avatar">
                    <div className={cn('absolute transition-opacity duration-1000')}></div>
                </div>
            </div>
        </section>
    </section>
  )
}

export default CompanionComponent
