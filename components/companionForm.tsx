"use client"

import React from 'react'
import { minLength, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Companion is required.'}),
  subject: z.string().min(1, { message: 'Subject is required.'}),
  topic: z.string().min(1, { message: 'Topic is required.'}),
  duration: z.number().min(1, { message: 'Duration is required.'}),
  voice: z.string().optional(),
  style: z.string().optional(),
})

const CompanionForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subject: '',
            topic: '',
            duration: 15,
            voice: '',
            style: '',
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }
}

const companionForm = () => {
  return (
    <div>
      CompanionForm
    </div>
  )
}

export default companionForm
