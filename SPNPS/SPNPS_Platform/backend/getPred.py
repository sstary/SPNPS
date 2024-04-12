from data.prodata import getProcdata, TopFive
from data.molToImage import drawPreds
from data.spnps import spnps, convert
from core_wln_global.nntest_direct import test_stage1
from rank_diff_wln.nntest_direct_useScores import test_stage2
from rank_diff_wln.eval_by_smiles32 import test_stage3
import os

def inference(fn):
    getProcdata(fn)
    test_stage1()
    test_stage2()
    test_stage3()
    drawPreds()
    TopFive()
    os.chdir('./data')
    spnps()
    os.chdir('..')

def mgf_to_pklbin():
    os.chdir('./data')
    convert()
    os.chdir('..')


if __name__ == "__main__":
    fn = 'data/pred'
    inference(fn)
    # mgf_to_pklbin()
