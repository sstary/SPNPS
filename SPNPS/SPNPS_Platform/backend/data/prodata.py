from rxnmapper import RXNMapper
from rdkit import Chem

rxn_mapper = RXNMapper()

def addMapID(rxnsmi):
    rxns = rxnsmi
    results = rxn_mapper.get_attention_guided_atom_maps(rxns)
    return results[0]['mapped_rxn']

def mol_with_atom_index( mol, type ):
    conserved_maps = [a.GetProp('molAtomMapNumber') for a in mol.GetAtoms() if a.HasProp('molAtomMapNumber')]
    conserved_maps= [int(x) for x in conserved_maps]
    for t in  conserved_maps[:]:
        if conserved_maps.count(t)>1:
            conserved_maps.remove(t)
    # print(conserved_maps)
    atoms = mol.GetNumAtoms()
    # print(atoms)
    id = []
    for i in range(1,atoms+1):
        id.append(i)
    # print(id)
    for i in conserved_maps:
        if (i <= atoms):
            id.remove(i)
    # print(id)
    NoMapAtom = []

    for a in mol.GetAtoms():
        if a.HasProp('molAtomMapNumber')!=0:
            continue
        else:
            NoMapAtom.append(a)
    # print(NoMap)
    for i in range(len(NoMapAtom)):
        # i=i
        NoMapAtom[i].SetProp( 'molAtomMapNumber',str(id[i]))
    return mol


def getProcdata(filename):
    with open(filename + ".txt", 'r') as f1, open(filename + "_0.txt", 'w') as f2:
        lines = f1.readlines()
        j = 0
        for line in lines:
            line = line.replace('\n','')
            j = j + 1
            f2.write('{}>>{}\n'.format(line, line))
            # print("G1: the " + str(j) + " reactant done")
    f1.close()
    f2.close()

    with open(filename + "_0.txt", 'r') as f1, open(filename + "_1.txt", 'w') as f2:
        lines = f1.readlines()
        j = 0
        for line in lines:
            j = j + 1
            rxn = [line]
            f2.write('{}\n'.format(addMapID(rxn)))
            # print("G1: the " + str(j) + " reactant done")
    f1.close()
    f2.close()


    with open(filename + "_1.txt",'r') as f1,open(filename + "_2.txt",'w') as f2:
        t1 = f1.readlines()
        j = 0
        for x in range(len(t1)):
            j =  j + 1
            # print("Index " + str(j))
            rxn_s=str(t1[x]).replace('\n','')
            reactants = Chem.MolFromSmiles(rxn_s.split('>')[0])
            products = Chem.MolFromSmiles(rxn_s.split('>')[2])

            reactants=mol_with_atom_index(reactants, 1)
            products=mol_with_atom_index(products, 2)
            r_i=Chem.MolToSmiles(reactants)
            p_i=Chem.MolToSmiles(products)

            f2.write(r_i+'>>'+p_i+'\n')
            # print("G2: the " + str(j) + " reactant done")
        # print(smi)
    f1.close()
    f2.close()

    with open(filename + "_2.txt", 'r') as f, open(filename + ".txt.proc", "w") as fin:
        lines = f.readlines()
        for line in lines:
            line = line.replace('\n', ' 1-2-1.0;3-4-1.0\n')
            fin.write(line)
    f.close()
    fin.close()

def TopFive():
    with open('./data/pred_result.txt','r') as f, open('./data/pred_final.txt','w') as fin:
        lines = f.readlines()
        reaction_index = 1
        for line in lines:
            rxns = []
            for r in line.split('\t'):
                if len(rxns) < 5 and r not in rxns:
                    rxns.append(r)
            index = 1
            for rxn in rxns:
                fin.write('R' + str(reaction_index) + '-0' + str(index) + ' ' + rxn + '\n')
                index += 1
            reaction_index += 1
    f.close()