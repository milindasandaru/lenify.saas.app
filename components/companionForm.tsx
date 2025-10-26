"use client"

import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormMessage,
    FormField,
    FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { subjects } from '@/constants'
import { Textarea } from './ui/textarea'
import { createCompanion } from '@/lib/actions/companion.action'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    name: z.string().min(1, { message: 'Companion is required.' }),
    subject: z.string().min(1, { message: 'Subject is required.' }),
    topic: z.string().min(1, { message: 'Topic is required.' }),
    voice: z.string().min(1, { message: 'Voice is required.' }),
    style: z.string().min(1, { message: 'Style is required.' }),
    duration: z.number().min(1, { message: 'Duration is required.' }),
})

const CompanionForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subject: '',
            topic: '',
            voice: '',
            style: '',
            duration: 15,
        },
    })

    // Keep a local text state to avoid leading zeros like "010"
    const [durationText, setDurationText] = React.useState("15");

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const companion = await createCompanion(values);

        if (companion) {
            router.push(`/companions/${companion.id}`);
        } else {
            console.log("Error creating companion")
            router.push('/');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter the companion name' {...field} className='input' />
                            </FormControl>
                            <FormMessage />
                        </>
                    )}
                />
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <SelectTrigger className="input capitalize">
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject} value={subject} className='capitalize'>
                                                {subject}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </>
                    )}
                />
                <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <>
                            <FormLabel>What should companion help with?</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Ex. Derivatives and Integrals' {...field} className='input' />
                            </FormControl>
                            <FormMessage />
                        </>
                    )}
                />
                <FormField
                    control={form.control}
                    name="voice"
                    render={({ field }) => (
                        <>
                            <FormLabel>Voice</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <SelectTrigger className="input">
                                        <SelectValue placeholder="Select a voice" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </>
                    )}
                />
                <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                        <>
                            <FormLabel>Style</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <SelectTrigger className="input">
                                        <SelectValue placeholder="Select a style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="formal">
                                            Formal
                                        </SelectItem>
                                        <SelectItem value="informal">
                                            Informal
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </>
                    )}
                />
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <>
                            <FormLabel>Estimated session duration in minutes</FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    inputMode='numeric'
                                    pattern='[0-9]*'
                                    placeholder='15'
                                    value={durationText}
                                    onChange={e => {
                                        const raw = e.target.value.replace(/[^0-9]/g, "");
                                        // strip leading zeros while allowing empty
                                        const normalized = raw.replace(/^0+(?=\d)/, "");
                                        setDurationText(normalized);
                                        if (normalized === "") return; // let user clear
                                        const num = Number(normalized);
                                        field.onChange(num);
                                    }}
                                    onBlur={() => {
                                        if (durationText === "") {
                                            setDurationText(String(field.value || 1));
                                            field.onChange(field.value || 1);
                                        }
                                    }}
                                    className='input'
                                />
                            </FormControl>
                            <FormMessage />
                        </>
                    )}
                />
                <Button type='submit' className='w-full cursor-pointer'>Build Your Companion</Button>
            </form>
        </Form>
    )
}

export default CompanionForm
