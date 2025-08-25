package com.edumanager.repository;

import com.edumanager.entity.Eleve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EleveRepository extends JpaRepository<Eleve, Long> {
    
    List<Eleve> findByClasseId(Long classeId);
    
    List<Eleve> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
    
    @Query("SELECT e FROM Eleve e WHERE e.classe.id = :classeId AND " +
           "(LOWER(e.nom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.prenom) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Eleve> findByClasseIdAndNomOrPrenomContaining(@Param("classeId") Long classeId, 
                                                       @Param("searchTerm") String searchTerm);
    
    @Query("SELECT e FROM Eleve e WHERE e.statut = com.edumanager.entity.Eleve.StatutEleve.ACTIF")
    List<Eleve> findElevesActifs();
    
    @Query("SELECT AVG(n.valeur) FROM Note n WHERE n.eleve.id = :eleveId AND n.trimestre = :trimestre")
    Double calculateMoyenneByEleveAndTrimestre(@Param("eleveId") Long eleveId, 
                                               @Param("trimestre") com.edumanager.entity.Note.Trimestre trimestre);
    
    @Query("SELECT AVG(n.valeur) FROM Note n WHERE n.eleve.id = :eleveId AND n.matiere = :matiere")
    Double calculateMoyenneByEleveAndMatiere(@Param("eleveId") Long eleveId, 
                                             @Param("matiere") String matiere);
    
    @Query("SELECT COUNT(p) FROM Paiement p WHERE p.eleve.id = :eleveId AND " +
           "p.statut = com.edumanager.entity.Paiement.StatutPaiement.EN_ATTENTE")
    Long countPaiementsEnAttenteByEleve(@Param("eleveId") Long eleveId);
    
    boolean existsByEmail(String email);
}