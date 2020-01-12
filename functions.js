let message="";
function errorPassword(password){
    let error=true;
    if (password.length < 8) {
        message='Error, la contraseña debe tener al menos 8 caracteres';
    } else if (!/^.*[a-z].*$/.test(password)) {
        message='Error, la contraseña debe tener al menos una letra minúscula';
       
    } else if (!/^.*[A-Z].*$/.test(password)) {
        message='Error, la contraseña debe tener al menos una letra mayúscula';
        
    } else if (!/^.*[0-9].*$/.test(password)) {
        message='Error, la contraseña debe tener al menos un número'; 
    }else{
        error=false;
    }
    if(message.length>0){
        alert(message);
    }
    return error;
}



function toggleSignIn() {
    if (firebase.auth().currentUser) {

        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        if(errorPassword(password)){
            alert(message);
            return;
        }

        if (!/^.*@.*$/.test(email)) { //Introducir expresión regular que controle que sea un email o teléfono
            alert('Por favor, introduce un email válido');
            return;
        }
        
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Error, contraseña incorrecta');
            } else if (errorCode === 'auth/invalid-email') {
                alert('Error, email no válido');
            } else {
                alert(errorMessage);
            }
           
            document.getElementById('quickstart-sign-in').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = true;
}
/**
 * Handles the sign up button press.
 */
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (!/^.*@.*$/.test(email)) {
        alert('Por favor, introduce un email válido');
        return;
    }
    if(errorPassword(password)){
        return;
    }
    // Create user with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('Por favor, introduce una contraseña válida. Los criterios para la contraseña son:');
        } else if (errorCode === 'auth/invalid-email') {
            alert('Error, email no válido');
        } else {
            alert(errorMessage);
        }
        
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}



/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {
        // [START_EXCLUDE silent]

        // [END_EXCLUDE]
        if (user) {
            // User is signed in.

            // [START_EXCLUDE]
            window.location.href="https://proyectopractica-a86c7.firebaseapp.com/extra/index.html";
           /* var invocation = new XMLHttpRequest();
            var url = 'https://proyectopractica-a86c7.firebaseapp.com/map';              
             
                invocation.open('GET', url, true);
                
                invocation.send(); 
              
            */
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('email').style.display = 'inline';
            document.getElementById('password').style.display = 'inline';
            document.getElementById('quickstart-sign-in').textContent = 'Entrar';
            document.getElementById('quickstart-user-details-container').textContent = 'Usuario no logueado';


            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);

}
window.onload = function () {
    initApp();
};