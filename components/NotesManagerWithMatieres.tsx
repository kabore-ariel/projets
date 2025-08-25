"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Save, X, Loader2 } from "lucide-react"

interface NotesManagerWithMatieresProps {
  student: any
  classe: any
  onNotesUpdated?: () => void
}

export function NotesManagerWithMatieres({ student, classe, onNotesUpdated }: NotesManagerWithMatieresProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalNotes, setOriginalNotes] = useState(() => {
    const initialNotes: { [key: string]: number[] } = {}
    classe.matieres?.forEach((matiere: any) => {
      const matiereKey = matiere.nom.toLowerCase().replace(/[^a-z0-9]/g, '')
      initialNotes[matiereKey] = student.notes[matiereKey] || []
    })
    return initialNotes
  })
  const [notes, setNotes] = useState(() => {
    // Initialiser les notes basées sur les matières de la classe
    const initialNotes: { [key: string]: number[] } = {}
    classe.matieres?.forEach((matiere: any) => {
      const matiereKey = matiere.nom.toLowerCase().replace(/[^a-z0-9]/g, '')
      initialNotes[matiereKey] = student.notes[matiereKey] || []
    })
    return initialNotes
  })

  const [newNote, setNewNote] = useState({
    matiere: "",
    valeur: "",
    type: "DEVOIR_SURVEILLE"
  })
  const [selectedTrimestre, setSelectedTrimestre] = useState("T1")

  const ajouterNote = () => {
    if (newNote.matiere && newNote.valeur) {
      const noteValue = Number.parseFloat(newNote.valeur)
      if (noteValue >= 0 && noteValue <= 20) {
        setNotes(prev => {
          const newNotes = {
            ...prev,
            [newNote.matiere]: [...(prev[newNote.matiere] || []), noteValue]
          }
          setHasUnsavedChanges(true)
          return newNotes
        })
        setNewNote({ matiere: "", valeur: "", type: "DEVOIR_SURVEILLE" })
      }
    }
  }

  const supprimerNote = (matiere: string, index: number) => {
    setNotes(prev => {
      const newNotes = {
        ...prev,
        [matiere]: prev[matiere].filter((_, i) => i !== index)
      }
      setHasUnsavedChanges(true)
      return newNotes
    })
  }

  const calculerMoyenne = (notesMatiere: number[]) => {
    if (!notesMatiere || notesMatiere.length === 0) return 0
    return (notesMatiere.reduce((sum, note) => sum + note, 0) / notesMatiere.length).toFixed(2)
  }

  const calculerMoyenneGeneraleAvecCoeff = () => {
    let totalPoints = 0
    let totalCoeff = 0
    
    classe.matieres?.forEach((matiere: any) => {
      const matiereKey = matiere.nom.toLowerCase().replace(/[^a-z0-9]/g, '')
      const notesMatiere = notes[matiereKey] || []
      if (notesMatiere.length > 0) {
        const moyenne = Number.parseFloat(calculerMoyenne(notesMatiere))
        totalPoints += moyenne * matiere.coefficient
        totalCoeff += matiere.coefficient
      }
    })
    
    return totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : "0.00"
  }

  const getMatiereByKey = (key: string) => {
    return classe.matieres?.find((m: any) => 
      m.nom.toLowerCase().replace(/[^a-z0-9]/g, '') === key
    )
  }

  const sauvegarderNotes = async () => {
    setIsSaving(true)
    try {
      // Préparer les données des notes pour l'API
      const notesData = []
      
      for (const [matiereKey, notesMatiere] of Object.entries(notes)) {
        const matiere = getMatiereByKey(matiereKey)
        if (matiere && notesMatiere.length > 0) {
          for (const note of notesMatiere) {
            notesData.push({
              studentId: student.id,
              matiere: matiere.nom,
              note: note,
              coefficient: matiere.coefficient,
              trimestre: selectedTrimestre
            })
          }
        }
      }

      // Supprimer les anciennes notes de l'élève pour ce trimestre
      const response = await fetch(`http://localhost:8082/api/notes/student/${student.id}?trimestre=${selectedTrimestre}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Ajouter les nouvelles notes
      for (const noteData of notesData) {
        await fetch('http://localhost:8082/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(noteData),
        })
      }

      // Mettre à jour les notes originales et réinitialiser l'indicateur de changements
      setOriginalNotes(notes)
      setHasUnsavedChanges(false)

      toast({
        title: "✅ Notes sauvegardées",
        description: `${notesData.length} notes ont été enregistrées avec succès.`,
      })

      // Callback pour rafraîchir les données parent si fourni
      if (onNotesUpdated) {
        onNotesUpdated()
      }

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder les notes. Vérifiez la connexion.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur de trimestre */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label className="font-semibold">Trimestre :</Label>
            <Select value={selectedTrimestre} onValueChange={setSelectedTrimestre}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T1">Trimestre 1</SelectItem>
                <SelectItem value="T2">Trimestre 2</SelectItem>
                <SelectItem value="T3">Trimestre 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout de note */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg">Ajouter une note - {selectedTrimestre}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Matière</Label>
              <Select value={newNote.matiere} onValueChange={(value) => setNewNote({...newNote, matiere: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir matière" />
                </SelectTrigger>
                <SelectContent>
                  {classe.matieres?.map((matiere: any) => {
                    const key = matiere.nom.toLowerCase().replace(/[^a-z0-9]/g, '')
                    return (
                      <SelectItem key={key} value={key}>
                        {matiere.nom} (Coeff. {matiere.coefficient})
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Note (/20)</Label>
              <Input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={newNote.valeur}
                onChange={(e) => setNewNote({...newNote, valeur: e.target.value})}
                placeholder="0-20"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={ajouterNote} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affichage des notes par matière */}
      <div className="space-y-4">
        {classe.matieres?.map((matiere: any) => {
          const matiereKey = matiere.nom.toLowerCase().replace(/[^a-z0-9]/g, '')
          const notesMatiere = notes[matiereKey] || []
          const moyenne = Number.parseFloat(calculerMoyenne(notesMatiere))
          
          return (
            <Card key={matiereKey}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">{matiere.nom}</CardTitle>
                    <p className="text-sm text-gray-600">Coefficient: {matiere.coefficient}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={moyenne >= 10 ? "default" : "destructive"} className="text-lg px-3 py-1">
                      {moyenne.toFixed(2)}/20
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">
                      Points: {(moyenne * matiere.coefficient).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {notesMatiere.map((note, index) => (
                    <div key={index} className="relative group">
                      <Badge 
                        variant={note >= 10 ? "default" : "destructive"}
                        className="pr-6"
                      >
                        {note}
                      </Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-4 h-4 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => supprimerNote(matiereKey, index)}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </div>
                  ))}
                  {notesMatiere.length === 0 && (
                    <span className="text-gray-500 text-sm">Aucune note</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Moyenne générale avec coefficients */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Moyenne Générale (avec coefficients)</h3>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {calculerMoyenneGeneraleAvecCoeff()}/20
            </div>
            <p className="text-sm text-green-700">
              Calculée avec les coefficients de chaque matière
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        {hasUnsavedChanges && (
          <div className="flex items-center text-amber-600">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">Modifications non sauvegardées</span>
          </div>
        )}
        <div className="flex-1"></div>
        <Button 
          onClick={sauvegarderNotes}
          disabled={isSaving || !hasUnsavedChanges}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder les notes'}
        </Button>
      </div>
    </div>
  )
}