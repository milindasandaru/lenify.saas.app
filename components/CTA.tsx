import Link from 'next/dist/client/link'
import React from 'react'

const CTA = () => {
  return (
    <section className='cta-section'>
      <div className="cta-badge">Start learning your way.</div>
      <h2 className='text-3xl font-bold'>Unlock your potential with personalized learning</h2>
      <p>pick a name, subject, voice & personality - and start learning through voice conversation that feel natural and fun.</p>
      <img src="/images/cta.png" alt="cta" width={500} height={300} />
      <button className='btn-primary'>
        <img src="/icons/plus.svg" alt="plus" width={21} height={21} />
        <Link href="/Companions/new" className='flex items-center gap-2'>
          <p>Create Your Companion</p>
        </Link>
      </button>
    </section>
  )
}

export default CTA
