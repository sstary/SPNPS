from rdkit import Chem
from rdkit.Chem import  Draw
from rdkit.Chem.Draw import IPythonConsole #Needed to show molecules
from rdkit.Chem.Draw.MolDrawing import MolDrawing, DrawingOptions #Only needed if modifying defaults

def drawPreds():
    opts = DrawingOptions()
    # opts.includeAtomNumbers = True
    opts.bondLineWidth = 1.0
    with open('./data/pred_result.txt','r') as f:
        t1 = f.readlines()[0].split('\t')
        j = 0
        for x in range(len(t1)):
            j =  j + 1
            # print("Index " + str(j))
            rxn_s=str(t1[x]).replace('\n','')
            reactants = Chem.MolFromSmiles(rxn_s)
            Draw.MolToFile(reactants, './data/pred_' + str(j) + '.png', options=opts, size=(250, 250))
    f.close()

def drawFinalPreds():
    opts = DrawingOptions()
    # opts.includeAtomNumbers = True
    opts.bondLineWidth = 1.0
    with open('spnps_final.out','r') as f:
        lines = f.readlines()
        for line in lines:
            name, rxn_s = line.split(': ')
            rxn_s=rxn_s.replace('\n','')
            reactants = Chem.MolFromSmiles(rxn_s)
            Draw.MolToFile(reactants, 'SPNPS_' + name + '.png', options=opts, size=(250, 250))
    f.close()