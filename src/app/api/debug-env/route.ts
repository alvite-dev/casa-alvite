import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return NextResponse.json({
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlStart: supabaseUrl?.substring(0, 30) + '...',
    keyStart: supabaseKey?.substring(0, 30) + '...',
    host: process.env.VERCEL_URL || 'localhost',
    nodeEnv: process.env.NODE_ENV
  })
}