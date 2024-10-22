# BugBuster

BugBuster is an image recognition system designed to detect crop plagues early, enabling farmers to take timely actions, such as fumigation, to prevent crop loss. This project was developed during a Hackathon, utilizing a YOLOv8 model for accurate plague detection and integrating with hardware components for real-world applications.

## Features

- **Image Recognition**: Detects crop plagues using a trained YOLOv8 model with high accuracy.
- **Hardware Integration**: Connects with Arduino to enable automatic interventions based on detection.
- **Real-Time Data**: Provides real-time updates and alerts for detected plagues.
- **User Interface**: Simple and intuitive frontend for monitoring and controlling the system.
- **Backend Communication**: Seamless integration between hardware and software using Python and Next.js.

## Technologies Used

### Languages
- **TypeScript**
- **Python** 
- **JavaScript** 
- **C++ (Arduino)** 
- **CSS**

### Tools and Frameworks
- **YOLOv8** for object detection
- **Arduino** for hardware integration
- **Next.js** for backend and API communication
- **Python** for data processing and model integration
- **AJAX** for asynchronous data updates
- **HTML/CSS** for the frontend

## System Architecture

1. **Image Recognition Module**: Utilizes the YOLOv8 model trained on preprocessed datasets to detect different types of crop plagues.
2. **Hardware Interface**: Arduino sensors collect data from the field and trigger automatic actions based on detection.
3. **Backend**: Built using Next.js and Python to handle data processing, system updates, and hardware-software communication.
4. **Frontend**: A user-friendly interface developed in TypeScript and JavaScript for users to monitor plague detection and receive real-time alerts.

## How It Works

1. **Data Collection**: Sensors in the field collect environmental data, while the camera captures crop images.
2. **Plague Detection**: The YOLOv8 model processes the images and identifies potential crop plagues.
3. **Alerts and Actions**: If a plague is detected, the system sends an alert through the web interface and can automatically trigger actions like fumigation through Arduino.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bugbuster.git
   
2. Install backend dependencies:
    ```bash
    cd backend
    npm install
    
3. Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    
4. Set up Arduino and integrate with the system following the instructions in the /arduino folder.

## Usage

1. Start the backend server:
    ```bash
    npm run dev

2. Run the YOLOv8 plague detection:

    ```bash
    python run_model.py

3. Access the web interface at http://localhost:3000 to monitor plague detection in real time.
