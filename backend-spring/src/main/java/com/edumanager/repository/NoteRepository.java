package com.edumanager.repository;

import com.edumanager.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    
    List<Note> findByEleveId(Long eleveId);
    
    List<Note> findByEleveIdAndMatiere(Long eleveId, String matiere);
    
    List<Note> findByEleveIdAndTrimestre(Long eleveId, Note.Trimestre trimestre);
    
    List<Note> findByEleveIdAndMatiereAndTrimestre(Long eleveId, String matiere, Note.Trimestre trimestre);
    
    @Query("SELECT n FROM Note n WHERE n.eleve.classe.id = :classeId")
    List<Note> findByClasseId(@Param("classeId") Long classeId);
    
    @Query("SELECT n FROM Note n WHERE n.eleve.classe.id = :classeId AND n.matiere = :matiere")
    List<Note> findByClasseIdAndMatiere(@Param("classeId") Long classeId, @Param("matiere") String matiere);
    
    @Query("SELECT AVG(n.valeur) FROM Note n WHERE n.eleve.id = :eleveId")
    BigDecimal calculateMoyenneGeneraleByEleve(@Param("eleveId") Long eleveId);
    
    @Query("SELECT AVG(n.valeur) FROM Note n WHERE n.eleve.id = :eleveId AND n.matiere = :matiere")
    BigDecimal calculateMoyenneByEleveAndMatiere(@Param("eleveId") Long eleveId, @Param("matiere") String matiere);
    
    @Query("SELECT AVG(n.valeur) FROM Note n WHERE n.eleve.classe.id = :classeId")
    BigDecimal calculateMoyenneGeneraleByClasse(@Param("classeId") Long classeId);
    
    @Query("SELECT AVG(n.valeur) FROM Note n WHERE n.eleve.classe.id = :classeId AND n.matiere = :matiere")
    BigDecimal calculateMoyenneByClasseAndMatiere(@Param("classeId") Long classeId, @Param("matiere") String matiere);
    
    @Query("SELECT DISTINCT n.matiere FROM Note n WHERE n.eleve.classe.id = :classeId")
    List<String> findMatieresByClasseId(@Param("classeId") Long classeId);
    
    @Query("SELECT COUNT(n) FROM Note n WHERE n.eleve.id = :eleveId AND n.valeur >= 10")
    Long countNotesReussiesByEleve(@Param("eleveId") Long eleveId);
    
    @Query("SELECT COUNT(n) FROM Note n WHERE n.eleve.id = :eleveId")
    Long countNotesByEleve(@Param("eleveId") Long eleveId);
}