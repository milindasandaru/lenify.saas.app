import React from 'react'
import { usePathname, useSearchParams } from 'next/dist/client/components/navigation';
import { useRouter } from 'next/router';

const searchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

  return (
    <div>
      
    </div>
  )
}

export default searchInput
