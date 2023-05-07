
import './css/App.css';
import React, {useState, useEffect} from 'react';
import ganastePng from './assets/images/ganaste.png';
import perdistePng from './assets/images/perdiste.png';
import malPng from './assets/images/rocko_mal.png';
import bienPng from './assets/images/rockito_bien.png';




const urlQuiz = "https://the-trivia-api.com/api/questions?categories=film_and_tv&limit=10&region=US&difficulty=easy";
var preguntasRespuestas = [];
var correctas = [];
var respuestas = []
var tempArray = [];
var puntuacion = 0;



const estiloBoton= "active button-next";
export default function App() {
  const [isLoading, setIsLoading]   = useState(true);
  const [preguntas, setPreguntas]   = useState(true);
  const [respuesta, setRespuesta]   = useState([[]]);
  const [isOn, setUpdate]           = useState(false);
  const [orden, setOrden]           = useState(0);
  const [opcion, setOpcion]         = useState(true);
  const [estilos, setStyle]         = useState([`options`,`options`,`options`,`options`]);
  const [startScreen, screenClose]  = useState(true);
  const [startGame , setFinal]      = useState(false);
  const [jugarOtra , setJugarOtra]  = useState(0);
  const [iconoRespuesta , setIcono] = useState("https://img.icons8.com/arcade/64/null/film-reel.png");
  const [cerrarVentanaInicio, setVentanaI]  = useState(`comienzaJuego comienza`);

  useEffect(function () {
    preguntasRespuestas = [];
    correctas = [];
    respuestas = []
    tempArray = [];
    puntuacion = 0;
    
    fetch(urlQuiz)
      
      .then(response => response.json())
      .then(data =>{
          data.forEach(pregunta => {
            preguntasRespuestas.push(pregunta.question);
            correctas.push(pregunta.correctAnswer);
            
            tempArray = pregunta.incorrectAnswers;
            tempArray.push(pregunta.correctAnswer);
         
            tempArray = tempArray.sort(() => Math.random() -0.5)
            
            respuestas.push(tempArray);
            setRespuesta(respuestas)
            
          });
          console.log(correctas)
          
          setPreguntas(preguntasRespuestas);
          setIsLoading(false);
          setOrden(0);
          setUpdate(false);
          setOpcion(true);
          setStyle([`options`,`options`,`options`,`options`]);
      })
    
      
  }, [jugarOtra]);
  function actualizarQuiz (opSelect){
    
    var respuestaCorrecta;

    respuesta[orden].forEach(opt => {
      if(correctas.includes(opt)){
        respuestaCorrecta = opt;
      }
    })

    if(respuestaCorrecta === opSelect){
      puntuacion = puntuacion + 1;
      setIcono(bienPng);
      
    }else{
      setIcono(malPng);
    }
    var posicion = respuesta[orden].indexOf(respuestaCorrecta);
    

    var temporal = [`options incorrecta`,`options incorrecta`,`options incorrecta`,`options incorrecta`];
    temporal[posicion] = `options correcta`;
    setStyle(temporal)
    setOpcion(false);
    setUpdate(true); 
  }

  function actualizarBoton (){
    setUpdate(false);
    setOpcion(true);
    setStyle([`options`,`options`,`options`,`options`]);
    setOrden(orden +1)
    setIcono("https://img.icons8.com/arcade/64/null/film-reel.png");
  }
  function finJuego () {
    setFinal(true);
    if(puntuacion > 5){
      setIcono(bienPng);
    }else{
      setIcono(malPng);
    }
  }
  function cerrarVentana() {
    setTimeout(() => {
      setVentanaI("esconder");
    }, 2000);
  }
  function volverAJugar (){
    
    setJugarOtra(jugarOtra + 1); 
    setTimeout(() => {
      setFinal(false);
      setIcono("https://img.icons8.com/arcade/64/null/film-reel.png");
    }, 250);
    
  }
  
  return (
    <div className="App">
      <div className={startScreen ? "comienza" : cerrarVentanaInicio}>
        <p className={startScreen ? "" : "esconder"}>¡Bienvenido a nuestra trivia de películas! Hoy tenemos una emocionante competencia en la que pondremos a prueba tus conocimientos sobre el mundo del cine. Consta de 10 preguntas y cada una de ellas te llevará a través de una gran variedad de géneros, desde clásicos de la época dorada de Hollywood hasta las más recientes producciones cinematográficas.</p>
        <button onClick={()=> {screenClose(false); cerrarVentana();}} className={startScreen ? "button-start " : `esconder` }><b>Empezar Trivia</b></button>
      </div>
      <div className={startGame ? "terminar-juego display-flex " : "terminar-juego"}>
        <p>Tu Puntuación es de: {puntuacion} -{puntuacion > 5 ? " !Ganaste¡" : " Perdiste 😞"}</p>
        <img className={puntuacion > 5 ? "icon-final-ganador": "icon-final"} src={puntuacion > 5 ? ganastePng : perdistePng} />
        <button className="button-salir seguir-jugando " onClick={volverAJugar}><b>Volver a jugar</b></button>
        <button className="button-salir " onClick={() => window.location.reload(true)}><b>Salir</b></button>
      </div>
      <p className={startScreen ? "":"titulo"} translate="no">Movie Trivia</p>
      <img className={startScreen ? "": "icono-movie" } src={iconoRespuesta}/>
      <p className="quiz">{preguntas[orden]}</p>
      <div className={estilos[0]} onClick={opcion ? () => actualizarQuiz(respuesta[orden][0]) : () =>{}}>
        <p><b>A</b></p> <p  className="single-option">{respuesta[orden][0]}</p>
      </div>
      <div className={estilos[1]} onClick={opcion ? () => actualizarQuiz(respuesta[orden][1]) : () =>{}}>
        <p><b>B</b></p> <p className="single-option">{respuesta[orden][1]}</p>
      </div>
      <div className={estilos[2]} onClick={opcion ? () => actualizarQuiz(respuesta[orden][2]) : () =>{}}>
        <p><b>C</b></p> <p className="single-option">{respuesta[orden][2]}</p>
      </div>
      <div className={estilos[3]} onClick={opcion ? () => actualizarQuiz(respuesta[orden][3]) : () =>{}}>
        <p><b>D</b></p> <p className="single-option">{respuesta[orden][3]}</p>
      </div>
      <button onClick={orden != 9  ? actualizarBoton : finJuego} className={isOn ? estiloBoton : 'button-next'}><b>{orden === 9 ?`Ver Puntuación`:`Siguiente`}</b></button>
    </div>
  );
}


