import React from 'react'
import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
 } from '@/components/ui/table'
import Link from 'next/dist/client/link';

interface CompanionCardProps {
    title: string;
    companions?: Companion[];
    className?: string;
}

const companionList = ({ title, companions, className}: CompanionCardProps) => {
  return (
    <article className={`p-4 border border-black rounded-lg shadow-md ${className}`}>
        <h2 className='font-bold text-2xl'>Recent Sessions</h2>

        <Table className='mt-4'>
            <TableHeader className='bg-gray-200'>
                <TableRow className='text-left'>
                    <TableHead className='text-lg w-2/3'>Invoice</TableHead>
                    <TableHead className='text-lg'>Status</TableHead>
                    <TableHead className='text-lg'>Method</TableHead>
                    <TableHead className='text-right text-lg'>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {companions ? companions.map(({id, subject, name, topic, duration}) => (
                <TableRow>
                    <TableCell>
                        <Link href={`/companions/${id}`} className='font-medium'>
                            <div className="flex item-center gap-2">
                                <div className="size-[36px] flex items-center justify-center rounded-lg max-md:hidden">
                                    <img src={`/icons/${subject}.svg`} alt="" />
                                </div>
                            </div>
                        </Link>
                    </TableCell>
                </TableRow>
                )) : null}
            </TableBody>
        </Table>
    </article>

  )
}

export default companionList
