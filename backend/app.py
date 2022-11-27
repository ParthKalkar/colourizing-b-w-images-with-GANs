import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import pathlib
from config import *
from utils import *

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    # process image from MODEL
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return ERR_NO_FILE
        file = request.files['file']
        if file.filename == '':
            return ERR_NO_FILE
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            pathlib.Path(app.config['UPLOAD_FOLDER']).mkdir(exist_ok=True)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('uploaded_file',
                                    filename=filename))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''
if __name__ == "__main__":
    app.run(debug=True)