"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  GraduationCap,
  Plus,
  Edit,
  Download,
  Search,
  School,
  BookOpen,
  CreditCard,
  Home,
  Upload,
  CheckCircle,
  XCircle,
  Eye,
  X
} from "lucide-react"
import { Notification, useNotification } from "@/components/notification"
import { FileUpload } from "@/components/FileUpload"
import { BulletinGenerator } from "@/components/BulletinGenerator"
import { NotesManagerWithMatieres } from "@/components/NotesManagerWithMatieres"
import { classeService, eleveService, personnelService, noteService, paiementService, matiereService, checkBackendConnection } from "@/lib/api"
import { exportStudentsList, exportPersonnelList, exportPaiementsList } from "@/lib/exportUtils"
import { ConnectionStatus } from "@/components/ConnectionStatus"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { StatsCard } from "@/components/StatsCard"

interface Student {
  id: number
  nom: string
  prenom: string
  dateNaissance: string
  classeId: number
  telephone: string
  adresse: string
  photo?: string
  notes?: any
  paiementStatut: string
}

interface Classe {
  id: number
  nom: string
  niveau: string
  section: string
  effectifMax: number
  salle: string
  description: string
  matieres?: any[]
}

interface Personnel {
  id: number
  nom: string
  prenom: string
  poste: string
  telephone: string
  email: string
  salaire: number
  photo?: string
}

