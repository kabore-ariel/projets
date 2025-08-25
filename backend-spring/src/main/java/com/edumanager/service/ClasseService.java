package com.edumanager.service;

import com.edumanager.dto.ClasseDTO;
import com.edumanager.entity.Classe;
import com.edumanager.entity.Personnel;
import com.edumanager.exception.ResourceNotFoundException;
import com.edumanager.exception.BusinessException;
import com.edumanager.mapper.ClasseMapper;
import com.edumanager.repository.ClasseRepository;
import com.edumanager.repository.PersonnelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ClasseService {
    
    private final ClasseRepository classeRepository;
    private final PersonnelRepository personnelRepository;
    private final ClasseMapper classeMapper;
    
    @Transactional(readOnly = true)
    public List<ClasseDTO> findAll() {
        log.debug("Récupération de toutes les classes");
        List<Classe> classes = classeRepository.findAll();
        return classeMapper.toDTO(classes);
    }
    
    @Transactional(readOnly = true)
    public ClasseDTO findById(Long id) {
        log.debug("Récupération de la classe avec l'ID: {}", id);
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'ID: " + id));
        return classeMapper.toDTO(classe);
    }
    
    @Transactional(readOnly = true)
    public List<ClasseDTO> findByNiveau(String niveau) {
        log.debug("Récupération des classes du niveau: {}", niveau);
        List<Classe> classes = classeRepository.findByNiveau(niveau);
        return classeMapper.toDTO(classes);
    }
    
    @Transactional(readOnly = true)
    public List<ClasseDTO> findClassesAvecPlacesDisponibles() {
        log.debug("Récupération des classes avec places disponibles");
        List<Classe> classes = classeRepository.findClassesAvecPlacesDisponibles();
        return classeMapper.toDTO(classes);
    }
    
    public ClasseDTO create(ClasseDTO classeDTO) {
        log.debug("Création d'une nouvelle classe: {}", classeDTO.getNom());
        
        // Vérifier l'unicité du nom
        if (classeRepository.existsByNom(classeDTO.getNom())) {
            throw new BusinessException("Une classe avec ce nom existe déjà: " + classeDTO.getNom());
        }
        
        Classe classe = classeMapper.toEntity(classeDTO);
        classe = classeRepository.save(classe);
        
        log.info("Classe créée avec succès: {} (ID: {})", classe.getNom(), classe.getId());
        return classeMapper.toDTO(classe);
    }
    
    public ClasseDTO update(Long id, ClasseDTO classeDTO) {
        log.debug("Mise à jour de la classe avec l'ID: {}", id);
        
        Classe existingClasse = classeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'ID: " + id));
        
        // Vérifier l'unicité du nom si modifié
        if (!existingClasse.getNom().equals(classeDTO.getNom()) && 
            classeRepository.existsByNom(classeDTO.getNom())) {
            throw new BusinessException("Une classe avec ce nom existe déjà: " + classeDTO.getNom());
        }
        
        // Mettre à jour les champs
        existingClasse.setNom(classeDTO.getNom());
        existingClasse.setNiveau(classeDTO.getNiveau());
        existingClasse.setSection(classeDTO.getSection());
        existingClasse.setEffectifMax(classeDTO.getEffectifMax());
        existingClasse.setSalle(classeDTO.getSalle());
        existingClasse.setDescription(classeDTO.getDescription());
        
        existingClasse = classeRepository.save(existingClasse);
        
        log.info("Classe mise à jour avec succès: {} (ID: {})", existingClasse.getNom(), existingClasse.getId());
        return classeMapper.toDTO(existingClasse);
    }
    
    public void delete(Long id) {
        log.debug("Suppression de la classe avec l'ID: {}", id);
        
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'ID: " + id));
        
        // Vérifier s'il y a des élèves dans la classe
        if (!classe.getEleves().isEmpty()) {
            throw new BusinessException("Impossible de supprimer une classe contenant des élèves");
        }
        
        classeRepository.delete(classe);
        log.info("Classe supprimée avec succès: {} (ID: {})", classe.getNom(), classe.getId());
    }
    
    public ClasseDTO assignerEnseignantPrincipal(Long classeId, Long enseignantId) {
        log.debug("Assignation de l'enseignant {} comme principal de la classe {}", enseignantId, classeId);
        
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'ID: " + classeId));
        
        Personnel enseignant = personnelRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel non trouvé avec l'ID: " + enseignantId));
        
        if (!enseignant.isEnseignant()) {
            throw new BusinessException("Seul un enseignant peut être assigné comme enseignant principal");
        }
        
        classe.setEnseignantPrincipal(enseignant);
        classe = classeRepository.save(classe);
        
        log.info("Enseignant principal assigné: {} pour la classe {}", 
                enseignant.getNomComplet(), classe.getNom());
        
        return classeMapper.toDTO(classe);
    }
    
    public ClasseDTO assignerEnseignant(Long classeId, Long enseignantId) {
        log.debug("Assignation de l'enseignant {} à la classe {}", enseignantId, classeId);
        
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'ID: " + classeId));
        
        Personnel enseignant = personnelRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel non trouvé avec l'ID: " + enseignantId));
        
        if (!enseignant.isEnseignant()) {
            throw new BusinessException("Seul un enseignant peut être assigné à une classe");
        }
        
        enseignant.assignerClasse(classe);
        personnelRepository.save(enseignant);
        
        log.info("Enseignant assigné: {} à la classe {}", 
                enseignant.getNomComplet(), classe.getNom());
        
        return classeMapper.toDTO(classe);
    }
    
    public ClasseDTO retirerEnseignant(Long classeId, Long enseignantId) {
        log.debug("Retrait de l'enseignant {} de la classe {}", enseignantId, classeId);
        
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'ID: " + classeId));
        
        Personnel enseignant = personnelRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel non trouvé avec l'ID: " + enseignantId));
        
        enseignant.retirerClasse(classe);
        personnelRepository.save(enseignant);
        
        log.info("Enseignant retiré: {} de la classe {}", 
                enseignant.getNomComplet(), classe.getNom());
        
        return classeMapper.toDTO(classe);
    }
}