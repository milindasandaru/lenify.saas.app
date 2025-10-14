'use client'

import { subjects } from '@/constants'
// Remove subject key from query string
function removeSubjectFromQuery(params: string, key: string): string {
    const url = new URLSearchParams(params);
    url.delete(key);
    return `?${url.toString()}`;
}
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const SubjectFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // derive initial value from URL (default to 'all' when missing)
    const initial = searchParams.get('subject') || 'all';
    const [subject, setsubject] = React.useState(initial);

    // keep state in sync when user navigates back/forward or URL changes externally
    useEffect(() => {
        const current = searchParams.get('subject') || 'all';
        setsubject((prev) => (prev === current ? prev : current));
    }, [searchParams]);

    // update URL whenever subject changes from the UI
    useEffect(() => {
        let newURL = '';
        if (subject === 'all' || subject === '') {
            newURL = removeSubjectFromQuery(searchParams.toString(), 'subject');
        } else {
            newURL = fromUrlQuery({
                params: searchParams.toString(),
                key: 'subject',
                value: subject,
            });
        }
        router.push(newURL);
    }, [subject]);

    return (
        <Select onValueChange={setsubject} value={subject}>
            <SelectTrigger className="w-44">
                <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent className="z-50">
                <SelectItem key="all" value="all">
                    All Subjects
                </SelectItem>
                {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                        {subject}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default SubjectFilter
function fromUrlQuery({ params, key, value }: { params: string; key: string; value: string }): string {
    const url = new URLSearchParams(params);
    url.set(key, value);
    return `?${url.toString()}`;
}

