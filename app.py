from flask import Flask, render_template, request, send_file
import subprocess
import os

app = Flask(__name__)

# Route for the home page
@app.route('/')
def home():
    return render_template('index.html')

# Route to download the parameter file
@app.route('/download')
def download():
    param_file = 'parameters.txt'  # Replace with your parameter file
    return send_file(param_file, as_attachment=True)

# Route to handle form submission
@app.route('/submit', methods=['POST'])
def submit():
    param1 = request.form['param1']  # Get the parameter value from the form
    param2 = request.form['param2']  # Additional parameters can be added similarly
    
    # Prepare a command to run your bash script
    bash_script = './your_script.sh'  # Replace with your bash script path
    command = [bash_script, param1, param2]
    
    try:
        # Run the bash script
        subprocess.run(command, check=True)
        return "Script executed successfully!"
    except subprocess.CalledProcessError as e:
        return f"An error occurred while executing the script: {e}"
    except Exception as ex:
        return f"An unexpected error occurred: {ex}"

if __name__ == '__main__':
    app.run(host='localhost', port=8080)
