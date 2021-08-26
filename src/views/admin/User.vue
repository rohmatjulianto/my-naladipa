<template>
  <v-container>
    <v-card elevation="2" outlined shaped tile max-width="400">
      <div class="text-center ma-6">
        <v-icon x-large>mdi-account</v-icon>
      </div>

      <v-card-text>
        <div class="profile">
          <div class="label">Email</div>
          <div class="content">{{ email }}</div>
        </div>

        <div class="profile">
          <div class="label">Creation time</div>
          <div class="content">{{ createTime }}</div>
        </div>

        <div class="profile">
          <div class="label">Last login</div>
          <div class="content">{{ lastLogin }}</div>
        </div>
      </v-card-text>

      <v-card-actions class="justify-end mx-5">
        <!-- change pass dialog -->
        <v-dialog
          transition="dialog-top-transition"
          v-model="dialogChange"
          max-width="560"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="text-capitalize mx-1 mb-4"
              color="primary"
              @click="dialogChange = true"
              v-bind="attrs"
              v-on="on"
              dark
              >Change password</v-btn
            >
          </template>
          <template>
            <v-card>
              <v-toolbar color="primary" dark>
                <v-icon icon left>mdi-alert-circle</v-icon>
                Change password
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  @click="
                    dialogChange = false;
                    errorMessage = null;
                  "
                >
                  <v-icon icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>

              <v-alert
                outlined
                type="error"
                v-if="errorMessage"
                class="alert ma-5"
              >
                {{ errorMessage }}
              </v-alert>

              <div class="justify-end mx-5 mt-8">
                <v-form ref="formChange" lazy-validation v-model="change">
                  <v-text-field
                    v-model="oldPass"
                    label="Type old password"
                    type="password"
                    :rules="[(v) => !!v || 'Password is required']"
                    outlined
                    required
                  >
                  </v-text-field>

                  <v-text-field
                    v-model="newPass"
                    label="Type new password"
                    type="password"
                    :rules="newPassRules"
                    outlined
                    required
                  >
                  </v-text-field>

                  <v-text-field
                    v-model="retypePass"
                    label="Re-type new password"
                    type="password"
                    :rules="retypeRules"
                    outlined
                    required
                  >
                  </v-text-field>
                </v-form>

                <v-btn
                  class="mb-5 text-capitalize"
                  color="primary"
                  :loading="loading"
                  :disabled="!change"
                  @click="changePassUser"
                  >Change password
                </v-btn>
              </div>
            </v-card>
          </template>
        </v-dialog>

        <!-- dialog delete pass -->
        <v-dialog transition="dialog-top-transition" max-width="360">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="text-capitalize mb-4"
              color="red"
              v-bind="attrs"
              v-on="on"
              dark
              >Delete</v-btn
            >
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="red" dark>
                <v-icon icon left>mdi-alert-circle</v-icon>
                Delete
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  @click="
                    dialog.value = false;
                    errorMessage = null;
                  "
                >
                  <v-icon icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-alert
                outlined
                type="error"
                v-if="errorMessage"
                class="alert ma-5"
              >
                {{ errorMessage }}
              </v-alert>
              <v-card-subtitle class="mt-4">
                Delete user {{ email }}? Please type your password to confirm.
              </v-card-subtitle>

              <v-card-text>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  :rules="[(v) => !!v || 'Password is required']"
                  outlined
                  required
                >
                </v-text-field>

                <v-btn
                  class="text-capitalize"
                  color="warning"
                  :loading="loading"
                  :disabled="!password"
                  @click="deleteUser"
                  >Delete
                </v-btn>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </v-card-actions>
    </v-card>

    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" top>
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase";
import { auth } from "../../firebaseConfig";

export default {
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      auth.onAuthStateChanged((user) => {
        this.email = user.email;
        this.createTime = user.metadata.creationTime;
        this.lastLogin = user.metadata.lastSignInTime;
      });
    },

    deleteUser() {
      this.loading = true;
      var cred = firebase.auth.EmailAuthProvider.credential(
        this.email,
        this.password
      );
      auth.currentUser
        .reauthenticateWithCredential(cred)
        .then(() => {
          auth.currentUser
            .delete()
            .then(() => {
              this.loading = false;
              this.$session.remove("email");
              this.toAuth();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          this.loading = false;
          this.errorMessage = error.code;
        });
    },
    changePassUser() {
      this.loading = true;
      var cred = firebase.auth.EmailAuthProvider.credential(
        this.email,
        this.oldPass
      );
      auth.currentUser
        .reauthenticateWithCredential(cred)
        .then(() => {
          auth.currentUser
            .updatePassword(this.newPass)
            .then(() => {
              this.dialogChange = false;
              this.loading = false;
              this.snackbar =true;
              this.message = "Password has been change"
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          this.loading = false;
          this.errorMessage = error.code;
        });
    },
    toAuth() {
      this.$router.push("/auth");
    },
  },
  data() {
    return {
      loading: false,
      snackbar: false,
      text: `Hello, I'm a snackbar`,
      email: "",
      password: "",
      createTime: "",
      lastLogin: "",
      errorMessage: "",
      message:"",
      dialogChange: false,
      change: false,
      oldPass: "",
      newPass: "",
      newPassRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 6 || "Password minimum 6 characters",
      ],
      retypePass: "",
      retypeRules: [
        (v) => !!v || "Password is required",
        (v) => v == this.newPass || "Password not match",
        (v) => v.length >= 6 || "Password minimum 6 characters",
      ],
    };
  },
};
</script>

<style lang="scss">
.profile {
  padding: 10px;
}
.profile .content {
  font-weight: bold;
}
</style>