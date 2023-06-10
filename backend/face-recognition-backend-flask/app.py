from flask import Flask, jsonify, request, make_response
import requests
from flask_cors import CORS
import json
import cv2
from PIL import Image
import base64
import io
from face_rec import FaceRec
import face_recognition
import numpy as np


app = Flask(__name__)
CORS(app)


@app.route('/markAttendence', methods=['GET','POST'])
def markAttendence():
    data = request.get_json()

    if data :
        try:
            r = requests.get("https://attendo.cyclic.app/api/encodings/"+data['teamName'])
            if(r.status_code==200):
                jsonObject=r.json()

                # Check whether encoding exists
                if len(jsonObject['encodings'])==0:
                    return make_response(jsonify({"error":"This team has no participant added or you have entered a wrong name"}),406)
                
                # Creating lists for encodings and id of participants
                encodeListKnown = []
                ids = []
                for jsonObj in jsonObject['encodings']:
                    encodeListKnown.append(json.loads('['+jsonObj['encodings']+']'))
                    ids.append(jsonObj['_id'])

                # Converting b64 url into image format
                result = data['imageSrc']
                b = bytes(result,'utf-8')
                image = b[b.find(b',')+1:]
                im = Image.open(io.BytesIO(base64.b64decode(image)))
                img = cv2.cvtColor(np.array(im), cv2.COLOR_BGR2RGB)

                # Creating a face_rec  class object
                faceRec = FaceRec(img,encodeListKnown,ids)

                # Getting Ids which are recognized
                unknownIds = faceRec.check_mark_attendence()
                
                # Checks for errors and marking Attendence
                if(unknownIds == "No face detected"):
                    return make_response(jsonify({"error":"No face detected. Please try again"}),400)  

                if len(unknownIds) ==0:
                     return make_response(jsonify({"error":"No match found for your face. Please contact your admin"}),400)  
                elif len(unknownIds)>1:
                    return make_response(jsonify({"error":"More than one faces found. Please try again individually!!"}),400)
                else:
                    reqPost = requests.post("https://attendo.cyclic.app/api/user/update/attendance", json={"id": unknownIds[0],"status":"P"})
                    if reqPost.status_code == 200:
                        return make_response(jsonify({"message":"Congratulations!! Your attendance has been marked"}),200)
                    else:
                        return make_response(jsonify({"error":"Some internal error occured"}),500)

                    # Code for marking attandance of multiple user. Removed due to performance issues due to python
                    # for id in unknownIds:
                    #     reqPost = requests.post("https://attendo.cyclic.app/api/user/update/attendance", json={"id": id,"status":"P"})
                    #     print(reqPost.status_code)
        except:
            print("Some error occured")
            return make_response(jsonify({"error":"Some internal error occured"}),500)
    else:
        return make_response(jsonify({"error":"Bad response"}),400)    


@app.route("/getEncodings",methods=["GET","POST"])
def getEncodings():
    data = request.get_json()
    
    if data :
        try:
            # Converting b64 url into image format
            result = data['data']
            b = bytes(result,'utf-8')
            image = b[b.find(b',')+1:]
            im = Image.open(io.BytesIO(base64.b64decode(image)))
            img = cv2.cvtColor(np.array(im), cv2.COLOR_BGR2RGB)

            # Getting Encoding from Image
            facesCurrFrame = face_recognition.face_locations(img)
            encodeCurrFrame = face_recognition.face_encodings(img,facesCurrFrame)

            # Handling Error and Success
            if(len(encodeCurrFrame)==1):
                return make_response(jsonify({"encodeList":np.array(encodeCurrFrame).tolist()}),200)
            elif(len(encodeCurrFrame)>1):
                return make_response(jsonify({"error":"More than one face detected. Try with a new image file"}),406)
            else:
                return make_response(jsonify({"error":"No face detected. Try with a new image file"}),406)
        except:
            print("Some error occured")
            return make_response(jsonify({"error":"Some internal error occured"}),500)
    else:
        return make_response(jsonify({"error":"Bad response"}),400)            



if __name__ == '__main__':
    app.run()
