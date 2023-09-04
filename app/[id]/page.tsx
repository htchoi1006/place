import React from 'react'
import Link from 'next/link'

const Page = ({ params }: { params: { id: string } }) => {
  return (<>
    <h1 >ID: {params.id}</h1>
    <Link href="/">Home</Link>
  </>

  )
}

export default Page