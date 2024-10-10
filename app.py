from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Lista de postos de carregamento em São Luís, MA
postos = [
    {"nome": "Shopping da Ilha", "latitude": -5264022, "longitude": -44.2541628},
    {"nome": "Shopping da Ilha", "latitude": -2.5276016, "longitude": -44.2547130},
    {"nome": "DOMVEL VEICULOS SEMINOVOS", "latitude": -2.5187308, "longitude": -44.2521448},
    {"nome": "São Luís Shopping", "latitude": -2.5121128, "longitude": -44.2857026},
    {"nome": "Eletroposto Equatorial", "latitude": -2.4954417, "longitude": -44.2619355},
    {"nome": "Volvo Original", "latitude": -2.4925309, "longitude": -44.2627962},
    {"nome": "DrEnergia Br", "latitude": -2.4921303, "longitude": -44.2756047},
    {"nome": "BR Super Carga", "latitude": -2.4916848, "longitude": -44.2766206},
    {"nome": "ELETROPOSTO OLIVEIRA", "latitude": -2.4909486, "longitude": -44.2580172},
    {"nome": "VOLTZ", "latitude": -2.4929881, "longitude": -44.2856302},
    {"nome": "Green Recharge", "latitude": -2.4907908, "longitude": -44.2550124},
    {"nome": "Dr Energia Br", "latitude": -2.4837931, "longitude": -44.2498971},
    {"nome": "VOLTZ", "latitude": -2.5000065, "longitude": -44.3093359},
    {"nome": "VOLTZ", "latitude": -2.5544805, "longitude": -44.2206208},
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/postos/')
def get_postos():
    # Obter a localização do usuário da query string
    user_location = request.args.get('location')
    if user_location:
        lat, lon = map(float, user_location.split(','))
        # Para simplicidade, apenas retornamos a lista completa
        return jsonify(postos)
    return jsonify(postos)

if __name__ == '__main__':
    app.run(debug=True)
