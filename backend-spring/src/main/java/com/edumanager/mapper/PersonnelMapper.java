package com.edumanager.mapper;

import com.edumanager.dto.PersonnelDTO;
import com.edumanager.entity.Personnel;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PersonnelMapper {
    
    @Mapping(target = "nomComplet", expression = "java(personnel.getNomComplet())")
    @Mapping(target = "enseignant", expression = "java(personnel.isEnseignant())")
    @Mapping(target = "nombreClassesPrincipales", expression = "java((long) personnel.getClassesPrincipales().size())")
    @Mapping(target = "nombreClassesAssignees", expression = "java((long) personnel.getClassesAssignees().size())")
    PersonnelDTO toDTO(Personnel personnel);
    
    List<PersonnelDTO> toDTO(List<Personnel> personnel);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "classesPrincipales", ignore = true)
    @Mapping(target = "classesAssignees", ignore = true)
    Personnel toEntity(PersonnelDTO personnelDTO);
    
    @Mapping(target = "nomComplet", expression = "java(personnel.getNomComplet())")
    PersonnelDTO.PersonnelSimpleDTO toSimpleDTO(Personnel personnel);
    
    List<PersonnelDTO.PersonnelSimpleDTO> toSimpleDTO(List<Personnel> personnel);
}