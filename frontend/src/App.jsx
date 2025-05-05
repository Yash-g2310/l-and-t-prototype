// src/App.jsx
import React from 'react'
import { AuroraBackground } from './components/ui/aurora-background'
// import SignupFormDemo from './components/signup-form-demo'
// import SigninFormDemo from './components/signin-form-demo'
import AuthConnector from './components/auth-connector'

export default function App() {
  return (
    <>
    <AuroraBackground>
      {/* <SignupFormDemo >

      </SignupFormDemo> */}
      {/* <SigninFormDemo>
        </SigninFormDemo> */}
        <AuthConnector />
    </AuroraBackground>
    </>
  )
}
