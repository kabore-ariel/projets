// Utilitaires pour l'export de données

export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header.toLowerCase().replace(/\s+/g, '')] || ''
      return `"${value}"`
    }).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportStudentsList = (students: any[], className: string, calculerMoyenneGenerale?: (notes: any) => string) => {
  const headers = ['Nom', 'Prénom', 'Classe', 'Date de naissance', 'Téléphone', 'Email', 'Adresse', 'Moyenne générale', 'Statut paiement']
  const data = students.map(student => ({
    nom: student.nom,
    prénom: student.prenom,
    classe: className,
    datedenaissance: student.dateNaissance,
    téléphone: student.telephone,
    email: student.email,
    adresse: student.adresse,
    moyennegénérale: calculerMoyenneGenerale ? `${calculerMoyenneGenerale(student.notes)}/20` : 'N/A',
    statutpaiement: student.paiementStatut === 'paye' ? 'Payé' : 'En attente'
  }))
  const timestamp = new Date().toISOString().split('T')[0]
  exportToCSV(data, `Liste_Eleves_${className}_${timestamp}`, headers)
}

export const exportPersonnelList = (personnel: any[]) => {
  const headers = ['Nom', 'Prénom', 'Poste', 'Matière/Spécialité', 'Téléphone', 'Email', 'Adresse', 'Statut']
  const data = personnel.map(person => ({
    nom: person.nom,
    prénom: person.prenom,
    poste: person.poste,
    matière: person.matiere,
    téléphone: person.telephone,
    email: person.email,
    adresse: person.adresse,
    statut: person.statut || 'Actif'
  }))
  const timestamp = new Date().toISOString().split('T')[0]
  exportToCSV(data, `Liste_Personnel_${timestamp}`, headers)
}

export const exportPaiementsList = (students: any[], getNomClasse: (id: number) => string) => {
  const headers = ['Nom', 'Prénom', 'Classe', 'Statut paiement', 'Date paiement', 'Mode paiement']
  const data = students.map(student => ({
    nom: student.nom,
    prénom: student.prenom,
    classe: getNomClasse(student.classeId),
    statutpaiement: student.paiementStatut === 'paye' ? 'Payé' : 'En attente',
    datepaiement: student.datePaiement || 'N/A',
    modepaiement: student.modePaiement || 'N/A'
  }))
  const timestamp = new Date().toISOString().split('T')[0]
  exportToCSV(data, `Etat_Paiements_${timestamp}`, headers)
}