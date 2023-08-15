"use client"
import Image from 'next/image'
import styles from './page.module.css'
import { GameInitContextProvider } from '@/context/GameInit'
import { GuessStatsContextProvider } from '@/context/GuessStats'
import { App } from './App'

export default function Home() {
  return (
    <GameInitContextProvider>
    <GuessStatsContextProvider>
      <App />
    </GuessStatsContextProvider>
  </GameInitContextProvider>

  )
}
