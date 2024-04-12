import os
from data.molToImage import drawFinalPreds

def spnps():
    #### All operations need to performed in Dir:data
    cmd1 = 'sudo docker run --rm=true -v $(pwd):/cfmid/public/ -i wishartlab/cfmid:msml4.0.8_msrb1.1.4 sh -c "cd /cfmid/public/; cfm-predict pred_final.txt 0.001 param_output-1.log param_config.txt 0 CFM-ID-output.mgf 0"'
    os.system(cmd1)

    with open("CFM-ID-output.mgf", 'r') as f, open("CFM-ID.mgf", "w") as fin:
        lines = f.readlines()
        for line in lines:
            if 'TITLE' in line:
                line = line.replace('TITLE', 'SEQ=*..*\nNAME').replace(';Energy0;[M]+;In-silico MS/MS by CFM-ID 4.0.8;', ': ')
            if 'PEPMASS' in line:
                tmp = line.split('\n')[0].split('=')[-1]
                num = float(tmp) + 1.007276
                line = 'PEPMASS=' + str(num) + '\n' 
            fin.write(line)

    # cmd2 = './convert TR-PTAs-UPLC-0105.mgf'
    # os.system(cmd2)

    cmd3 = './main_execmodule ExecSpectralLibrarySearch ./TC-ISDB.params'
    os.system(cmd3)

    pred_spnps = []
    with open("spnps.out", 'r') as f, open("spnps_final.out", "w") as fin:
        lines = f.readlines()
        lines = lines[1:]
        for line in lines:
            line = line.split('\t')[15].replace(';', '\n')
            if line not in pred_spnps:
                pred_spnps.append(line)
        fin.writelines(pred_spnps)

    drawFinalPreds()

def convert():
    cmd = './convert Actual-Measure.mgf'
    os.system(cmd)

if __name__ == "__main__":
    spnps()

