const taxonomyModel=require('../models/taxonomy.model.server');

findAllTaxonomy= ()=>taxonomyModel.find();

findTaxonomyBySolution = (solution)=>taxonomyModel.find({solution:{$regex: solution,$options:'i'}});

findTaxonomyBySector =(sector)=>taxonomyModel.find({sector:{$regex: sector,$options:'i'}});

findTaxonomyByStrategy = (strategy)=>taxonomyModel.find({strategy:{$regex: strategy,$options:'i'}});

findAllSector=()=>taxonomyModel.find({},{sector:1});

findAllSolution=()=>taxonomyModel.find({},{solution:1});

module.exports={
    findAllTaxonomy,
    findTaxonomyBySolution,
    findTaxonomyBySector,
    findTaxonomyByStrategy,
    findAllSector,
    findAllSolution
};