import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBp0aLTOaUqVfvGR0x0-Q_7hLJVfVIAKS4",
  authDomain: "examen-400fd.firebaseapp.com",
  projectId: "examen-400fd",
  storageBucket: "examen-400fd.appspot.com",
  messagingSenderId: "828271322701",
  appId: "1:828271322701:web:b1ff6ab6e85c90dfa15e04",
  measurementId: "G-JTV5NWRM7C"
};


const app = firebase.initializeApp(firebaseConfig);


const db = firebase.firestore(app);


document.getElementById('formularioEmpleado').addEventListener('submit', añadirEmpleado);

function añadirEmpleado(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const puesto = document.getElementById('puesto').value;
    const telefono = document.getElementById('telefono').value;
    const remoto = document.getElementById('remoto').checked;

    if (!nombre || !apellido || !puesto || !telefono) {
        alert('Por favor, completa todos los campos');
        return;
    }


    db.collection('empleados').add({
        nombre,
        apellido,
        puesto,
        telefono,
        remoto
    })
    .then((docRef) => {
        console.log("Documento escrito con ID: ", docRef.id);
        mostrarEmpleado({ nombre, apellido, puesto, telefono, remoto });
    })
    .catch((error) => {
        console.error("Error añadiendo el documento: ", error);
    });

    document.getElementById('formularioEmpleado').reset();
}

function mostrarEmpleado(empleado) {
    const listaEmpleados = document.getElementById('listaEmpleados');
    const itemEmpleado = document.createElement('div');
    itemEmpleado.className = 'item-empleado';

    const urlAvatar = `https://api.multiavatar.com/${empleado.nombre}${empleado.apellido}.png`;

    itemEmpleado.innerHTML = `
        <img src="${urlAvatar}" alt="${empleado.nombre} ${empleado.apellido}">
        <div>
            <h3>${empleado.nombre} ${empleado.apellido}</h3>
            <p>${empleado.puesto}</p>
            <p>${empleado.telefono}</p>
            <p>${empleado.remoto ? 'Trabaja de forma remota' : 'Trabaja en la oficina'}</p>
        </div>
        <button onclick="eliminarEmpleado(this)">Eliminar</button>
    `;

    listaEmpleados.appendChild(itemEmpleado);
}


function cargarEmpleados() {
    db.collection('empleados').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            mostrarEmpleado(doc.data());
        });
    });
}

cargarEmpleados();

function eliminarEmpleado(boton) {
    const itemEmpleado = boton.parentElement;
    const nombre = itemEmpleado.querySelector('h3').innerText.split(' ')[0];
    const apellido = itemEmpleado.querySelector('h3').innerText.split(' ')[1];

    // Eliminar empleado de Firestore
    db.collection('empleados')
        .where("nombre", "==", nombre)
        .where("apellido", "==", apellido)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete().then(() => {
                    console.log("Documento eliminado con ID: ", doc.id);
                    itemEmpleado.remove();
                }).catch((error) => {
                    console.error("Error eliminando el documento: ", error);
                });
            });
        }).catch((error) => {
            console.error("Error obteniendo el documento: ", error);
        });
}
