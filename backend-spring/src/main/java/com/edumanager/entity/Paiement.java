package com.edumanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "paiements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paiement extends BaseEntity {
    
    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    @Column(name = "montant", nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;
    
    @NotNull(message = "Le mois est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "mois", nullable = false)
    private Mois mois;
    
    @NotNull(message = "L'année est obligatoire")
    @Column(name = "annee", nullable = false)
    private Integer annee;
    
    @NotNull(message = "Le statut est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    @Builder.Default
    private StatutPaiement statut = StatutPaiement.EN_ATTENTE;
    
    @Column(name = "date_paiement")
    private LocalDate datePaiement;
    
    @Column(name = "mode_paiement")
    @Enumerated(EnumType.STRING)
    private ModePaiement modePaiement;
    
    @Column(name = "reference_transaction")
    private String referenceTransaction;
    
    @Column(name = "commentaire")
    private String commentaire;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eleve_id", nullable = false)
    private Eleve eleve;
    
    // Méthodes utilitaires
    public boolean isPaye() {
        return statut == StatutPaiement.PAYE;
    }
    
    public boolean isEnRetard() {
        if (statut == StatutPaiement.PAYE) return false;
        
        LocalDate dateEcheance = getDateEcheance();
        return LocalDate.now().isAfter(dateEcheance);
    }
    
    public LocalDate getDateEcheance() {
        // Date d'échéance : 5ème jour du mois concerné
        return LocalDate.of(annee, mois.getNumero(), 5);
    }
    
    public void marquerCommePaye(ModePaiement mode, String reference) {
        this.statut = StatutPaiement.PAYE;
        this.datePaiement = LocalDate.now();
        this.modePaiement = mode;
        this.referenceTransaction = reference;
    }
    
    public enum Mois {
        SEPTEMBRE(9, "Septembre"),
        OCTOBRE(10, "Octobre"),
        NOVEMBRE(11, "Novembre"),
        DECEMBRE(12, "Décembre"),
        JANVIER(1, "Janvier"),
        FEVRIER(2, "Février"),
        MARS(3, "Mars"),
        AVRIL(4, "Avril"),
        MAI(5, "Mai"),
        JUIN(6, "Juin");
        
        private final int numero;
        private final String libelle;
        
        Mois(int numero, String libelle) {
            this.numero = numero;
            this.libelle = libelle;
        }
        
        public int getNumero() {
            return numero;
        }
        
        public String getLibelle() {
            return libelle;
        }
    }
    
    public enum StatutPaiement {
        EN_ATTENTE("En attente"),
        PAYE("Payé"),
        ANNULE("Annulé"),
        REMBOURSE("Remboursé");
        
        private final String libelle;
        
        StatutPaiement(String libelle) {
            this.libelle = libelle;
        }
        
        public String getLibelle() {
            return libelle;
        }
    }
    
    public enum ModePaiement {
        ESPECES("Espèces"),
        CHEQUE("Chèque"),
        VIREMENT("Virement bancaire"),
        CARTE("Carte bancaire"),
        MOBILE_MONEY("Mobile Money");
        
        private final String libelle;
        
        ModePaiement(String libelle) {
            this.libelle = libelle;
        }
        
        public String getLibelle() {
            return libelle;
        }
    }
}