package com.edumanager.repository;

import com.edumanager.entity.Classe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClasseRepository extends JpaRepository<Classe, Long> {
    
    Optional<Classe> findByNom(String nom);
    
    List<Classe> findByNiveau(String niveau);
    
    List<Classe> findByNiveauAndSection(String niveau, String section);
    
    @Query("SELECT c FROM Classe c WHERE c.enseignantPrincipal.id = :enseignantId")
    List<Classe> findByEnseignantPrincipalId(@Param("enseignantId") Long enseignantId);
    
    @Query("SELECT c FROM Classe c JOIN c.enseignants e WHERE e.id = :enseignantId")
    List<Classe> findByEnseignantId(@Param("enseignantId") Long enseignantId);
    
    @Query("SELECT c FROM Classe c WHERE SIZE(c.eleves) < c.effectifMax")
    List<Classe> findClassesAvecPlacesDisponibles();
    
    @Query("SELECT c FROM Classe c WHERE SIZE(c.eleves) >= c.effectifMax")
    List<Classe> findClassesCompletes();
    
    @Query("SELECT COUNT(e) FROM Eleve e WHERE e.classe.id = :classeId")
    Integer countElevesByClasseId(@Param("classeId") Long classeId);
    
    boolean existsByNom(String nom);
}