"use client"

import React from 'react'
import Link from 'next/link';

function page() {
  return (
    <div>
      <h2>page</h2>
      <Link href="/sign-in"><button>Sign in</button></Link>
    </div>
  )
}

export default page