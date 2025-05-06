// src/App.jsx
import React from 'react'
import { AuroraBackground } from './components/ui/aurora-background'
import AuthConnector from './components/auth-connector'

export default function App() {
  return (
    <>
    <AuroraBackground>
        <AuthConnector />
    </AuroraBackground>
    </>
  )
}
