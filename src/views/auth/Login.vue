<template>
  <v-container fluid>
    <v-card class="mx-auto pa-10 mt-10" max-width="590" justify="center">
      <v-img
        src="https://firebasestorage.googleapis.com/v0/b/naladipa-833a2.appspot.com/o/logo%2FIMG_3948.JPG?alt=media&token=ffb0b6dd-775f-4637-848a-9e05acbea421"
        width="120"
        class="mx-auto mb-10"
      ></v-img>
      <div class="title" align="center">Sign in <br />Admin Naladipa</div>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="email"
          type="email"
          label="Email"
          :rules="emailRules"
          required
        >
        </v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          :rules="[(v) => !!v || 'Password is required']"
          required
        >
        </v-text-field>

        <v-btn
          color="primary mt-5"
          class="form-control"
          :loading="loading"
          :disabled="loading"
          @click="auth"
        >
          Login
        </v-btn>
        <v-btn color="warning mt-5 mx-5" class="form-control" @click="reset">
          Reset
        </v-btn>
      </v-form>

      <v-alert dense outlined type="error" v-if="alert" class="mt-5">
        {{ alertMessage }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script>
import { auth } from "../../firebaseConfig";
export default {
  name: "login",
  created(){
    var session = this.$session.get("email")
    if(session){
      this.toApp()
    }
  },
  methods: {
    auth() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.signIn();
      }
    },

    reset() {
      this.$refs.form.reset();
    },
    setSession() {
      this.$session.set("email", this.email);
      console.log(this.$session.getAll());
    },
    toApp() {
      this.$router.push("/");
    },
    signIn() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.loading = false;
          this.setSession();
          this.toApp();
        })
        .catch((error) => {
          this.loading = false;
          this.alert = true;
          this.alertMessage = error.message;
        });
    },
    createUser() {
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          console.log(user);

          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode + errorMessage);
          // ..
        });
    },

    signOut() {
      auth
        .signOut()
        .then(() => {
          // Sign-out successful.
          console.log("succes");
        })
        .catch((error) => {
          // An error happened.
          console.log(error);
        });
    },
  },

  data() {
    return {
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      password: "",
      valid: false,
      alert: false,
      alertMessage: "",
      loading: false,
    };
  },
};
</script>

<style lang="scss">
#title {
  font-size: 24px;
  font-style: normal;
}
