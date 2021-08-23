<template>
  <v-app>
    <v-app-bar
      clipped-left
      app
      v-if="this.$router.currentRoute.name !== 'Login'"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Naladipa</v-toolbar-title>
      <v-spacer></v-spacer>
      <h3 class="mx-8">{{ email }}</h3>
      <v-btn small color="error" @click="logout"> Logout </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
      v-if="this.$router.currentRoute.name !== 'Login'"
    >
      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          router-link-active
          :to="item.link"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="item-title">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>



<script>
import { auth } from "./firebaseConfig";
export default {
  created() {
    var session = this.$session.get("email");
    if (session) {
      this.email = session;
    } else {
      this.toAuth();
    }
  },
  data() {
    return {
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard", link: "/" },
        { title: "Menu", icon: "mdi-menu", link: "/menu" },
        { title: "Sejarah", icon: "mdi-note", link: "/sejarah" },
        { title: "Tentang", icon: "mdi-information-outline", link: "/about" },
        { title: "Wilayah", icon: "mdi-map-legend", link: "/wilayah" },
        { title: "Prestasi", icon: "mdi-trophy-award", link: "/prestasi" },
        { title: "Museum Naladipa", icon: "mdi-bank-outline", link: "/museum" },
        {
          title: "Wisata Alam Warasuta",
          icon: "mdi-map-marker-outline",
          link: "/warasuta",
        },
      ],
      drawer: null,
      email: "",
    };
  },
  methods: {
    toAuth() {
      this.$router.push("/auth");
    },
    logout() {
      auth
        .signOut()
        .then(() => {
          this.$session.remove("email");
          this.toAuth();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.item-title {
  text-align: left;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
