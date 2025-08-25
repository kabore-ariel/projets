package com.edumanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Note extends BaseEntity {
    
    @NotNull(message = "La valeur de la note est obligatoire")
    @DecimalMin(value = "0.0", message = "La note doit être supérieure ou égale à 0")
    @DecimalMax(value = "20.0", message = "La note doit être inférieure ou égale à 20")
    @Column(name = "valeur", nullable = false, precision = 4, scale = 2)
    private BigDecimal valeur;
    
    @NotBlank(message = "La matière est obligatoire")
    @Column(name = "matiere", nullable = false)
    private String matiere;
    
    @NotNull(message = "Le type d'évaluation est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "type_evaluation", nullable = false)
    private TypeEvaluation typeEvaluation;
    
    @Column(name = "date_evaluation")
    private LocalDate dateEvaluation;
    
    @Column(name = "commentaire")
    private String commentaire;
    
    @NotNull(message = "Le trimestre est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "trimestre", nullable = false)
    private Trimestre trimestre;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eleve_id", nullable = false)
    private Eleve eleve;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enseignant_id")
    private Personnel enseignant;
    
    // Méthodes utilitaires
    public String getAppreciation() {
        double val = valeur.doubleValue();
        if (val >= 16) return "Excellent";
        if (val >= 14) return "Très bien";
        if (val >= 12) return "Bien";
        if (val >= 10) return "Assez bien";
        return "Insuffisant";
    }
    
    public boolean isReussie() {
        return valeur.compareTo(BigDecimal.valueOf(10)) >= 0;
    }
    
    public enum TypeEvaluation {
        DEVOIR_SURVEILLE("Devoir surveillé"),
        DEVOIR_MAISON("Devoir maison"),
        CONTROLE_CONTINU("Contrôle continu"),
        EXAMEN("Examen"),
        ORAL("Oral"),
        PROJET("Projet");
        
        private final String libelle;
        
        TypeEvaluation(String libelle) {
            this.libelle = libelle;
        }
        
        public String getLibelle() {
            return libelle;
        }
    }
    
    public enum Trimestre {
        PREMIER("1er Trimestre"),
        DEUXIEME("2ème Trimestre"),
        TROISIEME("3ème Trimestre");
        
        private final String libelle;
        
        Trimestre(String libelle) {
            this.libelle = libelle;
        }
        
        public String getLibelle() {
            return libelle;
        }
    }
}