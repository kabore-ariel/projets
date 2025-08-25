"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Award } from "lucide-react"

interface Student {
  id: number
  nom: string
  prenom: string
  classeId: number
  dateNaissance: string
  notes: {
    [key: string]: number[]
  }
  paiementStatut: string
}

interface BulletinGeneratorProps {
  student: Student
  nomClasse: string
  onDownload: () => void
}

export function BulletinGenerator({ student, nomClasse, onDownload }: BulletinGeneratorProps) {
  const calculerMoyenne = (notes: number[]) => {
    if (!notes || notes.length === 0) return 0
    return (notes.reduce((sum, note) => sum + note, 0) / notes.length).toFixed(2)
  }

  const calculerMoyenneGenerale = (notes: { [key: string]: number[] }) => {
    const matieres = Object.keys(notes)
    const moyennes = matieres.map((matiere) => Number.parseFloat(calculerMoyenne(notes[matiere])))
    return (moyennes.reduce((sum, moy) => sum + moy, 0) / moyennes.length).toFixed(2)
  }

  const getAppreciation = (moyenne: number) => {
    if (moyenne >= 16) return "Excellent"
    if (moyenne >= 14) return "Très bien"
    if (moyenne >= 12) return "Bien"
    if (moyenne >= 10) return "Assez bien"
    return "Insuffisant"
  }

  const downloadBulletin = () => {
    // Créer le contenu HTML du bulletin
    const bulletinHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Bulletin - ${student.prenom} ${student.nom}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
          .student-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .notes-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .notes-table th, .notes-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .notes-table th { background-color: #f8f9fa; }
          .moyenne-generale { text-align: center; font-size: 24px; font-weight: bold; color: #3b82f6; margin: 20px 0; }
          .appreciation { background-color: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 BULLETIN SCOLAIRE</h1>
          <p>EduManager Pro - Année scolaire 2024-2025</p>
        </div>
        
        <div class="student-info">
          <div>
            <h2>${student.prenom} ${student.nom}</h2>
            <p><strong>Classe:</strong> ${nomClasse}</p>
            <p><strong>Date de naissance:</strong> ${student.dateNaissance}</p>
          </div>
          <div class="moyenne-generale">
            Moyenne Générale<br>
            ${calculerMoyenneGenerale(student.notes)}/20
          </div>
        </div>

        <table class="notes-table">
          <thead>
            <tr>
              <th>Matière</th>
              <th>Notes</th>
              <th>Moyenne</th>
              <th>Appréciation</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(student.notes).map(([matiere, notes]) => {
              const moyenne = Number.parseFloat(calculerMoyenne(notes))
              return `
                <tr>
                  <td style="text-transform: capitalize; font-weight: bold;">${matiere}</td>
                  <td>${notes.join(', ')}</td>
                  <td style="font-weight: bold; color: ${moyenne >= 10 ? '#059669' : '#dc2626'};">${moyenne.toFixed(2)}</td>
                  <td style="color: ${moyenne >= 10 ? '#059669' : '#dc2626'};">${getAppreciation(moyenne)}</td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>

        <div class="appreciation">
          <h3>Appréciation générale</h3>
          <p>${getAppreciation(Number.parseFloat(calculerMoyenneGenerale(student.notes)))}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </body>
      </html>
    `

    // Créer et télécharger le fichier
    const blob = new Blob([bulletinHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Bulletin_${student.nom}_${student.prenom}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    onDownload()
  }

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <Award className="h-8 w-8" />
          <CardTitle className="text-2xl">BULLETIN SCOLAIRE</CardTitle>
        </div>
        <p className="text-blue-100">Année scolaire 2024-2025 • 1er Trimestre</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {student.prenom[0]}{student.nom[0]}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold">{student.nom} {student.prenom}</p>
                  <p className="text-blue-600 font-medium">{nomClasse}</p>
                  <p className="text-sm text-gray-600">{student.dateNaissance}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Moyenne Générale</p>
                <p className="text-3xl font-bold text-blue-600">
                  {calculerMoyenneGenerale(student.notes)}/20
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white/80">
            <div className="p-4">
              <h4 className="font-semibold mb-3">Notes par matière</h4>
              <div className="space-y-3">
                {Object.entries(student.notes).map(([matiere, notes]) => {
                  const moyenne = Number.parseFloat(calculerMoyenne(notes))
                  return (
                    <div key={matiere} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium capitalize">{matiere}</p>
                        <div className="flex space-x-1 mt-1">
                          {notes.map((note, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={moyenne >= 10 ? "default" : "destructive"}>
                          {moyenne.toFixed(2)}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">
                          {getAppreciation(moyenne)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800 mb-2">Appréciation générale</h4>
            <p className="text-gray-700">
              {getAppreciation(Number.parseFloat(calculerMoyenneGenerale(student.notes)))}
            </p>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={downloadBulletin}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={student.paiementStatut !== "paye"}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger le Bulletin
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}