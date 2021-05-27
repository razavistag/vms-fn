<template>
  <div id="DialogCardLoading">
    <div class="d-flex">
      <v-sheet color="teal darken-1" height="4" width="25%">
        <v-progress-linear
          indeterminate
          color="blue darken-1"
        ></v-progress-linear>
      </v-sheet>
      <v-sheet color="blue darken-1" height="4" width="25%">
        <v-progress-linear
          indeterminate
          color="teal darken-1"
        ></v-progress-linear>
      </v-sheet>
      <v-sheet color="teal darken-1" height="4" width="25%">
        <v-progress-linear
          indeterminate
          color="blue darken-1"
        ></v-progress-linear>
      </v-sheet>
      <v-sheet color="blue darken-1" height="4" width="25%">
        <v-progress-linear
          indeterminate
          color="teal darken-1"
        ></v-progress-linear>
      </v-sheet>
    </div>
  </div>
</template>

<script>
export default {
  name: "DialogCardLoading",
};
</script>

<style></style>
