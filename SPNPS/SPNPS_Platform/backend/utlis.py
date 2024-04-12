import base64
import os

def str2txt(string):
    with open('./data/pred.txt', 'w', encoding='utf-8') as f:
      f.write(string)
    f.close()


# 需要对图片做一个解码和编码的操作
def retuen_img_stream(img_path):
    
    img_stream = ''

    with open(img_path, 'rb') as f:
        img_stream = f.read()
        img_stream = base64.b64encode(img_stream).decode()
    return img_stream


def get_result(rts):
    txt_file = './data/pred_result.txt'
    imgs = './data/'
    result = {'nps': [], 'nps_img': [], 'rts': None, 'rts_img': None, 'nps_file': None, 'am': [], 'am_img': [], 'am_file': None}
    nps = ''
    with open(txt_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for line in lines:
            nps += line 
        result['nps_file'] = nps
        all_preds = lines[0].split('\t')
        count = 1
        for pred in all_preds:
            result['nps'].append(pred)
            img_path = os.path.join(imgs, 'pred_' + str(count) + '.png')
            result['nps_img'].append(retuen_img_stream(img_path))
            count += 1
    f.close()

    am = ''
    with open('data/spnps_final.out', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for line in lines:
            [am_code, am_nps] = line.split(':')
            an_r = am_code.split('-')[0]
            if [an_r, am_nps] not in result['am']:
                result['am'].append([an_r, am_nps])
                am_img_path = os.path.join(imgs, 'SPNPS_' + am_code + '.png')
                result['am_img'].append(retuen_img_stream(am_img_path))
            am += line
        result['am_file'] = am

    f.close()
    result['rts'] = rts 
    # result['rts_img'] = retuen_img_stream(os.path.join(imgs, 'example.png'))
    # 清空生成的文件
    for root, dirs, files in os.walk(imgs, topdown=False):
        for name in files:
            if name.endswith('.png',) or name.endswith('.proc',) or name.endswith('.out',):
                os.remove(os.path.join(root, name))
            if name.startswith('pred') and name.endswith('.txt',):
                os.remove(os.path.join(root, name))
    os.remove(os.path.join(imgs, "Actual-Measure.mgf"))
    os.remove(os.path.join(imgs, "Actual-Measure.pklbin"))
    os.remove(os.path.join(imgs, "CFM-ID.mgf"))
    os.remove(os.path.join(imgs, "CFM-ID-output.mgf"))
    
    return result