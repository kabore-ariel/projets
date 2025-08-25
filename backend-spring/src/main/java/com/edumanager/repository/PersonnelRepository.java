package com.edumanager.repository;

import com.edumanager.entity.Personnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonnelRepository extends JpaRepository<Personnel, Long> {
    
    Optional<Personnel> findByEmail(String email);
    
    List<Personnel> findByPoste(Personnel.Poste poste);
    
    List<Personnel> findByMatiere(String matiere);
    
    @Query("SELECT p FROM Personnel p WHERE p.poste = com.edumanager.entity.Personnel.Poste.ENSEIGNANT")
    List<Personnel> findEnseignants();
    
    @Query("SELECT p FROM Personnel p WHERE p.statut = com.edumanager.entity.Personnel.StatutPersonnel.ACTIF")
    List<Personnel> findPersonnelActif();
    
    @Query("SELECT p FROM Personnel p WHERE p.poste = com.edumanager.entity.Personnel.Poste.ENSEIGNANT " +
           "AND p.matiere = :matiere AND p.statut = com.edumanager.entity.Personnel.StatutPersonnel.ACTIF")
    List<Personnel> findEnseignantsByMatiere(@Param("matiere") String matiere);
    
    @Query("SELECT p FROM Personnel p WHERE " +
           "LOWER(p.nom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.prenom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.matiere) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Personnel> findByNomOrPrenomOrMatiereContaining(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT COUNT(c) FROM Classe c WHERE c.enseignantPrincipal.id = :personnelId")
    Long countClassesPrincipalesByPersonnel(@Param("personnelId") Long personnelId);
    
    @Query("SELECT COUNT(c) FROM Personnel p JOIN p.classesAssignees c WHERE p.id = :personnelId")
    Long countClassesAssigneesByPersonnel(@Param("personnelId") Long personnelId);
    
    boolean existsByEmail(String email);
}