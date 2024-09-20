// C++ code
//

#define poten A1
#define Buzzer 2
#define EN 4
#define IN1 5
#define IN2 6
int chapulines = 0;
int val;
int velocidad;

void setup()
{
  Serial.begin(9600);
  pinMode(Buzzer, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(EN,OUTPUT);
}

void loop()
{
    if (Serial.available() > 0) {  // Verifica si hay datos disponibles
      chapulines = Serial.parseInt();
      Serial.print("Dato recibido: ");
      Serial.println(chapulines);  // Imprime el dato recibido para depuración
    }

    val = analogRead(poten);
    velocidad = map(val, 0, 1023, 0, 255);

    if (chapulines > 0) {  // Asegúrate de que esté comparando el carácter correcto
      digitalWrite(Buzzer, HIGH);
      digitalWrite(IN1, HIGH);
      digitalWrite(IN2, LOW);
      analogWrite(EN, velocidad);
      delay(2000);
      digitalWrite(IN1, LOW);
      digitalWrite(IN2, LOW);
      analogWrite(EN, 0);
      digitalWrite(Buzzer, LOW);
      delay(1000);
      chapulines=0;
    }
}
