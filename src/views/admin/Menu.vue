<template>
  <v-container>
    <v-dialog
      v-model="dialogChange"
      transition="dialog-top-transition"
      max-width="560"
    >
      <template>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-icon icon left>mdi-alert-circle</v-icon>
            {{ restChange.title }}
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="resetform"
            >
              <v-icon icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <div class="justify-end mx-5 mt-8">
            <v-form ref="form" lazy-validation v-model="valid">
              <v-img :src="restChange.url" max-width="100"></v-img>
              <v-file-input
                show-size
                v-model="restChange.image"
                truncate-length="8"
                label="Foto"
                accept="image/*"
                clearable
                prepend-icon="mdi-camera"
                :rules="[(v) => !!v || 'Image required']"
                @change="onFilePicked"
                @click:clear="onClear"
              >
                <template v-slot:selection="{ text }">
                  <v-chip small label color="primary">
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>

              <v-textarea
                rows="3"
                row-height="30"
                auto-grow
                v-model="restChange.description"
                :rules="[(v) => !!v || 'Description required']"
                label="Description"
                outlined
                required
              ></v-textarea>
            </v-form>

            <v-btn
              class="mb-5 text-capitalize"
              color="primary"
              :loading="loading"
              :disabled="!valid"
              @click="onSubmit"
              >Submit
            </v-btn>
          </div>
        </v-card>
      </template>
    </v-dialog>

    <v-row>
      <v-col v-for="(rest, i) in result" :key="i" cols="12" md="4">
        <v-card class="my-6">
          <v-card-title> {{ rest.title }}</v-card-title>
          <img class="ma-8" :src="rest.image" alt="" width="100" srcset="" />
          <v-card-text>
            {{ rest.desc }}
          </v-card-text>

          <v-card-actions>
            <v-btn
              class="text-capitalize mx-1 mb-4"
              color="warning"
              @click="onChange(i)"
              dark
              >Edit</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { store, storage } from "../../firebaseConfig";
export default {
  created() {
    var task = [];
    const db = store.collection("menu");
    const observer = db.onSnapshot((docSnapshot) => {
      task.splice(0);
      docSnapshot.forEach((datas) => {
        var id = datas.id;
        var title = datas.get("title");
        var image = datas.get("image");
        var desc = datas.get("description");
        task.push({
          id: id,
          title: title,
          image: image,
          url: null,
          desc: desc,
        });
      });
    });
    observer;
    this.result = task;
  },
  data() {
    return {
      dialogChange: false,
      editState: [],
      result: [],
      restChange: {
        id: "",
        image: "",
        url: "",
        description: "",
        title: "",
      },
      valid: true,
      loading: false,
    };
  },
  methods: {
    onChange(i) {
      this.dialogChange = true;
      this.restChange.id = this.result[i].id;
      this.restChange.description = this.result[i].desc;
      this.restChange.url = this.result[i].image;
      this.restChange.title = this.result[i].title;
      console.log(this.restChange);
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const db = store.collection("menu").doc(this.restChange.id);
        db.update({
          description: this.restChange.description,
        }).then(() => {
          this.uploadImage(this.restChange.id);
        });
      }
    },

    uploadImage(id) {
      const files = this.restChange.image;
      const path = id + "/" + files.name;
      storage
        .ref(path)
        .put(files)
        .then((snapshot) => {
          if (snapshot.state == "success") {
            storage
              .ref(path)
              .getDownloadURL()
              .then((url) => {
                this.updateImageUrl(id, url);
              });
          }
        });
    },
    updateImageUrl(id, url) {
      const db = store.collection("menu").doc(id);
      db.update({ image: url }).then(() => {
        this.loading = false;
        this.dialogChange = false;
        this.resetform()
      });
    },
    onFilePicked() {
      if (window.FileReader) {
        const files = this.restChange.image;
        const fr = new FileReader();
        fr.readAsDataURL(files);
        fr.addEventListener("load", () => {
          this.restChange.url = fr.result;
        });
      }
    },

    resetform() {
      this.dialogChange = false
      this.restChange.id = null;
      this.restChange.description = null;
      this.restChange.image = null;
      this.restChange.url = null;
      this.restChange.title = null;
      this.$refs.form.resetValidation()
    },
    showHideForm(con) {
      this.btnAdd = !con;
    },
    onClear() {
      this.image.url = null;
    },
    clearDesc(i) {
      this.description.splice(i, 1);
    },
    addDesc() {
      this.description.push({ text: null });
    },
  },
};
</script>

