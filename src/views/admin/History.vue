<template>
  <v-container>
    <v-btn
      color="success"
      v-if="btnAdd"
      @click="showHideForm(true)"
      class="mb-5"
    >
      Add Sejarah
    </v-btn>
    <v-card v-if="!btnAdd">
      <v-card-title>
        Add Sejarah
        <v-spacer></v-spacer>
        <v-btn icon @click="showHideForm(false)">
          <v-icon icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-img
            v-if="image.url"
            class="my-4"
            width="200"
            max-height="200"
            :src="image.url"
          ></v-img>
          <v-file-input
            show-size
            v-model="image.name"
            label="Foto"
            accept="image/*"
            prepend-icon="mdi-camera"
            :rules="[(v) => !!v || 'Image required']"
            @change="onFilePicked()"
            @click:clear="onClear()"
          >
            <template v-slot:selection="{ text }">
              <v-chip small label color="primary">
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
          <h5 class="mt-4 mb-2">Description</h5>
          <div v-for="(desc, i) in description" :key="i">
            <v-textarea
              rows="4"
              row-height="30"
              auto-grow
              v-model="desc.text"
              :rules="[
                (v) => !!v || 'Paragraf ' + parseInt(i + 1) + ' required',
              ]"
              :label="'Paragraf ' + parseInt(i + 1)"
              outlined
              required
            >
              <template v-slot:append>
                <v-btn
                  color="red"
                  dark
                  v-if="i != description.length - 1"
                  @click="clearDesc"
                >
                  <v-icon> mdi-close</v-icon>
                </v-btn>

                <v-btn
                  color="success"
                  dark
                  v-if="i == description.length - 1"
                  @click="addDesc"
                >
                  <v-icon> mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-textarea>
          </div>
        </v-form>
        <v-btn
          color="primary"
          :disabled="!valid"
          :loading="loading"
          @click="onSubmit"
          >Submit</v-btn
        >
      </v-card-text>
    </v-card>

    <!-- rows item result fire -->
    <v-row>
      <v-col v-for="(rest, i) in result" :key="i" cols="12" md="2">
        <v-card class="my-12">
          <v-img :src="rest.image" alt="" srcset=""></v-img>
          <v-card-text> {{ rest.desc[0].substring(0, 200) }} </v-card-text>
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
    const db = store.collection("sejarah");
    const observer = db.onSnapshot((docSnapshot) => {
      task.splice(0);
      docSnapshot.forEach((datas) => {
        var desc = datas.get("description");
        var image = datas.get("image");
        task.push({ image: image, desc: desc });
      });
    });
    observer;
    this.result = task;
    console.log(task);
  },
  data() {
    return {
      result: [],
      btnAdd: true,
      loading: false,
      valid: true,
      image: {
        name: null,
        url: null,
      },
      description: [{ text: null }],
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const db = store.collection("sejarah").doc();
        var desc = [];
        this.description.forEach((data) => {
          desc.push(data.text);
        });
        db.set({
          id: this.result.length,
          image: null,
          description: desc,
        });
        this.uploadImage(db.id);
      }
    },

    uploadImage(id) {
      const files = this.image.name;
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
                this.loading = false;
                this.resetform();
                this.showHideForm(false);
              });
          }
        });
    },
    updateImageUrl(id, url) {
      const db = store.collection("sejarah").doc(id);
      db.update({ image: url });
    },
    onFilePicked() {
      if (window.FileReader) {
        const files = this.image.name;
        const fr = new FileReader();
        fr.readAsDataURL(files);
        fr.addEventListener("load", () => {
          this.image.url = fr.result;
        });
      }
    },

    resetform() {
      this.$refs.form.reset();
      this.image.name = null;
      this.image.url = null;
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

