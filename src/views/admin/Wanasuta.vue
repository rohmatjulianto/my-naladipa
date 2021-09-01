<template>
  <v-container>
    <v-btn
      color="success"
      v-if="btnAdd"
      @click="showHideForm(true)"
      class="mb-5"
    >
      Add Link
    </v-btn>
    <v-card v-if="!btnAdd">
      <v-card-title>
        Add Link
        <v-spacer></v-spacer>
        <v-btn icon @click="showHideForm(false)">
          <v-icon icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="title"
            :rules="[(v) => !!v || 'Title required']"
            label="Title"
            outlined
            required
          ></v-text-field>

          <v-text-field
            v-model="link"
            :rules="[(v) => !!v || 'Link required']"
            label="Link"
            outlined
            required
          ></v-text-field>
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
        <v-card-title> {{rest.title}}</v-card-title>
          <v-card-text> {{ rest.link}} </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { store } from "../../firebaseConfig";
export default {
  created() {
    var task = [];
    const db = store.collection("wanasuta");
    const observer = db.onSnapshot((docSnapshot) => {
      task.splice(0);
      docSnapshot.forEach((datas) => {
        var title = datas.get("title");
        var link = datas.get("link");
        task.push({ title: title, link:link });
      });
    });
    observer;
    this.result = task;
  },
  data() {
    return {
      result: [],
      btnAdd: true,
      loading: false,
      valid: true,
      title:null,
      link:null
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const db = store.collection("wanasuta").doc();
        db.set({
          id: this.result.length,
          title: this.title,
          link: this.link
        }).then(()=>{
            this.loading = false
            this.resetform()
        });
    
      }
    },

    resetform() {
      this.$refs.form.reset();
      this.showHideForm(false)
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

