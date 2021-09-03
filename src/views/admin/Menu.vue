<template>
  <v-container>
    <v-row>
      <v-col v-for="(rest, i) in result" :key="i" cols="12" md="4">
        <v-card class="my-6">
          <v-card-title> {{ rest.title }}</v-card-title>
          <img class="ma-8" :src="rest.image" alt="" width="100" srcset="" />

          <v-card-text>
            <v-file-input
              v-if="editState[i].editable"
              show-size
              v-model="imag"
              truncate-length="8"
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

            <v-textarea
              rows="3"
              row-height="30"
              auto-grow
              v-model="rest.desc"
              :rules="[(v) => !!v || 'Description required']"
              label="Description"
              outlined
              required
              :readonly="!editState[i].editable"
            ></v-textarea>
            <v-btn
              color="warning"
              v-if="!editState[i].editable"
              dark
              @click="canEdit(i)"
            >
              Edit
            </v-btn>
            <v-btn color="success" v-if="editState[i].editable" dark>
              Save
            </v-btn>
          </v-card-text>

          <v-card-actions> </v-card-actions>
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
    const db = store.collection("menu");
    const observer = db.onSnapshot((docSnapshot) => {
      task.splice(0);
      docSnapshot.forEach((datas) => {
        var id = datas.id;
        var title = datas.get("title");
        var image = datas.get("image");
        var desc = datas.get("description");
        task.push({ id: id, title: title, image: image, desc: desc });
        this.editState.push({ editable: false });
      });
    });
    observer;
    this.result = task;
  },
  data() {
    return {
      editState: [],
      result: [],
      btnAdd: true,
      loading: false,
      valid: true,
      title: null,
      link: null,
    };
  },
  methods: {
    canEdit(i) {
      this.editState[i].editable = true;
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const db = store.collection("wanasuta").doc();
        db.set({
          id: this.result.length,
          title: this.title,
          link: this.link,
        }).then(() => {
          this.loading = false;
          this.resetform();
        });
      }
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

