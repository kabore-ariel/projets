package com.edumanager.dto;

import com.edumanager.entity.Paiement;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class PaiementDTO {
    
    private Long id;
    
    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    private BigDecimal montant;
    
    @NotNull(message = "Le mois est obligatoire")
    private Paiement.Mois mois;
    
    @NotNull(message = "L'année est obligatoire")
    private Integer annee;
    
    @NotNull(message = "Le statut est obligatoire")
    private Paiement.StatutPaiement statut;
    
    private LocalDate datePaiement;
    private Paiement.ModePaiement modePaiement;
    private String referenceTransaction;
    private String commentaire;
    
    private boolean paye;
    private boolean enRetard;
    private LocalDate dateEcheance;
    
    // Relations
    private EleveDTO.EleveSimpleDTO eleve;
    
    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}