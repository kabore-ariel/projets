package com.edumanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClasseDTO {
    
    private Long id;
    
    @NotBlank(message = "Le nom de la classe est obligatoire")
    private String nom;
    
    @NotBlank(message = "Le niveau est obligatoire")
    private String niveau;
    
    @NotBlank(message = "La section est obligatoire")
    private String section;
    
    @NotNull(message = "L'effectif maximum est obligatoire")
    @Positive(message = "L'effectif maximum doit être positif")
    private Integer effectifMax;
    
    private String salle;
    private String description;
    private Integer effectifActuel;
    private boolean complete;
    
    // Relations
    private PersonnelDTO enseignantPrincipal;
    private List<PersonnelDTO> enseignants;
    private List<EleveDTO> eleves;
    
    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // DTO simplifié pour éviter les références circulaires
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClasseSimpleDTO {
        private Long id;
        private String nom;
        private String niveau;
        private String section;
        private String salle;
        private Integer effectifMax;
        private Integer effectifActuel;
    }
}