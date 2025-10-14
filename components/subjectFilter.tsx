'use client'

import { subjects } from '@/constants'
import { removeKeysFromUrlQuery } from '@jsmastery/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { useRouter, useSearchParams } from 'next/dist/client/components/navigation'
import React, { useEffect } from 'react'

const SubjectFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('subject') || '';

    const [subject, setsubject] = React.useState(query);

    useEffect(() => {
        let newURL = "";
        if (subject=="all") {
            newURL = removeKeysFromUrlQuery({
                params: searchParams.toString(),
                key: 'subject'
            });
        } else {
            newURL = fromUrlQuery({
                params: searchParams.toString(),
                key: "subject",
                value: subject,
            });
        }

        router.push(newURL);
    }, [subject]);

  return (
    <Select onValueChange={setsubject} value={subject}>
        <SelectTrigger className=' border border-black rounded-lg px-2 py-1 h-fit input capitalize'>
            <SelectValue placeholder="Select Subject" />
        </SelectTrigger>
        <SelectContent>
            {subjects.map((subject) => (
                <SelectItem key={subject} value={subject} className='capitalize'>
                    {subject}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>

  )
}

export default SubjectFilter
function fromUrlQuery(arg0: { params: string; key: string; value: string }): string {
    throw new Error('Function not implemented.')
}

