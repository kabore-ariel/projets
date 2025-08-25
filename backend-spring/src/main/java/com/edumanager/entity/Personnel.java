package com.edumanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "personnel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Personnel extends BaseEntity {
    
    @NotBlank(message = "Le nom est obligatoire")
    @Column(name = "nom", nullable = false)
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    @Column(name = "prenom", nullable = false)
    private String prenom;
    
    @NotNull(message = "Le poste est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "poste", nullable = false)
    private Poste poste;
    
    @Column(name = "matiere")
    private String matiere;
    
    @PositiveOrZero(message = "Le salaire doit être positif ou zéro")
    @Column(name = "salaire", precision = 10, scale = 2)
    private BigDecimal salaire;
    
    @Column(name = "telephone")
    private String telephone;
    
    @Email(message = "Format d'email invalide")
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    @Builder.Default
    private StatutPersonnel statut = StatutPersonnel.ACTIF;
    
    // Relations
    @OneToMany(mappedBy = "enseignantPrincipal", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Classe> classesPrincipales = new ArrayList<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "personnel_classes",
        joinColumns = @JoinColumn(name = "personnel_id"),
        inverseJoinColumns = @JoinColumn(name = "classe_id")
    )
    @Builder.Default
    private List<Classe> classesAssignees = new ArrayList<>();
    
    // Méthodes utilitaires
    public String getNomComplet() {
        return prenom + " " + nom;
    }
    
    public boolean isEnseignant() {
        return poste == Poste.ENSEIGNANT;
    }
    
    public void assignerClasse(Classe classe) {
        if (classesAssignees == null) {
            classesAssignees = new ArrayList<>();
        }
        if (!classesAssignees.contains(classe)) {
            classesAssignees.add(classe);
            classe.getEnseignants().add(this);
        }
    }
    
    public void retirerClasse(Classe classe) {
        if (classesAssignees != null) {
            classesAssignees.remove(classe);
            classe.getEnseignants().remove(this);
        }
    }
    
    public enum Poste {
        ENSEIGNANT("Enseignant"),
        DIRECTION("Direction"),
        ADMINISTRATION("Administration"),
        SURVEILLANT("Surveillant"),
        MAINTENANCE("Maintenance");
        
        private final String libelle;
        
        Poste(String libelle) {
            this.libelle = libelle;
        }
        
        public String getLibelle() {
            return libelle;
        }
    }
    
    public enum StatutPersonnel {
        ACTIF, CONGE, SUSPENDU, DEMISSIONNE
    }
}