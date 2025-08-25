package com.edumanager.dto;

import com.edumanager.entity.Eleve;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EleveDTO {
    
    private Long id;
    
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;
    
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;
    
    private String adresse;
    private String telephone;
    
    @Email(message = "Format d'email invalide")
    private String email;
    
    private String avatarUrl;
    private Eleve.StatutEleve statut;
    private String nomComplet;
    private Integer age;
    
    // Relations
    private ClasseDTO.ClasseSimpleDTO classe;
    private List<NoteDTO> notes;
    private List<PaiementDTO> paiements;
    
    // Statistiques
    private BigDecimal moyenneGenerale;
    private Long nombreNotes;
    private Long nombreNotesReussies;
    private Double tauxReussite;
    private Long paiementsEnAttente;
    
    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // DTO simplifié
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EleveSimpleDTO {
        private Long id;
        private String nom;
        private String prenom;
        private String nomComplet;
        private String avatarUrl;
        private ClasseDTO.ClasseSimpleDTO classe;
    }
}