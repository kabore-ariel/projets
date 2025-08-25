package com.edumanager.repository;

import com.edumanager.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    
    List<Paiement> findByEleveId(Long eleveId);
    
    List<Paiement> findByStatut(Paiement.StatutPaiement statut);
    
    List<Paiement> findByEleveIdAndStatut(Long eleveId, Paiement.StatutPaiement statut);
    
    List<Paiement> findByMoisAndAnnee(Paiement.Mois mois, Integer annee);
    
    @Query("SELECT p FROM Paiement p WHERE p.eleve.classe.id = :classeId")
    List<Paiement> findByClasseId(@Param("classeId") Long classeId);
    
    @Query("SELECT p FROM Paiement p WHERE p.eleve.classe.id = :classeId AND p.statut = :statut")
    List<Paiement> findByClasseIdAndStatut(@Param("classeId") Long classeId, 
                                           @Param("statut") Paiement.StatutPaiement statut);
    
    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.statut = com.edumanager.entity.Paiement.StatutPaiement.PAYE")
    BigDecimal calculateTotalRecettes();
    
    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.eleve.classe.id = :classeId AND " +
           "p.statut = com.edumanager.entity.Paiement.StatutPaiement.PAYE")
    BigDecimal calculateRecettesByClasse(@Param("classeId") Long classeId);
    
    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.eleve.id = :eleveId AND " +
           "p.statut = com.edumanager.entity.Paiement.StatutPaiement.PAYE")
    BigDecimal calculateMontantPayeByEleve(@Param("eleveId") Long eleveId);
    
    @Query("SELECT COUNT(p) FROM Paiement p WHERE p.statut = com.edumanager.entity.Paiement.StatutPaiement.EN_ATTENTE")
    Long countPaiementsEnAttente();
    
    @Query("SELECT p FROM Paiement p WHERE p.statut = com.edumanager.entity.Paiement.StatutPaiement.EN_ATTENTE " +
           "AND p.annee = :annee AND p.mois = :mois")
    List<Paiement> findPaiementsEnAttenteByMoisAndAnnee(@Param("mois") Paiement.Mois mois, 
                                                         @Param("annee") Integer annee);
    
    @Query("SELECT p FROM Paiement p WHERE p.datePaiement BETWEEN :dateDebut AND :dateFin")
    List<Paiement> findPaiementsByPeriode(@Param("dateDebut") LocalDate dateDebut, 
                                          @Param("dateFin") LocalDate dateFin);
    
    @Query("SELECT p FROM Paiement p WHERE p.statut = com.edumanager.entity.Paiement.StatutPaiement.EN_ATTENTE " +
           "AND p.annee < :annee OR (p.annee = :annee AND p.mois <= :mois)")
    List<Paiement> findPaiementsEnRetard(@Param("annee") Integer annee, @Param("mois") Paiement.Mois mois);
}