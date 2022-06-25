import cv2
import numpy as np
import face_recognition
import os
from datetime import datetime

class FaceRec:

    def __init__(self,unknownImage, encodeListKnown,ids):
        self.unknownImage = unknownImage
        self.encodeListKnown = encodeListKnown
        self.ids = ids


    def check_mark_attendence(self):
        facesCurrFrame = face_recognition.face_locations(self.unknownImage)
        encodeCurrFrame = face_recognition.face_encodings(self.unknownImage,facesCurrFrame)
        if(len(facesCurrFrame)==0):
            return "No face detected"

        imgS=cv2.resize(self.unknownImage,(0,0),None,0.25,0.25)
        imgS=cv2.cvtColor(imgS,cv2.COLOR_BGR2RGB)

        attendee = []
        for encodeFace,faceLoc in zip(encodeCurrFrame,facesCurrFrame):
            matches = face_recognition.compare_faces(self.encodeListKnown,encodeFace)
            faceDis = face_recognition.face_distance(self.encodeListKnown,encodeFace)
           
            matchIndex=np.argmin(faceDis)
            if matches[matchIndex]:
                id = self.ids[matchIndex]
                attendee.append(id)
                
        return attendee
       


