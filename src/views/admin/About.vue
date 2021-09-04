<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="link"
        :rules="[(v) => !!v || 'Link required']"
        label="link"
        outlined
        required
        :readonly="!edit"
      ></v-text-field>

      <v-textarea
        v-model="description"
        rows="2"
        :rules="[(v) => !!v || 'Description required']"
        label="Description"
        outlined
        required
        :readonly="!edit"
      ></v-textarea>
    </v-form>

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
  </v-container>
</template>

<script>
import { store } from "../../firebaseConfig";
export default {
  created() {
    const db = store.collection("tentang").doc("get");
    const observer = db.onSnapshot((datas) => {
      var desc = datas.get("description");
      var link = datas.get("link");
      this.link = link;
      this.description = desc;
    });
    observer;
  },
  data() {
    return {
      edit: false,
      result: [],
      btnAdd: true,
      loading: false,
      valid: true,
      description: null,
      link: null,
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const db = store.collection("tentang").doc("get");
        db.update({
          description: this.description,
          link: this.link,
        }).then(() => {
          this.loading = false;
          this.edit = false
        });
      }
    },

    onEdit(){
        this.edit = true
    },

    resetform() {
      this.$refs.form.reset();
      this.showHideForm(false);
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

