firebase.initializeApp(config);

const auth = firebase.auth();

let uid = "";

const authentication = {
    inputEmail: $("#email"),
    inputPass: $("#password"),
    logBtn: $("#login-button"),
    signBtn: $("#signup-button"),
    signoutBtn: $("#signout-button"),
    
    /*
    auth.createUserWithEmailAndPassword(email, pass);
    auth.onAuthStateChanged(firebase => {});
    */
};

$("#signout-button").click(e => {
    auth.signOut()
    $("#signout-button").css("visibility","hidden")
})

$(authentication.logBtn).click(e => {
    const email = authentication.inputEmail.val();
    const pass = authentication.inputPass.val();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));

    $("#signout-button").css("visiblity","visible")
});

$(authentication.signBtn).click(e => {
    const email = authentication.inputEmail.val();
    const pass = authentication.inputPass.val();
    console.log("signup clicked")

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
    $("#signout-button").css("visibility","visible")
})

auth.onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
        console.log(firebaseUser)
        console.log(firebaseUser.uid)
        uid = firebaseUser.uid;
        console.log(uid)
        $("#signout-button").css("visibility","visible")
        


    } else {
        console.log("not logged in")
    }
})