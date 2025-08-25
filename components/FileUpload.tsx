"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Camera, FileImage, X } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: string) => void
  currentFile?: string
  label?: string
  accept?: string
}

export function FileUpload({ onFileSelect, currentFile, label = "Photo", accept = "image/*" }: FileUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState(currentFile || "")
  const [isCapturing, setIsCapturing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        onFileSelect(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      setIsCapturing(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error('Erreur accès caméra:', error)
      alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.')
      setIsCapturing(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      if (context) {
        context.drawImage(video, 0, 0)
        const dataURL = canvas.toDataURL('image/jpeg', 0.8)
        setPreview(dataURL)
        onFileSelect(dataURL)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCapturing(false)
  }

  const removePhoto = () => {
    setPreview("")
    onFileSelect("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        {preview && (
          <div className="relative">
            <img 
              src={preview} 
              alt="Aperçu" 
              className="w-16 h-16 object-cover rounded-lg border"
            />
            <Button
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
              onClick={removePhoto}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Fichier
          </Button>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Caméra
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Prendre une photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {!isCapturing ? (
                  <div className="text-center">
                    <Button onClick={startCamera}>
                      <Camera className="w-4 h-4 mr-2" />
                      Démarrer la caméra
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        className="w-full rounded-lg"
                        autoPlay
                        playsInline
                        muted
                      />
                    </div>
                    <div className="flex justify-center space-x-2">
                      <Button onClick={capturePhoto}>
                        <Camera className="w-4 h-4 mr-2" />
                        Capturer
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}