"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { checkBackendConnection } from "@/lib/api"
import { Wifi, WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true)
      const connected = await checkBackendConnection()
      setIsConnected(connected)
      setIsChecking(false)
    }

    // Vérifier la connexion au démarrage
    checkConnection()

    // Vérifier périodiquement la connexion
    const interval = setInterval(checkConnection, 30000) // Toutes les 30 secondes

    return () => clearInterval(interval)
  }, [])

  if (isChecking) {
    return (
      <Badge variant="outline" className="animate-pulse">
        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
        Vérification...
      </Badge>
    )
  }

  return (
    <Badge variant={isConnected ? "default" : "destructive"}>
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3 mr-1" />
          Connecté
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 mr-1" />
          Déconnecté
        </>
      )}
    </Badge>
  )
}