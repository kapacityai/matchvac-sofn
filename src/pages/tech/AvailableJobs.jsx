import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AvailableJobs() {
  const navigate = useNavigate()

  useEffect(() => { navigate('/sofn/dashboard') }, [])

  return null
}