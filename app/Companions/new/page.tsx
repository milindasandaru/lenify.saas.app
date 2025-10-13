import CompanionForm from '@/components/companionForm'
import SearchInput from '@/components/searchInput'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const NewCompanion = async () => { 
  const { userId } = await auth();
  if(!userId) {
    redirect('/sign-in?redirect_url=/companions/new');
  }
  return (
    <main className='min-lg:w-1/3 min-md:w-2/3 items-center justify-center'>
      <article>
        <h1>Companion Builder</h1>
        <SearchInput />
        <div className="p-4"><CompanionForm/></div>
      </article>
    </main>
  )
}

export default NewCompanion
