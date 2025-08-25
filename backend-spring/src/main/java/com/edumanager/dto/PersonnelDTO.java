package com.edumanager.dto;

import com.edumanager.entity.Personnel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonnelDTO {
    
    private Long id;
    
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;
    
    @NotNull(message = "Le poste est obligatoire")
    private Personnel.Poste poste;
    
    private String matiere;
    
    @PositiveOrZero(message = "Le salaire doit être positif ou zéro")
    private BigDecimal salaire;
    
    private String telephone;
    
    @Email(message = "Format d'email invalide")
    private String email;
    
    private String avatarUrl;
    private Personnel.StatutPersonnel statut;
    private String nomComplet;
    private boolean enseignant;
    
    // Relations
    private List<ClasseDTO.ClasseSimpleDTO> classesPrincipales;
    private List<ClasseDTO.ClasseSimpleDTO> classesAssignees;
    
    // Statistiques
    private Long nombreClassesPrincipales;
    private Long nombreClassesAssignees;
    
    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // DTO simplifié
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonnelSimpleDTO {
        private Long id;
        private String nom;
        private String prenom;
        private String nomComplet;
        private Personnel.Poste poste;
        private String matiere;
        private String avatarUrl;
    }
}