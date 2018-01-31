
const authentication = {
    inputEmail: $("#email"),
    inputPass: $("#pass"),
    logBtn: $("#login-button"),
    signBtn: $("#signup-button"),
    signoutBtn: $("#signout-button"),
    
    /*
    auth.createUserWithEmailAndPassword(email, pass);
    auth.onAuthStateChanged(firebase => {});
    */
};

$(authentication.logBtn).click(e => {
    const email = authentication.inputEmail.val();
    const pass = authentication.inputPass.val();

    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message))
});
