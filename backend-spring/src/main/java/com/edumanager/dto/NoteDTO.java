package com.edumanager.dto;

import com.edumanager.entity.Note;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteDTO {
    
    private Long id;
    
    @NotNull(message = "La valeur de la note est obligatoire")
    @DecimalMin(value = "0.0", message = "La note doit être supérieure ou égale à 0")
    @DecimalMax(value = "20.0", message = "La note doit être inférieure ou égale à 20")
    private BigDecimal valeur;
    
    @NotBlank(message = "La matière est obligatoire")
    private String matiere;
    
    @NotNull(message = "Le type d'évaluation est obligatoire")
    private Note.TypeEvaluation typeEvaluation;
    
    private LocalDate dateEvaluation;
    private String commentaire;
    
    @NotNull(message = "Le trimestre est obligatoire")
    private Note.Trimestre trimestre;
    
    private String appreciation;
    private boolean reussie;
    
    // Relations
    private EleveDTO.EleveSimpleDTO eleve;
    private PersonnelDTO.PersonnelSimpleDTO enseignant;
    
    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}