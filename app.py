from flask import Flask, render_template, request
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('simulate.html')

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
        file.write(f"Concentration={concentration}\n")
        file.write(f"equilibration_time={equilibration_time}\n")
        file.write(f"sim_time={sim_time}\n")
        file.write(f"sim_frames={sim_frames}\n")

    # Run a bash script (for example, 'myscript.sh')
    try:
        subprocess.run(['bash', 'simulate.sh'], check=True)
    except subprocess.CalledProcessError as e:
        return f"An error occurred while executing the script: {e}"

    return "Form submitted successfully and bash script executed!"


if __name__ == '__main__':
    app.run(host='localhost', port=8080)
