import os
import subprocess
import webbrowser
from flask import Flask, render_template, request
from threading import Thread
import time
import socket

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/simulate')
def simulate():
    return render_template('simulate.html')

@app.route('/status')
def status():
    return render_template('status.html')

@app.route('/submit', methods=['POST'])
def submit():
    # Get values from form input
    pdb_id = request.form.get('pdb_id')
    forcefield = request.form.get('forcefield')
    water_model = request.form.get('water_model')
    box_type = request.form.get('box_type')
    concentration = request.form.get('concentration')
    equilibration_time = request.form.get('equilibration_time')
    sim_time = request.form.get('sim_time')
    sim_frames = request.form.get('sim_frames')

    # Store or process values (e.g., save to a file, database, etc.)
    with open('parameters.sh', 'w') as file:
        file.write(f"#!/bin/bash\n")
        file.write(f"pdb_id={pdb_id}\n")
        file.write(f"forcefield={forcefield}\n")
        file.write(f"water_model={water_model}\n")
        file.write(f"box_type={box_type}\n")
        file.write(f"concentration={concentration}\n")
        file.write(f"equilibration_time={equilibration_time}\n")
        file.write(f"sim_time={sim_time}\n")
        file.write(f"sim_frames={sim_frames}\n")
           
    # Run a bash script (for example, 'myscript.sh')
    try:
        subprocess.run(['bash', 'simulate'], check=True)
    except subprocess.CalledProcessError as e:
        return f"An error occurred while executing the script: {e}"

    return render_template('complete.html')

def get_local_ip():
    # Get the local IP address of the device
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        # Connect to an outside server to get the local address
        s.connect(('10.254.254.254', 1))  # You can use any unreachable IP to force socket to choose the correct interface
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'  # Fallback to localhost if unable to fetch IP
    finally:
        s.close()
    return ip

def run_flask():
    local_ip = get_local_ip()  # Get the local IP address
    print(f"Starting Flask app on {local_ip}:8080")  # Print the IP address to the console
    app.run(host=local_ip, port=8080)  # Bind the Flask app to the local IP

if __name__ == '__main__':
    # Run Flask app in a separate thread
    thread = Thread(target=run_flask)
    thread.start()

    # Wait a bit to ensure the server is running before opening the browser
    time.sleep(1)

    # Automatically open the browser, using the dynamic IP address
    local_ip = get_local_ip()
    webbrowser.open(f'http://{local_ip}:8080')  # Open the browser with the dynamic IP address
