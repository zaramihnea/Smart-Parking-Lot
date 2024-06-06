from picamera2 import Picamera2, Preview
from time import sleep
import time
import requests
import os
from libcamera import controls
import subprocess
import socket
import RPi.GPIO as GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(8, GPIO.OUT)
GPIO.setup(10, GPIO.IN)
prevDistance = 0
result = "null"
status = "unoccupied"
command = "python detetctplate.py /home/raspberry/Arduino_Module/3.jpg"
free = 0
camera = Picamera2()
camera.set_controls({"AfMode": controls.AfModeEnum.Continuous})
camera.start_and_capture_file("/home/raspberry/Arduino_Module/img.jpg")
sleep(2)
prevDistance = 0
endpoint = "https://api.smartparkinglot.online/parking_spots/update/50"
headers = { 'Content-Type' : 'application/json' }

while True:
    GPIO.output(8, GPIO.HIGH)
    sleep(0.00001)
    GPIO.output(8, GPIO.LOW)
    start = time.time()
    stop = time.time()
    while GPIO.input(10) == 0:
        start = time.time()
    while GPIO.input(10) == 1:
        stop = time.time()
    duration = stop - start
    distance = 34300/2 * duration
    distance = round(distance, 2)
    if free == 0 and distance < 11:
        prevDistance = distance
        free = 1
        camera.start_and_capture_file("/home/raspberry/Arduino_Module/img.jpg")
        result = subprocess.run(command, shell=True,
                                capture_output=True, text=True)
        result = result.stdout.strip()
        status = "occupied"
        data = {'id': 50,
                'plate': result,
                'status': status,
                'name': 'RPI sensor'}
        r = requests.post(url=endpoint, headers=headers, json=data)
        print(r.text)
        print(result)
    elif free == 1 and distance > 100:
        prevDistance = distance
        free = 0
        status = "unoccupied"
        result = "null"
        data = {'id': 50,
                'plate': result,
                'status': status,
                'name': 'RPI sensor'}
        r = requests.post(url=endpoint, headers=headers, json=data)
        print(r.text)
        print(distance)
    elif distance > prevDistance + 5 or distance < prevDistance - 5:
        if prevDistance == 0:
            data = {'id': 50,
                    'plate': "null",
                    'status': "unoccupied",
                    'name': 'RPI sensor'}
            r = requests.post(url=endpoint, headers=headers, json=data)
            print(r.text)
            print(distance)
        prevDistance = distance
    sleep(1)
