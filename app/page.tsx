import CompanionCard from '@/components/companionCard'
import CTA from '@/components/CTA'
import CompanionList from '@/components/companionList'
import React from 'react'
import { recentSessions } from '@/constants'

const Page = () => {
  return (
    <main className="p-4">
      <h1 className='text-2xl underline'>Popular Companions</h1>

      <section className="home-section">
        <CompanionCard 
          id = "cd123"
          name = "Nera the Brain Explore"
          topic = "Nural Network of the Brain"
          subject = "Science"
          duration = {45}
          color = "#FFFFFF"

        />
        <CompanionCard 
          id = "cd124"
          name = "Countsy the number wizard"
          topic = "Derivatives and Intergral"
          subject = "Mathematics"
          duration = {30}
          color = "#FFFFFF"
        />
        <CompanionCard 
          id = "cd125"
          name = "Vebora the Vocabulary Builder"
          topic = "Language"
          subject = "English Literature"
          duration = {30}
          color = "#FFFFFF"
        />
      </section>

      <section className='home-section'>
        <CompanionList 
          title="Recently completed sessions"
          companions={recentSessions}
          className="w-2/3 max:lg:w-full"
        />
        <CTA />
      </section>

    </main>
  )
}

export default Page