export default function SchoolManagement() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [personnelSearchTerm, setPersonnelSearchTerm] = useState("")
  const [paiementSearchTerm, setPaiementSearchTerm] = useState("")
  const [bulletinSearchTerm, setBulletinSearchTerm] = useState("")
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  const [classes, setClasses] = useState<Classe[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [personnel, setPersonnel] = useState<Personnel[]>([])

  const [newClasse, setNewClasse] = useState({
    nom: "",
    niveau: "",
    section: "",
    effectifMax: 30,
    salle: "",
    description: ""
  })

  const [matieres, setMatieres] = useState<{nom: string, coefficient: number}[]>([])
  const [newMatiere, setNewMatiere] = useState({ nom: "", coefficient: 1 })
  const [notes, setNotes] = useState<any[]>([])
  const [selectedClasseForNotes, setSelectedClasseForNotes] = useState<Classe | null>(null)
  const [selectedTrimestre, setSelectedTrimestre] = useState("Trimestre 1")
  const [classeMatieresForNotes, setClasseMatieresForNotes] = useState<any[]>([])
  const [notesTableData, setNotesTableData] = useState<{[key: string]: {[key: string]: string}}>({})
  const [editingMatiere, setEditingMatiere] = useState<number | null>(null)
  const [editMatiereData, setEditMatiereData] = useState({ nom: "", coefficient: 1 })

  const [newStudent, setNewStudent] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    classeId: "",
    telephone: "",
    adresse: "",
    photo: ""
  })

  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null)

  const [newPersonnel, setNewPersonnel] = useState({
    nom: "",
    prenom: "",
    poste: "",
    telephone: "",
    email: "",
    salaire: 0,
    photo: ""
  })

  const { notification, showNotification, hideNotification } = useNotification()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const isBackendAvailable = await checkBackendConnection()
      if (!isBackendAvailable) {
        throw new Error('Backend non disponible')
      }
      
      const results = await Promise.allSettled([
        classeService.getAll(),
        eleveService.getAll(),
        personnelService.getAll(),
        noteService.getAll()
      ])
      
      if (results[0].status === 'fulfilled') {
        setClasses(results[0].value || [])
      }
      
      if (results[1].status === 'fulfilled') {
        setStudents(results[1].value || [])
      }
      
      if (results[2].status === 'fulfilled') {
        setPersonnel(results[2].value || [])
      }
      
      if (results[3].status === 'fulfilled') {
        setNotes(results[3].value || [])
      }
      
      showNotification('success', 'Données chargées', 'Connexion établie avec succès')
      
    } catch (error: any) {
      console.error('Erreur:', error)
      showNotification('error', 'Erreur de connexion', 'Vérifiez que le backend est démarré sur le port 8082')
      setClasses([])
      setStudents([])
      setPersonnel([])
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: Home },
    { id: "classes", label: "Classes", icon: School },
    { id: "students", label: "Élèves", icon: GraduationCap },
    { id: "notes", label: "Notes", icon: Edit },
    { id: "bulletins", label: "Bulletins", icon: BookOpen },
    { id: "personnel", label: "Personnel", icon: Users },
    { id: "paiements", label: "Paiements", icon: CreditCard },
  ]

  const getNomClasse = (classeId: number) => {
    if (!classeId) return "Non assigné"
    const classe = classes.find((c) => c.id === parseInt(classeId.toString()))
    return classe ? classe.nom : "Non assigné"
  }

  const calculerMoyenne = (notes: any) => {
    if (!notes || !Array.isArray(notes) || notes.length === 0) return "0.00"
    const sum = notes.reduce((acc, note) => acc + Number(note), 0)
    return (sum / notes.length).toFixed(2)
  }

  const calculerMoyenneGenerale = (notes: any) => {
    if (!notes || typeof notes !== 'object') return "0.00"
    const matieres = Object.keys(notes)
    if (matieres.length === 0) return "0.00"
    
    const moyennes = matieres.map(matiere => {
      const moyenne = calculerMoyenne(notes[matiere])
      return parseFloat(moyenne)
    })
    
    const sum = moyennes.reduce((acc, moy) => acc + moy, 0)
    return (sum / moyennes.length).toFixed(2)
  }

  const ajouterClasse = async () => {
    if (!newClasse.nom || !newClasse.niveau) {
      showNotification("error", "Erreur", "Nom et niveau requis")
      return
    }

    try {
      const nouvelleClasse = await classeService.create(newClasse)
      
      // Ajouter les matières à la classe créée
      for (const matiere of matieres) {
        await matiereService.create({
          nom: matiere.nom,
          coefficient: matiere.coefficient,
          classeId: nouvelleClasse.id
        })
      }
      
      setClasses([...classes, nouvelleClasse])
      setNewClasse({
        nom: "",
        niveau: "",
        section: "",
        effectifMax: 30,
        salle: "",
        description: ""
      })
      setMatieres([])
      showNotification("success", "Classe créée", `${newClasse.nom} ajoutée avec ${matieres.length} matières`)
    } catch (error) {
      showNotification("error", "Erreur", "Impossible de créer la classe")
    }
  }

  const ajouterMatiere = () => {
    if (!newMatiere.nom) {
      showNotification("error", "Erreur", "Nom de matière requis")
      return
    }
    
    setMatieres([...matieres, newMatiere])
    setNewMatiere({ nom: "", coefficient: 1 })
  }

  const supprimerMatiere = (index: number) => {
    setMatieres(matieres.filter((_, i) => i !== index))
  }

  const handleTrimestreChange = (trimestre: string) => {
    setSelectedTrimestre(trimestre)
    if (selectedClasseForNotes) {
      initializeNotesTable(selectedClasseForNotes.id, classeMatieresForNotes)
    }
  }

  const ajouterStudent = async () => {
    if (!newStudent.nom || !newStudent.prenom || !newStudent.classeId) {
      showNotification("error", "Erreur", "Nom, prénom et classe requis")
      return
    }

    try {
      const studentData = {
        ...newStudent,
        classeId: parseInt(newStudent.classeId)
      }
      const nouvelStudent = await eleveService.create(studentData)
      setStudents([...students, nouvelStudent])
      setNewStudent({
        nom: "",
        prenom: "",
        dateNaissance: "",
        classeId: "",
        telephone: "",
        adresse: "",
        photo: ""
      })
      showNotification("success", "Élève ajouté", `${newStudent.prenom} ${newStudent.nom} ajouté avec succès`)
    } catch (error) {
      showNotification("error", "Erreur", "Impossible d'ajouter l'élève")
    }
  }

  const ajouterPersonnel = async () => {
    if (!newPersonnel.nom || !newPersonnel.prenom) {
      showNotification("error", "Erreur", "Nom et prénom requis")
      return
    }

    try {
      const nouveauPersonnel = await personnelService.create(newPersonnel)
      setPersonnel([...personnel, nouveauPersonnel])
      setNewPersonnel({
        nom: "",
        prenom: "",
        poste: "",
        telephone: "",
        email: "",
        salaire: 0,
        photo: ""
      })
      showNotification("success", "Personnel ajouté", `${newPersonnel.prenom} ${newPersonnel.nom} ajouté avec succès`)
    } catch (error) {
      showNotification("error", "Erreur", "Impossible d'ajouter le personnel")
    }
  }

  const loadMatieresForClasse = async (classeId: number) => {
    try {
      const matieres = await matiereService.getByClasse(classeId)
      setClasseMatieresForNotes(matieres || [])
      initializeNotesTable(classeId, matieres || [])
    } catch (error) {
      console.error('Erreur chargement matières:', error)
      setClasseMatieresForNotes([])
    }
  }

  const initializeNotesTable = (classeId: number, matieres: any[]) => {
    const elevesClasse = students.filter(s => s.classeId === classeId)
    const tableData: {[key: string]: {[key: string]: string}} = {}
    
    elevesClasse.forEach(student => {
      tableData[student.id] = {}
      matieres.forEach(matiere => {
        const existingNote = notes.find(n => 
          n.studentId === student.id && 
          n.matiere === matiere.nom && 
          n.trimestre === selectedTrimestre
        )
        tableData[student.id][matiere.nom] = existingNote ? existingNote.note.toString() : ""
      })
    })
    
    setNotesTableData(tableData)
  }

  const calculateStudentAverage = (studentId: number, currentNotes: {[key: string]: {[key: string]: string}}) => {
    const studentNotes = currentNotes[studentId] || {}
    let totalPoints = 0
    let totalCoeff = 0
    
    classeMatieresForNotes.forEach(matiere => {
      const note = studentNotes[matiere.nom]
      if (note && note.trim() && !isNaN(parseFloat(note))) {
        totalPoints += parseFloat(note) * matiere.coefficient
        totalCoeff += matiere.coefficient
      }
    })
    
    return totalCoeff > 0 ? (totalPoints / totalCoeff) : 0
  }

  const updateNoteInTable = async (studentId: number, matiere: string, note: string) => {
    if (note && (parseFloat(note) < 0 || parseFloat(note) > 20)) {
      showNotification("error", "Erreur", "La note doit être entre 0 et 20")
      return
    }

    // Mettre à jour le tableau local avec calcul automatique
    const newNotesData = {
      ...notesTableData,
      [studentId]: {
        ...notesTableData[studentId],
        [matiere]: note
      }
    }
    
    setNotesTableData(newNotesData)

    // Sauvegarder en base si la note n'est pas vide
    if (note.trim()) {
      try {
        // Trouver le coefficient de la matière
        const matiereObj = classeMatieresForNotes.find(m => m.nom === matiere)
        const coefficient = matiereObj ? matiereObj.coefficient : 1
        
        const noteData = {
          studentId,
          matiere,
          note: parseFloat(note),
          coefficient,
          trimestre: selectedTrimestre
        }
        
        // Vérifier si la note existe déjà
        const existingNote = notes.find(n => 
          n.studentId === studentId && 
          n.matiere === matiere && 
          n.trimestre === selectedTrimestre
        )
        
        if (existingNote) {
          await noteService.update(existingNote.id, noteData)
        } else {
          await noteService.create(noteData)
        }
        
        // Recharger les notes
        const updatedNotes = await noteService.getAll()
        setNotes(updatedNotes)
        
      } catch (error: any) {
        console.error('Erreur sauvegarde note:', error)
        showNotification("error", "Erreur", `Impossible de sauvegarder la note: ${error.message || 'Erreur inconnue'}`)
      }
    }
  }

  const StudentDetailModal = () => {
    if (!selectedStudent) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedStudent(null)}>
        <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={selectedStudent.photo} />
                <AvatarFallback>{selectedStudent.prenom[0]}{selectedStudent.nom[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{selectedStudent.prenom} {selectedStudent.nom}</h3>
                <p className="text-gray-600">{getNomClasse(selectedStudent.classeId)}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>×</Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="font-medium">Date de naissance</Label>
              <p>{selectedStudent.dateNaissance}</p>
            </div>
            <div>
              <Label className="font-medium">Téléphone</Label>
              <p>{selectedStudent.telephone}</p>
            </div>
            <div className="col-span-2">
              <Label className="font-medium">Adresse</Label>
              <p>{selectedStudent.adresse}</p>
            </div>

          </div>

          <div className="flex justify-between items-center">
            <Badge variant={selectedStudent.paiementStatut === "paye" ? "default" : "destructive"}>
              {selectedStudent.paiementStatut === "paye" ? "Paiement effectué" : "Paiement en attente"}
            </Badge>
            <div className="text-lg font-bold">
              Moyenne générale: {calculerMoyenneGenerale(selectedStudent.notes)}/20
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        const elevesPayes = students.filter(s => s.paiementStatut === "paye").length
        const tauxPaiement = students.length > 0 ? Math.round((elevesPayes / students.length) * 100) : 0
        
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
              <p className="text-gray-600">Vue d'ensemble de votre établissement scolaire</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Classes"
                value={classes.length}
                icon={<School className="h-5 w-5" />}
                subtitle="Classes actives"
                trend={{ value: 5, isPositive: true }}
              />
              <StatsCard
                title="Élèves"
                value={students.length}
                icon={<GraduationCap className="h-5 w-5" />}
                subtitle="Élèves inscrits"
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard
                title="Personnel"
                value={personnel.length}
                icon={<Users className="h-5 w-5" />}
                subtitle="Membres actifs"
                trend={{ value: 2, isPositive: true }}
              />
              <StatsCard
                title="Paiements"
                value={tauxPaiement}
                icon={<CreditCard className="h-5 w-5" />}
                subtitle={`${elevesPayes}/${students.length} payés`}
                trend={{ value: tauxPaiement > 80 ? 8 : -3, isPositive: tauxPaiement > 80 }}
              />
            </div>
          </div>
        )

      case "classes":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Classes</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Classe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle classe</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nom de la classe</Label>
                        <Input 
                          placeholder="Ex: 6ème A" 
                          value={newClasse.nom}
                          onChange={(e) => setNewClasse({...newClasse, nom: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Niveau</Label>
                        <Select value={newClasse.niveau} onValueChange={(value) => setNewClasse({...newClasse, niveau: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6ème">6ème</SelectItem>
                            <SelectItem value="5ème">5ème</SelectItem>
                            <SelectItem value="4ème">4ème</SelectItem>
                            <SelectItem value="3ème">3ème</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Section</Label>
                        <Input 
                          placeholder="A, B, C..." 
                          value={newClasse.section}
                          onChange={(e) => setNewClasse({...newClasse, section: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Effectif maximum</Label>
                        <Input 
                          type="number" 
                          placeholder="30" 
                          value={newClasse.effectifMax}
                          onChange={(e) => setNewClasse({...newClasse, effectifMax: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Salle</Label>
                      <Input 
                        placeholder="Salle 101" 
                        value={newClasse.salle}
                        onChange={(e) => setNewClasse({...newClasse, salle: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input 
                        placeholder="Description de la classe" 
                        value={newClasse.description}
                        onChange={(e) => setNewClasse({...newClasse, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="border-t pt-4">
                      <Label className="text-lg font-semibold">Matières de la classe</Label>
                      
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <Input
                          placeholder="Nom de la matière"
                          value={newMatiere.nom}
                          onChange={(e) => setNewMatiere({...newMatiere, nom: e.target.value})}
                        />
                        <Input
                          type="number"
                          placeholder="Coefficient"
                          min="1"
                          max="10"
                          value={newMatiere.coefficient}
                          onChange={(e) => setNewMatiere({...newMatiere, coefficient: parseInt(e.target.value)})}
                        />
                        <Button type="button" onClick={ajouterMatiere} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {matieres.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {matieres.map((matiere, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span>{matiere.nom} (Coeff. {matiere.coefficient})</span>
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => supprimerMatiere(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button onClick={ajouterClasse} className="w-full">
                      Créer la classe {matieres.length > 0 && `avec ${matieres.length} matière(s)`}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {!selectedClasse ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map(classe => {
                  const elevesClasse = students.filter(s => s.classeId === classe.id)
                  return (
                    <Card key={classe.id} className="cursor-pointer hover:shadow-lg transition-shadow" 
                          onClick={() => {
                            setSelectedClasse(classe)
                            loadMatieresForClasse(classe.id)
                          }}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {classe.nom}
                          <Badge>{elevesClasse.length}/{classe.effectifMax}</Badge>
                        </CardTitle>
                        <CardDescription>{classe.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p><strong>Salle:</strong> {classe.salle}</p>
                          <p><strong>Niveau:</strong> {classe.niveau}</p>
                          <p><strong>Section:</strong> {classe.section}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{selectedClasse.nom}</h3>
                  <Button variant="outline" onClick={() => setSelectedClasse(null)}>
                    ← Retour aux classes
                  </Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Matières et Coefficients</CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter Matière
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ajouter une matière</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Nom de la matière</Label>
                              <Input
                                value={newMatiere.nom}
                                onChange={(e) => setNewMatiere({...newMatiere, nom: e.target.value})}
                                placeholder="Ex: Mathématiques"
                              />
                            </div>
                            <div>
                              <Label>Coefficient</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={newMatiere.coefficient}
                                onChange={(e) => setNewMatiere({...newMatiere, coefficient: Number.parseInt(e.target.value)})}
                              />
                            </div>
                            <Button 
                              onClick={async () => {
                                if (newMatiere.nom) {
                                  try {
                                    await matiereService.create({
                                      nom: newMatiere.nom,
                                      coefficient: newMatiere.coefficient,
                                      classeId: selectedClasse.id
                                    })
                                    
                                    loadMatieresForClasse(selectedClasse.id)
                                    setNewMatiere({nom: "", coefficient: 1})
                                    showNotification("success", "Matière ajoutée", `${newMatiere.nom} ajoutée avec succès`)
                                  } catch (error) {
                                    showNotification("error", "Erreur", "Impossible d'ajouter la matière")
                                  }
                                }
                              }}
                              className="w-full"
                            >
                              Ajouter la matière
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Matière</TableHead>
                          <TableHead>Coefficient</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classeMatieresForNotes.map((matiere) => (
                          <TableRow key={matiere.id}>
                            <TableCell className="font-medium">{matiere.nom}</TableCell>
                            <TableCell>
                              <Badge variant="outline">Coeff. {matiere.coefficient}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <Edit className="h-3 w-3 mr-1" />
                                      Modifier
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Modifier la matière</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Nom de la matière</Label>
                                        <Input
                                          defaultValue={matiere.nom}
                                          onChange={(e) => setEditMatiereData({...editMatiereData, nom: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label>Coefficient</Label>
                                        <Input
                                          type="number"
                                          min="1"
                                          max="10"
                                          defaultValue={matiere.coefficient}
                                          onChange={(e) => setEditMatiereData({...editMatiereData, coefficient: Number.parseInt(e.target.value)})}
                                        />
                                      </div>
                                      <Button 
                                        onClick={async () => {
                                          try {
                                            await matiereService.update(matiere.id, {
                                              nom: editMatiereData.nom || matiere.nom,
                                              coefficient: editMatiereData.coefficient || matiere.coefficient,
                                              classeId: selectedClasse.id
                                            })
                                            
                                            loadMatieresForClasse(selectedClasse.id)
                                            showNotification("success", "Matière modifiée", "Modifications sauvegardées")
                                          } catch (error) {
                                            showNotification("error", "Erreur", "Impossible de modifier la matière")
                                          }
                                        }}
                                        className="w-full"
                                      >
                                        Sauvegarder
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={async () => {
                                    try {
                                      await matiereService.delete(matiere.id)
                                      loadMatieresForClasse(selectedClasse.id)
                                      showNotification("success", "Matière supprimée", `${matiere.nom} supprimée`)
                                    } catch (error) {
                                      showNotification("error", "Erreur", "Impossible de supprimer la matière")
                                    }
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {classeMatieresForNotes.length === 0 && (
                      <EmptyState
                        icon={<BookOpen className="w-6 h-6" />}
                        title="Aucune matière"
                        description="Ajoutez des matières pour cette classe"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )

      case "students":
        const filteredStudents = students.filter(student => {
          const searchLower = searchTerm.toLowerCase()
          return (
            student.nom.toLowerCase().includes(searchLower) ||
            student.prenom.toLowerCase().includes(searchLower) ||
            getNomClasse(student.classeId).toLowerCase().includes(searchLower)
          )
        })

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Élèves</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un élève..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouvel Élève
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouvel élève</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Nom</Label>
                          <Input 
                            placeholder="Nom de famille" 
                            value={newStudent.nom}
                            onChange={(e) => setNewStudent({...newStudent, nom: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Prénom</Label>
                          <Input 
                            placeholder="Prénom" 
                            value={newStudent.prenom}
                            onChange={(e) => setNewStudent({...newStudent, prenom: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Date de naissance</Label>
                        <Input 
                          type="date" 
                          value={newStudent.dateNaissance}
                          onChange={(e) => setNewStudent({...newStudent, dateNaissance: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Classe</Label>
                        <Select value={newStudent.classeId} onValueChange={(value) => setNewStudent({...newStudent, classeId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une classe" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map(classe => (
                              <SelectItem key={classe.id} value={classe.id.toString()}>
                                {classe.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Téléphone</Label>
                          <Input 
                            placeholder="0123456789" 
                            value={newStudent.telephone}
                            onChange={(e) => setNewStudent({...newStudent, telephone: e.target.value})}
                          />
                        </div>

                      </div>
                      <div>
                        <Label>Adresse</Label>
                        <Input 
                          placeholder="Adresse complète" 
                          value={newStudent.adresse}
                          onChange={(e) => setNewStudent({...newStudent, adresse: e.target.value})}
                        />
                      </div>
                      <Button onClick={ajouterStudent} className="w-full">
                        Ajouter l'élève
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Liste des Élèves par Classe</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut Paiement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={student.photo} />
                              <AvatarFallback>{student.prenom[0]}{student.nom[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{student.prenom} {student.nom}</span>
                              <p className="text-xs text-gray-500">{student.dateNaissance}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getNomClasse(student.classeId)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{student.telephone}</p>
                            <p className="text-gray-500">{student.adresse}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.paiementStatut === "paye" ? "default" : "destructive"}>
                            {student.paiementStatut === "paye" ? (
                              <><CheckCircle className="w-4 h-4 mr-1" /> Payé</>
                            ) : (
                              <><XCircle className="w-4 h-4 mr-1" /> En attente</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}>
                              <Eye className="w-4 h-4 mr-1" />
                              Détails
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Modifier
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Modifier l'élève</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Nom</Label>
                                      <Input 
                                        key={`nom-${student.id}`}
                                        defaultValue={student.nom}
                                        onChange={(e) => {
                                          const updatedStudent = {...student, nom: e.target.value}
                                          setEditingStudent(updatedStudent)
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label>Prénom</Label>
                                      <Input 
                                        key={`prenom-${student.id}`}
                                        defaultValue={student.prenom}
                                        onChange={(e) => {
                                          const updatedStudent = {...student, prenom: e.target.value}
                                          setEditingStudent(updatedStudent)
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Téléphone</Label>
                                    <Input 
                                      key={`tel-${student.id}`}
                                      defaultValue={student.telephone}
                                      onChange={(e) => {
                                        const updatedStudent = {...student, telephone: e.target.value}
                                        setEditingStudent(updatedStudent)
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label>Adresse</Label>
                                    <Input 
                                      key={`addr-${student.id}`}
                                      defaultValue={student.adresse}
                                      onChange={(e) => {
                                        const updatedStudent = {...student, adresse: e.target.value}
                                        setEditingStudent(updatedStudent)
                                      }}
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      onClick={async () => {
                                        const studentToUpdate = editingStudent || student
                                        try {
                                          await eleveService.update(studentToUpdate.id, studentToUpdate)
                                          setStudents(prev => prev.map(s => s.id === studentToUpdate.id ? studentToUpdate : s))
                                          showNotification("success", "Élève modifié", "Modifications sauvegardées")
                                          setEditingStudent(null)
                                        } catch (error) {
                                          showNotification("error", "Erreur", "Impossible de modifier l'élève")
                                        }
                                      }}
                                      className="flex-1"
                                    >
                                      Sauvegarder
                                    </Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={async () => {
                                        try {
                                          await eleveService.delete(student.id)
                                          setStudents(prev => prev.filter(s => s.id !== student.id))
                                          showNotification("success", "Élève supprimé", `${student.prenom} ${student.nom} supprimé`)
                                          setEditingStudent(null)
                                        } catch (error) {
                                          showNotification("error", "Erreur", "Impossible de supprimer l'élève")
                                        }
                                      }}
                                    >
                                      Supprimer
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )

      case "personnel":
        const filteredPersonnel = personnel.filter(person => {
          const searchLower = personnelSearchTerm.toLowerCase()
          return (
            person.nom.toLowerCase().includes(searchLower) ||
            person.prenom.toLowerCase().includes(searchLower) ||
            person.poste.toLowerCase().includes(searchLower)
          )
        })

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Personnel</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, poste..."
                    value={personnelSearchTerm}
                    onChange={(e) => setPersonnelSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau Personnel
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ajouter un membre du personnel</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Nom</Label>
                          <Input
                            value={newPersonnel.nom}
                            onChange={(e) => setNewPersonnel({...newPersonnel, nom: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Prénom</Label>
                          <Input
                            value={newPersonnel.prenom}
                            onChange={(e) => setNewPersonnel({...newPersonnel, prenom: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Poste</Label>
                          <Select value={newPersonnel.poste} onValueChange={(value) => setNewPersonnel({...newPersonnel, poste: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un poste" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Enseignant">Enseignant</SelectItem>
                              <SelectItem value="Direction">Direction</SelectItem>
                              <SelectItem value="Administration">Administration</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Salaire</Label>
                          <Input
                            type="number"
                            value={newPersonnel.salaire}
                            onChange={(e) => setNewPersonnel({...newPersonnel, salaire: parseFloat(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Téléphone</Label>
                          <Input
                            value={newPersonnel.telephone}
                            onChange={(e) => setNewPersonnel({...newPersonnel, telephone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={newPersonnel.email}
                            onChange={(e) => setNewPersonnel({...newPersonnel, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button onClick={ajouterPersonnel} className="w-full">
                        Ajouter le personnel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {filteredPersonnel.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPersonnel.map(person => (
                  <Card key={person.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={person.photo} />
                            <AvatarFallback>{person.prenom[0]}{person.nom[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{person.prenom} {person.nom}</h3>
                            <p className="text-sm text-gray-600">{person.poste}</p>
                            <p className="text-sm text-gray-600">{person.telephone}</p>
                            <p className="text-sm text-gray-600">{person.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setEditingPersonnel(person)}>
                                <Edit className="w-4 h-4 mr-1" />
                                Modifier
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Modifier le personnel</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Nom</Label>
                                    <Input 
                                      defaultValue={person.nom}
                                      onChange={(e) => setEditingPersonnel(prev => prev ? {...prev, nom: e.target.value} : null)}
                                    />
                                  </div>
                                  <div>
                                    <Label>Prénom</Label>
                                    <Input 
                                      defaultValue={person.prenom}
                                      onChange={(e) => setEditingPersonnel(prev => prev ? {...prev, prenom: e.target.value} : null)}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Poste</Label>
                                    <Input 
                                      defaultValue={person.poste}
                                      onChange={(e) => setEditingPersonnel(prev => prev ? {...prev, poste: e.target.value} : null)}
                                    />
                                  </div>
                                  <div>
                                    <Label>Salaire</Label>
                                    <Input 
                                      type="number"
                                      defaultValue={person.salaire}
                                      onChange={(e) => setEditingPersonnel(prev => prev ? {...prev, salaire: parseFloat(e.target.value)} : null)}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Téléphone</Label>
                                    <Input 
                                      defaultValue={person.telephone}
                                      onChange={(e) => setEditingPersonnel(prev => prev ? {...prev, telephone: e.target.value} : null)}
                                    />
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <Input 
                                      type="email"
                                      defaultValue={person.email}
                                      onChange={(e) => setEditingPersonnel(prev => prev ? {...prev, email: e.target.value} : null)}
                                    />
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    onClick={async () => {
                                      if (editingPersonnel) {
                                        try {
                                          await personnelService.update(editingPersonnel.id, editingPersonnel)
                                          setPersonnel(prev => prev.map(p => p.id === editingPersonnel.id ? editingPersonnel : p))
                                          showNotification("success", "Personnel modifié", "Modifications sauvegardées")
                                          setEditingPersonnel(null)
                                        } catch (error) {
                                          showNotification("error", "Erreur", "Impossible de modifier le personnel")
                                        }
                                      }
                                    }}
                                    className="flex-1"
                                  >
                                    Sauvegarder
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={async () => {
                                      try {
                                        await personnelService.delete(person.id)
                                        setPersonnel(prev => prev.filter(p => p.id !== person.id))
                                        showNotification("success", "Personnel supprimé", `${person.prenom} ${person.nom} supprimé`)
                                        setEditingPersonnel(null)
                                      } catch (error) {
                                        showNotification("error", "Erreur", "Impossible de supprimer le personnel")
                                      }
                                    }}
                                  >
                                    Supprimer
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Users className="w-8 h-8" />}
                title="Aucun membre du personnel"
                description={personnelSearchTerm ? "Aucun membre ne correspond à votre recherche" : "Commencez par ajouter des membres du personnel"}
                action={{
                  label: "Ajouter du personnel",
                  onClick: () => console.log("Ajouter personnel")
                }}
              />
            )}
          </div>
        )

      case "notes":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Notes</h2>
            </div>

            {!selectedClasseForNotes ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Sélectionner une classe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classes.map(classe => {
                    const elevesClasse = students.filter(s => s.classeId === classe.id)
                    return (
                      <Card key={classe.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => {
                              setSelectedClasseForNotes(classe)
                              loadMatieresForClasse(classe.id)
                            }}>
                        <CardHeader>
                          <CardTitle>{classe.nom}</CardTitle>
                          <CardDescription>{elevesClasse.length} élèves</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Gérer les notes
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Notes - {selectedClasseForNotes.nom}</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label>Trimestre:</Label>
                      <Select value={selectedTrimestre} onValueChange={handleTrimestreChange}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Trimestre 1">Trimestre 1</SelectItem>
                          <SelectItem value="Trimestre 2">Trimestre 2</SelectItem>
                          <SelectItem value="Trimestre 3">Trimestre 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" onClick={() => {
                      setSelectedClasseForNotes(null)
                      setClasseMatieresForNotes([])
                      setNotesTableData({})
                    }}>
                      ← Retour aux classes
                    </Button>
                  </div>
                </div>

                {classeMatieresForNotes.length > 0 ? (
                  <div className="space-y-4">
                    {/* Statistiques de la classe */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {students.filter(s => s.classeId === selectedClasseForNotes.id).length}
                            </div>
                            <div className="text-sm text-gray-600">Élèves</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              {(() => {
                                const elevesAvecNotes = students.filter(s => s.classeId === selectedClasseForNotes.id)
                                const moyennes = elevesAvecNotes.map(s => calculateStudentAverage(s.id, notesTableData)).filter(m => m > 0)
                                return moyennes.length > 0 ? (moyennes.reduce((sum, m) => sum + m, 0) / moyennes.length).toFixed(2) : "0.00"
                              })()}
                            </div>
                            <div className="text-sm text-gray-600">Moyenne classe</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-emerald-600">
                              {(() => {
                                const elevesAvecNotes = students.filter(s => s.classeId === selectedClasseForNotes.id)
                                const moyennes = elevesAvecNotes.map(s => calculateStudentAverage(s.id, notesTableData))
                                return moyennes.filter(m => m >= 10).length
                              })()}
                            </div>
                            <div className="text-sm text-gray-600">Au-dessus de 10</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {(() => {
                                const elevesAvecNotes = students.filter(s => s.classeId === selectedClasseForNotes.id)
                                const moyennes = elevesAvecNotes.map(s => calculateStudentAverage(s.id, notesTableData))
                                return moyennes.filter(m => m >= 16).length
                              })()}
                            </div>
                            <div className="text-sm text-gray-600">Mentions TB</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Tableau de saisie des notes - {selectedTrimestre}</CardTitle>
                            <CardDescription>
                              Saisissez les notes directement dans le tableau. Les moyennes se calculent automatiquement.
                            </CardDescription>
                          </div>
                          <Button 
                            onClick={async () => {
                              try {
                                let savedCount = 0
                                for (const [studentId, studentNotes] of Object.entries(notesTableData)) {
                                  for (const [matiere, note] of Object.entries(studentNotes)) {
                                    if (note && note.trim()) {
                                      const matiereObj = classeMatieresForNotes.find(m => m.nom === matiere)
                                      const coefficient = matiereObj ? matiereObj.coefficient : 1
                                      
                                      const noteData = {
                                        studentId: parseInt(studentId),
                                        matiere,
                                        note: parseFloat(note),
                                        coefficient,
                                        trimestre: selectedTrimestre
                                      }
                                      
                                      const existingNote = notes.find(n => 
                                        n.studentId === parseInt(studentId) && 
                                        n.matiere === matiere && 
                                        n.trimestre === selectedTrimestre
                                      )
                                      
                                      if (existingNote) {
                                        await noteService.update(existingNote.id, noteData)
                                      } else {
                                        await noteService.create(noteData)
                                      }
                                      savedCount++
                                    }
                                  }
                                }
                                
                                const updatedNotes = await noteService.getAll()
                                setNotes(updatedNotes)
                                showNotification("success", "Notes sauvegardées", `${savedCount} notes ont été sauvegardées`)
                              } catch (error) {
                                showNotification("error", "Erreur", "Impossible de sauvegarder toutes les notes")
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Sauvegarder toutes les notes
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                            <TableRow>
                              <TableHead className="w-48">Élève</TableHead>
                              {classeMatieresForNotes.map(matiere => (
                                <TableHead key={matiere.id} className="text-center min-w-24">
                                  {matiere.nom}
                                  <br />
                                  <span className="text-xs text-gray-500">(Coeff. {matiere.coefficient})</span>
                                </TableHead>
                              ))}
                              <TableHead className="text-center">Moyenne</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {students.filter(s => s.classeId === selectedClasseForNotes.id).map(student => {
                              const studentNotes = notesTableData[student.id] || {}
                              const moyenne = calculateStudentAverage(student.id, notesTableData)
                              
                              return (
                                <TableRow key={student.id}>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={student.photo} />
                                        <AvatarFallback>{student.prenom[0]}{student.nom[0]}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <span className="font-medium">{student.prenom} {student.nom}</span>
                                        <div className="text-xs text-gray-500 mt-1">
                                          Moyenne: <span className={moyenne >= 10 ? "text-green-600" : "text-red-600"}>
                                            {moyenne > 0 ? moyenne.toFixed(2) : "-"}/20
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  {classeMatieresForNotes.map(matiere => (
                                    <TableCell key={matiere.id} className="text-center">
                                      <Input
                                        type="number"
                                        min="0"
                                        max="20"
                                        step="0.25"
                                        placeholder="/20"
                                        className={`w-16 text-center transition-colors ${
                                          studentNotes[matiere.nom] && parseFloat(studentNotes[matiere.nom]) >= 10 
                                            ? "border-green-300 bg-green-50" 
                                            : studentNotes[matiere.nom] && parseFloat(studentNotes[matiere.nom]) < 10
                                            ? "border-red-300 bg-red-50"
                                            : ""
                                        }`}
                                        value={studentNotes[matiere.nom] || ""}
                                        onChange={(e) => updateNoteInTable(student.id, matiere.nom, e.target.value)}
                                      />
                                    </TableCell>
                                  ))}
                                  <TableCell className="text-center">
                                    <div className="space-y-1">
                                      <Badge variant={moyenne >= 10 ? "default" : "destructive"} className="text-sm">
                                        {moyenne > 0 ? moyenne.toFixed(2) : "-"}/20
                                      </Badge>
                                      {moyenne > 0 && (
                                        <div className="text-xs text-gray-500">
                                          {moyenne >= 16 ? "Très bien" : 
                                           moyenne >= 14 ? "Bien" :
                                           moyenne >= 12 ? "Assez bien" :
                                           moyenne >= 10 ? "Passable" : "Insuffisant"}
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <EmptyState
                    icon={<Edit className="w-8 h-8" />}
                    title="Aucune matière définie"
                    description="Ajoutez d'abord des matières à cette classe pour pouvoir saisir les notes"
                    action={{
                      label: "Gérer les classes",
                      onClick: () => setCurrentPage("classes")
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )

      case "bulletins":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Bulletins Scolaires</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un élève..."
                  value={bulletinSearchTerm}
                  onChange={(e) => setBulletinSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map(classe => {
                const elevesClasse = students.filter(s => s.classeId === classe.id)
                return (
                  <Card key={classe.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{classe.nom}</CardTitle>
                      <CardDescription>{elevesClasse.length} élèves</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {elevesClasse.slice(0, 3).map(student => (
                          <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{student.prenom} {student.nom}</span>
                            <Badge variant={student.paiementStatut === "paye" ? "default" : "destructive"} className="text-xs">
                              {student.paiementStatut === "paye" ? "Disponible" : "Paiement requis"}
                            </Badge>
                          </div>
                        ))}
                        {elevesClasse.length > 3 && (
                          <p className="text-xs text-gray-500 text-center">+{elevesClasse.length - 3} autres élèves</p>
                        )}
                      </div>
                      <Button className="w-full mt-4" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Voir tous les bulletins
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )

      case "paiements":
        const filteredPaiements = students.filter(student => {
          const searchLower = paiementSearchTerm.toLowerCase()
          return (
            student.nom.toLowerCase().includes(searchLower) ||
            student.prenom.toLowerCase().includes(searchLower) ||
            getNomClasse(student.classeId).toLowerCase().includes(searchLower)
          )
        })

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Paiements</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un élève..."
                    value={paiementSearchTerm}
                    onChange={(e) => setPaiementSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>État des Paiements</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPaiements.map(student => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={student.photo} />
                              <AvatarFallback>{student.prenom[0]}{student.nom[0]}</AvatarFallback>
                            </Avatar>
                            <span>{student.prenom} {student.nom}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getNomClasse(student.classeId)}</TableCell>
                        <TableCell>
                          <Badge variant={student.paiementStatut === "paye" ? "default" : "destructive"}>
                            {student.paiementStatut === "paye" ? (
                              <><CheckCircle className="w-4 h-4 mr-1" /> Payé</>
                            ) : (
                              <><XCircle className="w-4 h-4 mr-1" /> En attente</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {student.paiementStatut !== "paye" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Upload className="w-4 h-4 mr-1" />
                                    Marquer payé
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Confirmer le paiement</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <p>Marquer le paiement de <strong>{student.prenom} {student.nom}</strong> comme effectué ?</p>
                                    <div className="flex space-x-2">
                                      <Button 
                                        onClick={() => {
                                          setStudents(prev => prev.map(s => 
                                            s.id === student.id 
                                              ? {...s, paiementStatut: "paye"}
                                              : s
                                          ))
                                          showNotification("success", "Paiement confirmé", `Paiement de ${student.prenom} ${student.nom} marqué comme effectué`)
                                        }}
                                        className="flex-1"
                                      >
                                        Confirmer
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Détails
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return <div>Page non trouvée</div>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <LoadingSpinner size="lg" text="Chargement des données..." />
          <p className="text-sm text-gray-500 mt-4">Connexion au backend sur le port 8082</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {/* Navigation latérale */}
      <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-blue-100 fixed h-full z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EduManager Pro
              </h1>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Backend</span>
              <ConnectionStatus />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 ml-64">
        <div className="p-6">
          {renderPage()}
        </div>
      </div>
      
      {/* Modal détail étudiant */}
      <StudentDetailModal />
      
      {/* Logo A animé */}
      <div className="logo-a" title="EduManager Pro - Powered by A">
        A
      </div>
    </div>
  )
}