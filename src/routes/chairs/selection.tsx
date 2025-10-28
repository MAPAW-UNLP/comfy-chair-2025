// routes/chairs/selection.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SessionList } from '@/components/selection/SessionList'
import { SelectionPage } from '@/components/selection/SelectionPage'

export const Route = createFileRoute('/chairs/selection')({
  component: SelectionRouter,
})

function SelectionRouter() {
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null)
  const [selectedSessionTitle, setSelectedSessionTitle] = useState<string>('')

  const handleSessionSelect = (sessionId: number, sessionTitle: string) => {
    setSelectedSessionId(sessionId)
    setSelectedSessionTitle(sessionTitle)
  }

  const handleBack = () => {
    setSelectedSessionId(null)
    setSelectedSessionTitle('')
  }

  if (selectedSessionId) {
    return (
      <SelectionPage 
        sessionId={selectedSessionId} 
        sessionTitle={selectedSessionTitle}
        onBack={handleBack}
      />
    )
  }

  return <SessionList onSessionSelect={handleSessionSelect} />
}