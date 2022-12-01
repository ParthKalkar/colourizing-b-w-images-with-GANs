import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import pathlib
from flask_cors import CORS
from config import *
from utils import *
from dotenv import load_dotenv
from model import *

load_dotenv()

model = torch.load("modelcolorizer.pt")
model.eval()

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
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
            img_path = app.config['UPLOAD_FOLDER'] + filename
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            img_input = img.copy()

            # convert BGR to RGB
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)

            img_rgb = img.copy()

            # normalize input
            img_rgb = (img_rgb / 255.).astype(np.float32)

            # convert RGB to LAB
            img_lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2Lab)
            # only L channel to be used
            img_l = img_lab[:, :, 0]

            input_img = cv2.resize(img_l, (224, 224))
            input_img -= 50 # subtract 50 for mean-centering

            # plot images
            # fig = plt.figure(figsize=(10, 5))
            # fig.add_subplot(1, 2, 1)
            # plt.imshow(img_rgb)
            # fig.add_subplot(1, 2, 2)
            # plt.axis('off')
            plt.figure(figsize=(10,10))
            plt.imshow(input_img, cmap='gray')
            print_output()
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

def print_output():
    net.setInput(cv2.dnn.blobFromImage(input_img))
    pred = net.forward()[0,:,:,:].transpose((1, 2, 0))

    # resize to original image shape
    pred_resize = cv2.resize(pred, (img.shape[1], img.shape[0]))

    # concatenate with original image L
    pred_lab = np.concatenate([img_l[:, :, np.newaxis], pred_resize], axis=2)

    # convert LAB to RGB
    pred_rgb = cv2.cvtColor(pred_lab, cv2.COLOR_Lab2RGB)
    pred_rgb = np.clip(pred_rgb, 0, 1) * 255
    pred_rgb = pred_rgb.astype(np.uint8)

    # plot prediction result
    fig = plt.figure(figsize=(20, 10))
    fig.add_subplot(1, 2, 1).axis('off')
    plt.imshow(img_l, cmap='gray')
    fig.add_subplot(1, 2, 2).axis('off')
    plt.imshow(pred_rgb)
    # plt.savefig(output_filename)

    # save result image file
    filename, ext = os.path.splitext(img_path)
    # input_filename = '%s_input%s' % (filename, ext)
    # output_filename = '%s_output%s' % (filename, ext)

    # pred_rgb_output = cv2.cvtColor(pred_rgb, cv2.COLOR_RGB2BGR)

    # cv2.imwrite(input_filename, img_input)
    # cv2.imwrite(output_filename, np.concatenate([img, pred_rgb_output], axis=1))

@app.route("/test_response")
def users():
    headers = {"Content-Type": "application/json"}
    return make_response(
        'Test worked!',
        200,
        headers=headers
    )

def check_env():
    RANDOM_SEED = os.environ.get("RANDOM_SEED")
    if RANDOM_SEED is None:
        raise RuntimeError from None

if __name__ == "__main__":
    check_env()
    load_variables()
    app.run(debug=True)