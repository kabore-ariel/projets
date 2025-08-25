package com.edumanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "eleves")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Eleve extends BaseEntity {
    
    @NotBlank(message = "Le nom est obligatoire")
    @Column(name = "nom", nullable = false)
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    @Column(name = "prenom", nullable = false)
    private String prenom;
    
    @Past(message = "La date de naissance doit être dans le passé")
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;
    
    @Column(name = "adresse")
    private String adresse;
    
    @Column(name = "telephone")
    private String telephone;
    
    @Email(message = "Format d'email invalide")
    @Column(name = "email")
    private String email;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    @Builder.Default
    private StatutEleve statut = StatutEleve.ACTIF;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classe_id")
    private Classe classe;
    
    @OneToMany(mappedBy = "eleve", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Note> notes = new ArrayList<>();
    
    @OneToMany(mappedBy = "eleve", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Paiement> paiements = new ArrayList<>();
    
    // Méthodes utilitaires
    public String getNomComplet() {
        return prenom + " " + nom;
    }
    
    public int getAge() {
        if (dateNaissance == null) return 0;
        return LocalDate.now().getYear() - dateNaissance.getYear();
    }
    
    public void addNote(Note note) {
        if (notes == null) {
            notes = new ArrayList<>();
        }
        notes.add(note);
        note.setEleve(this);
    }
    
    public void addPaiement(Paiement paiement) {
        if (paiements == null) {
            paiements = new ArrayList<>();
        }
        paiements.add(paiement);
        paiement.setEleve(this);
    }
    
    public enum StatutEleve {
        ACTIF, SUSPENDU, DIPLOME, ABANDONNE
    }
}