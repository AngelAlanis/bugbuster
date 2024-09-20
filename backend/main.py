# import the inference-sdk
from inference_sdk import InferenceHTTPClient
from flask import Flask, request, jsonify
from flask_cors import CORS
import supervision as sv
import cv2
from collections import Counter
import numpy as np
import base64
from io import BytesIO
import json
import serial,time

API_KEY = 'API-KEY'

app = Flask(__name__)

CORS(app)

# Inicializar el cliente de inferencia
def initialize_client(api_url, api_key):
    return InferenceHTTPClient(api_url=api_url, api_key=api_key)

def initialize_arduino(port, speed):
    return serial.Serial(port, speed)

# Realizar la inferencia y obtener las predicciones
def infer_image(client, image, model_id):
    # Guardar el fotograma temporalmente para la inferencia
    img_path = 'temp_frame.jpg'
    cv2.imwrite(img_path, image)
    
    # Inferir usando el cliente
    result = client.infer(img_path, model_id=model_id)
    return result['predictions']

# Función para convertir la imagen a base64
def image_to_base64(image):
    _, buffer = cv2.imencode('.jpg', image)
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')
    return jpg_as_text

# Dibujar los bounding boxes y extraer las clases detectadas
def draw_bounding_boxes(image, predictions):
    detected_classes = []
    
    for bounding_box in predictions:
        x0 = bounding_box['x'] - bounding_box['width'] / 2
        x1 = bounding_box['x'] + bounding_box['width'] / 2
        y0 = bounding_box['y'] - bounding_box['height'] / 2
        y1 = bounding_box['y'] + bounding_box['height'] / 2
        
        start_point = (int(x0), int(y0))
        end_point = (int(x1), int(y1))
        
        # Dibujar el rectángulo
        cv2.rectangle(image, start_point, end_point, color=(0, 255, 0), thickness=1)
        
        # Preparar el texto con la clase y la confianza
        class_name = bounding_box["class"]
        confidence = bounding_box["confidence"]
        label = f"{class_name} ({confidence:.2f})"
        
        # Añadir la clase a la lista
        detected_classes.append(class_name)
        
        # Añadir la etiqueta de clase y confianza
        cv2.putText(
            image,
            label,
            (int(x0), int(y0) - 10),
            fontFace=cv2.FONT_HERSHEY_SIMPLEX,
            fontScale=0.6,
            color=(255, 255, 255),
            thickness=2
        )
    
    return detected_classes, image

def send_arduino_signal(arduino,valor):
    time.sleep(2)
    arduino.write(f"{valor}\n".encode())
    arduino.close()

# Contar las clases detectadas
def count_detected_classes(detected_classes):
    return Counter(detected_classes)

# Mostrar los resultados
def display_class_count(conteo_clases):
    for clase, count in conteo_clases.items():
        print(f"{clase}: {count}")

@app.route('/analizar-imagen', methods=['POST'])
def upload_image():
    print("Empezando análisis")

    # Verificar si se ha enviado un archivo
    if 'image' not in request.files:
        return jsonify({'error': 'No se encontró la imagen'}), 400
    
    print("Imagen recibida")
    
    file = request.files['image']

    # Convertir la imagen a formato OpenCV
    nparr = np.fromstring(file.read(), np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    print("Inicializadno cliente Roboflow")

    # Inicializar cliente para la inferencia
    client = initialize_client(api_url="https://detect.roboflow.com", api_key=API_KEY)

    print("Infiriendo imagen")
    # Inferir la imagen
    predictions = infer_image(client, image, model_id="chapulines/8")

    print("Dibujando bounding-boxes")
    # Dibujar los bounding boxes y obtener las clases detectadas
    detected_classes, processed_image = draw_bounding_boxes(image, predictions)

    print("Contando clases")
    conteo_clases = count_detected_classes(detected_classes)

        # Filtrar y contar cuántos "Grasshopper" hay
    grasshopper_count = conteo_clases.get("Grasshopper", 0)
    
    # Enviar la cantidad de "Grasshopper" detectados al Arduino
    if grasshopper_count > 0:
        print(f"Enviando señal al Arduino con el conteo de 'Grasshopper': {grasshopper_count}")
        arduino = initialize_arduino("COM8", 9600)
        time.sleep(2)  # Esperar a que el puerto se inicialice
        send_arduino_signal(arduino, grasshopper_count)
    else:
        print("No se detectaron 'Grasshopper', no se enviará señal al Arduino.")
    
    # Contar las clases detectadas
    display_class_count(conteo_clases)

    print("Convirtiendo imagen procesada a Base64")
    # Convertir la imagen procesada a Base64
    image_base64 = image_to_base64(processed_image)

    print("Devolviendo respuesta")
    # Devolver el conteo de clases y la imagen procesada en base64 como JSON
    response = {
        "conteo_clases": dict(conteo_clases),
        "image_base64": image_base64
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
