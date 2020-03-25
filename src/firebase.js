import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

export default class Firebase {
  constructor(config) {
    app.initializeApp(config)

    /* Firebase APIs */
    this.auth = app.auth()
    this.db = app.firestore()
    this.storage = app.storage()

    this.googleProvider = new app.auth.GoogleAuthProvider()

    /* Helper */
    this.fieldValue = app.firestore.FieldValue
    this.emailAuthProvider = app.auth.EmailAuthProvider
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider)

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({ url: "http://localhost:3000", });

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.admin(authUser.uid)
          .get()
          .then(snapshot => {
            if (snapshot.exists) {
              const dbUser = snapshot.data()
              // default empty roles
              if (!dbUser.roles) {
                dbUser.roles = {}
              }
              // merge auth and db user
              authUser = {
                uid: authUser.uid,
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                providerData: authUser.providerData,
                ...dbUser
              }
              next(authUser)
            }
          })
      } else {
        fallback()
      }
    })

  recaptchaVerifier = (container, parameters) =>
    new app.auth.RecaptchaVerifier(container, parameters);

  doSignInWithPhoneNumber = (phoneNumber, applicationVerifier) => {
    // this.auth.settings.appVerificationDisabledForTesting = true;
    return this.auth.signInWithPhoneNumber(phoneNumber, applicationVerifier);
  }

  getIdToken = () => {
    return this.auth.currentUser.getIdToken(true);
  }

	// *** User API ***
	admin = uid => this.db.doc(`admins/${uid}`)
	admins = () => this.db.collection('admins')
}
