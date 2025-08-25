package com.edumanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classe extends BaseEntity {
    
    @NotBlank(message = "Le nom de la classe est obligatoire")
    @Column(name = "nom", nullable = false, unique = true)
    private String nom;
    
    @NotBlank(message = "Le niveau est obligatoire")
    @Column(name = "niveau", nullable = false)
    private String niveau;
    
    @NotBlank(message = "La section est obligatoire")
    @Column(name = "section", nullable = false)
    private String section;
    
    @NotNull(message = "L'effectif maximum est obligatoire")
    @Positive(message = "L'effectif maximum doit être positif")
    @Column(name = "effectif_max", nullable = false)
    private Integer effectifMax;
    
    @Column(name = "salle")
    private String salle;
    
    @Column(name = "description")
    private String description;
    
    // Relations
    @OneToMany(mappedBy = "classe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Eleve> eleves = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enseignant_principal_id")
    private Personnel enseignantPrincipal;
    
    @ManyToMany(mappedBy = "classesAssignees", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Personnel> enseignants = new ArrayList<>();
    
    // Méthodes utilitaires
    public int getEffectifActuel() {
        return eleves != null ? eleves.size() : 0;
    }
    
    public boolean isComplete() {
        return getEffectifActuel() >= effectifMax;
    }
    
    public void addEleve(Eleve eleve) {
        if (eleves == null) {
            eleves = new ArrayList<>();
        }
        eleves.add(eleve);
        eleve.setClasse(this);
    }
    
    public void removeEleve(Eleve eleve) {
        if (eleves != null) {
            eleves.remove(eleve);
            eleve.setClasse(null);
        }
    }
}