import React from 'react'
import bookmark from '../public/icons/bookmark.svg'
import Link from 'next/dist/client/link';

interface CompanionCardProps {
    id: string;
    name: string;
    topic: string;
    subject: string;
    duration: number;
    color: string;
}

const CompanionCard = ({ id, name, topic, subject, duration, color }:
    CompanionCardProps) => {
    return (
        <article className='companion-card' style={{ backgroundColor: color }}>
            <div className="flex justify-between items-center">
                <div className="subject-badge">{subject}</div>
                <button className="companion-bookmark">
                    <img src="/icons/bookmark.svg" alt="bookmark" width={9} height={15} />
                </button>
            </div>

            <h2 className='text-2xl font-bold'>{name}</h2>
            <p className='text-sm'>{topic}</p>
            <div className='flex items-center gap-2'>
                <img src="/icons/clock.svg" alt="clock" width={12.5} height={12.5} />
                <p className='text-sm'>{duration} minutes</p>
            </div>

            <Link href={`/companions/${id}`} className="companion-link w-full">
                <button className='launch-lesson-btn btn-primary w-full justify-center'>
                    Launch Lesson
                </button>
            </Link>
        </article>
    )
}

export default CompanionCard
