#coding:utf-8
import sys
import os
# sys.path.append("..")
import json
from flask.json import jsonify
from flask import Flask, render_template, make_response
from flask_cors import CORS
from flask import request
from utlis import str2txt, retuen_img_stream, get_result
from getPred import inference, mgf_to_pklbin


app = Flask(__name__, static_folder='../frontend/static', 
                      template_folder='../frontend/templates')

cors = CORS(app, supports_credentials=True)
app.jinja_env.variable_start_string = '{['
app.jinja_env.variable_end_string = ']}'


@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == "GET":
        return render_template("HomePage.html")
    else:
        type = request.form.get("type") 
        fn = './data/pred' 
        if type == 'textinput':
            data = request.form.get("data") 
            print(data)
            print(os.getcwd())
            str2txt(data)
        else:
            file_metas = request.files.get('file')
            file_save = fn + '.txt'
            file_metas.save(file_save)
            with open(file_save, 'r', encoding='utf-8') as f:
                data = f.readlines()[0]
        
        # 执行inference
        inference(fn)
        # 读取返回结果
        res = get_result(data)
        return jsonify(res)

@app.route("/uploader", methods=['POST'])
def uploader():
    file_metas = request.files.get('file')
    print(os.getcwd())
    file_save = './data/Actual-Measure.mgf'
    file_metas.save(file_save)
    mgf_to_pklbin()
    return jsonify({'res': '上传成功'})


if __name__ == "__main__":
    app.debug = False
    app.run(host='0.0.0.0', port='8080')

