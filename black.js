function operacionReiniciar(tiempo) {
    setTimeout(() => {
      location.reload();
    }, tiempo);
  }
  
  //boton para reiniciar el juego
  var boton_reiniciar = document.querySelector("#reiniciar");
  boton_reiniciar.addEventListener("click", () => {
    operacionReiniciar(0);
  });
  
  //Se genera los arrays de los valores de las cartas y los logos
  const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  const palo = ["-H", "-S", "-D", "-C"];
  var baraja = [];
  
  //se genera un array con la combinacion de las 52 cartas (la baraja)
  function crearBaraja() {
    baraja = [];
    for (let i = 0; i < valores.length; i++) {
      for (let j = 0; j < palo.length; j++) {
        baraja.push(valores[i] + palo[j]);
      }
    }
    return baraja;
  }
  
  crearBaraja();
  
  //se genera una funcion que entrega una carta de manera aleatoria y con su valor nominal
  var cartajugada = 0;
  var valor = 0;
  
  function pedircarta() {
    const random = Math.floor(Math.random() * baraja.length);
    cartajugada = baraja[random];
    valor = cartajugada.substring(0, cartajugada.indexOf("-"));
    if (valor === "J" || valor === "Q" || valor === "K") {
      valor = 10;
    } else {
      valor = valor;
    }
  
    valor = parseInt(valor);
    baraja.splice(random, 1);
  }
  
  /* turno jugador
  se genera el array con las cartas del jugador
  se se generan las cartas en el dom
  se controla el valor del As
  se suma los valore del array */
  var contadorJu = 0;
  var verificar = 0;
  let cartaJugador = [];
  let puntajejugador = [];
  var contenedorJugador = document.querySelector("#cartas-jugador");
  
  function turnojugador() {
    pedircarta();
    cartaJugador.push(cartajugada);
    puntajejugador.push(valor);
    valorA(sumaJ);
    sumar();
  }
  
  /* turno crupier
  se genera el array con las cartas del jugador
  se se generan las cartas en el dom
  se controla el valor del As
  se suma los valore del array */
  var sumaRefe = 0;
  let cartaCrup = [];
  let puntajeCrup = [];
  function turnoCr() {
    pedircarta();
    cartaCrup.push(cartajugada);
    puntajeCrup.push(valor);
    valorA(sumaC);
    sumar();
  }
  
  //sumar valores del array de las cartas del jugador y del crupier
  var sumaJ = 0;
  var sumaC = 0;
  
  function sumar() {
    sumaJ = puntajejugador.reduce(
      (acumulador, valorActual) => acumulador + valorActual,
      0
    );
    sumaC = puntajeCrup.reduce(
      (acumulador, valorActual) => acumulador + valorActual,
      0
    );
  
    //Mostrar los valores de la suma de las cartas del array de las cartas del jugador y la posicion 0 del array de las cartas de crupier en el DOM
    document.querySelector("#totalj").innerText = sumaJ;
    document.querySelector("#totalc").innerText = sumaC;
  }
  
  //funcion  para determinar el valor del As
  function valorA(suma) {
    if (valor === 1)
      if (suma >= 11) {
        valor = 1;
      } else {
        valor = 11;
      }
    else {
      valor = valor;
    }
    return valor;
  }
  
  // para pedir carta
  var contadorJu = 3;
  var contadorCru = 2;
  var verificar = 0;
  
  var boton_iniciar = document.querySelector("#pedirCarta");
  
  boton_iniciar.addEventListener("click", () => {
    sumar();
  
  
    // verificar el cambio del botón
    if (verificar == 0) {
      iniciar_juego();
      verificar++;
    } else if (sumaJ <= 21) {
      turnojugador();
      crearCarta(contadorJu);
      contadorJu++;
    }
  
    // verificar el número antes de salir del evento
    if(verificarJug(sumaJ) === true) {
      setTimeout(() => {
        alert("Perdiste 😫");
      }, 500);
      operacionReiniciar(1000);
    } else if(verificarJug(sumaJ) === false) {
      setTimeout(() => {
        alert("Ganaste 🤑");
      }, 500);
      operacionReiniciar(1000);
    }
  });
  
  function verificarJug(suma) {
    if(suma > 21) {
      return true;
    } else if(suma === 21) {
      return false;
    }
  }
  
  function iniciar_juego() {
    for (let i = 0; i <= 1; i++) {
      turnojugador();
    }
  
    turnoCr();
  
    var carta2Cru = document.querySelector("#cartac2");
    carta2Cru.setAttribute("src", "./Cards/" + cartaCrup[0] + ".png");
  
    var carta1Ju = document.querySelector("#cartaj1");
    carta1Ju.setAttribute("src", "./Cards/" + cartaJugador[0] + ".png");
  
    var carta2Ju = document.querySelector("#cartaj2");
    carta2Ju.setAttribute("src", "./Cards/" + cartaJugador[1] + ".png");
  
    boton_iniciar.innerHTML = "Pedir Carta";
    boton_quedarse.removeAttribute('disabled');
  }
   function crearCarta(idJ) {
    var contenedorJugador=document.querySelector("cartas-jugador")
    var cartaNewJu = document.createElement("div");
    cartaNewJu.className = "cartasju";
  
    var imagenCarta = document.createElement("img");
    imagenCarta.setAttribute("id", "cartaj" + idJ);
    imagenCarta.setAttribute("src", "./Cards/" + cartaJugador[idJ - 1] + ".png");
    cartaNewJu.appendChild(imagenCarta);
    contenedorJugador.append(cartaNewJu);
  }
   










  //Cuando el jugador decide quedarse o plantarse, se le entrega cartas aleatorias al crupier mientra su suma sea menor a 21, si se sobrepasa se evaluan las condiciones
  var boton_quedarse = document.querySelector("#quedarse");
  
  // desactivar el botón quedarse si no se ha iniciado el juego
  if(verificar == 0) {
    boton_quedarse.setAttribute('disabled', true);
  }
  
  boton_quedarse.addEventListener("click", () => {
  
    while (sumaC <= 21) {
        boton_iniciar.setAttribute('disabled', true);
        turnoCr();
        crearTarjetaCrup(contadorCru);
        contadorCru++;
        document.querySelector("#totalc").innerText = sumaC;
  
        if(
          verificarCrup(sumaC) === sumaJ ||
          verificarCrup(sumaC) === 21
          ) {
  
          setTimeout(() => {
            alert("Crupier ganó 🤖");
          }, 800);
          operacionReiniciar(1000);
          return sumaC === 21;
  
        } else if (verificarCrup(sumaC) === true) {
  
          setTimeout(() => {
            alert("Crupier ganó 🤖");
          }, 800);
          operacionReiniciar(1000);
          return sumaC === 21;
  
        } else if (verificarCrup(sumaC) > 21){
          setTimeout(() => {
            alert("Ganaste 🤑");
          }, 800);
          operacionReiniciar(1000);
          return sumaC === 21;
        }
    }
  });
  
  function verificarCrup(suma) {
    if (suma > sumaJ && suma <= 21) {
      return true;
    } else {
      return suma;
    }
  }
  
  function crearTarjetaCrup(idCru) {
    var contenedorCrup = document.querySelector('#cartas-crupier')
    var caraNewCru = document.createElement("div");
    caraNewCru.className = "cartacru";
  
    var imagenCartaCru = document.createElement("img");
    imagenCartaCru.setAttribute("id", "cartac" + idCru);
    imagenCartaCru.setAttribute("src", "./Cards/" + cartaCrup[idCru - 1] + ".png");
    caraNewCru.appendChild(imagenCartaCru);
    contenedorCrup.append(caraNewCru);
  }