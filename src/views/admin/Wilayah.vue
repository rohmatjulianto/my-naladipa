<template>
  <v-container>
    <div>Luas {{ info.luas }}</div>
    <div>Dusun {{ info.dusun }}</div>
    <div>Rt {{ info.rt }}</div>
    <div>Rw {{ info.rw }}</div>

    <v-form ref="form" class="mt-4" v-model="valid" lazy-validation>
      <v-textarea
        v-model="description"
        auto-grow
        rows="2"
        :rules="[(v) => !!v || 'Description required']"
        label="Description"
        outlined
        required
        :readonly="!edit"
      >
        <template v-slot:append>
          <v-btn
            color="warning"
            :disabled="!valid"
            :loading="loading"
            @click="onEdit"
            v-if="!edit"
            >edit</v-btn
          >

          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="loading"
            @click="onSubmit"
            v-if="edit"
            >Submit</v-btn
          >
        </template>
      </v-textarea>
    </v-form>

    <div class="my-5">Peta Rupa Bumi dan Geologi Regional</div>
    <v-row>
      <v-col cols="12" md="4" v-for="(img, i) in image" :key="i">
        <v-card>
          <v-img :src="img"></v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { store } from "../../firebaseConfig";
export default {
  created() {
    const db = store.collection("wilayah").doc("about");
    const observer = db.onSnapshot((datas) => {
      var desc = datas.get("description");
      var dusun = datas.get("dusun");
      var luas = datas.get("luas");
      var rt = datas.get("rt");
      var rw = datas.get("rw");
      this.description = desc;
      this.info = { dusun, luas, rt, rw };
    });

    const dbImage = store.collection("wilayah").doc("image").collection("list");
    dbImage.onSnapshot((dataSnapshot) => {
      this.image.splice(0);
      dataSnapshot.forEach((data) => {
        this.image.push(data.get("url"));
      });
    });
    observer;
  },
  data() {
    return {
      edit: false,
      image: [],
      btnAdd: true,
      loading: false,
      valid: true,
      description: null,
      info: null,
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const db = store.collection("wilayah").doc("about");
        db.update({
          description: this.description,
        }).then(() => {
          this.loading = false;
          this.edit = false;
        });
      }
    },

    onEdit() {
      this.edit = true;
    },

    resetform() {
      this.$refs.form.reset();
      this.showHideForm(false);
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

