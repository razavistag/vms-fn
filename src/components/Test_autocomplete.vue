<template>
  <div id="autoComplete">
    <v-card color="green lighten-2" dark>
      <v-card-title class="headline green lighten-3">
        AUTO COMPLETE SEARCH FROM API
      </v-card-title>
      <v-card-text>
        <!-- {{ modelData }} -->
        <v-autocomplete
          v-model="modelData"
          :search-input.sync="onSearch"
          :items="projectItems"
          item-text="title"
          item-value="id"
          hide-no-data
          hide-selected
          return-object
        ></v-autocomplete>
      </v-card-text>
      <v-divider></v-divider>
      <v-expand-transition>
        <v-list class="red lighten-3">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                project id:{{ modelData.id }}
              </v-list-item-title>
              <v-list-item-subtitle>
                project title : {{ modelData.title }}</v-list-item-subtitle
              >
              <v-list-item-subtitle>
                Description: {{ modelData.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "autoComplete",
  data: () => ({
    modelData: "",
    onSearch: "",
    projectItems: [],
  }),

  watch: {
    onSearch(e) {
      console.log(e);
      this.$http
        .get("projects/apifectch/" + e)
        .then((res) => {
          console.log(res.data.Result);
          res.data.Result.forEach((element) => {
            this.projectItems.push(element);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
 
