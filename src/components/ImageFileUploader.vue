<template>
  <div id="ImageFileUploader">
    <!-- Image Upload -->
    <v-row justify="center" align="center" class="ma-0">
      <v-row v-show="images.length">
        <v-col md="12" cols="12" class="text-end">
          <label for="file">
            <v-icon>mdi-plus</v-icon>
          </label>
        </v-col>
      </v-row>
      <!-- dragging div -->
      <div
        @dragenter="OnDragEnter"
        @dragleave="OnDragLeave"
        @dragover.prevent
        @drop="onDrop"
        :class="{ dragging: isDragging }"
        class="uploader mt-0"
      >
        <div v-show="!images.length" class="text-center">
          <v-icon color="white">mdi-cloud-upload</v-icon>
          <p>Drag your images here</p>
          <div class="file-input text-center">
            <label for="file" class="i_label">Select a file</label>
            <input
              type="file"
              id="file"
              class="i_c_Input"
              @change="onInputChange"
              multiple
            />
          </div>
        </div>

        <!-- display selected images -->
        <v-row>
          <v-col
            sm="4"
            md="4"
            cols="4"
            v-for="(image, index) in images"
            :key="index"
          >
            <v-img
              :src="image"
              :alt="`Image Uplaoder ${index}`"
              max-width="350"
              max-height="350"
              width="50"
              height="50"
              class="image_selected"
            />

            <div class="delete_image">
              <v-icon
                small
                color="white"
                class="red rounded rounded-circle pa-1"
                @click="removeImage(index)"
              >
                mdi-delete
              </v-icon>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ImageFileUploader",
  data() {
    return {
      isDragging: false,
      dragCount: 0,
      progressCount: null,
      files: [],
      images: [],
      maxImage: 6,
    };
  },
  methods: {
    OnDragEnter(e) {
      if (this.images.length < this.maxImage) {
        e.preventDefault();

        this.dragCount++;
        this.isDragging = true;
        return false;
      } else {
        console.log("false OnDragEnter");
      }
    },
    OnDragLeave(e) {
      e.preventDefault();
      this.dragCount--;
      if (this.dragCount <= 0) this.isDragging = false;
    },
    onInputChange(e) {
      //   console.log(e);

      const files = e.target.files;
      if (!this.isValidNumberOfImages(files.length)) {
        return false;
      }
      Array.from(files).forEach((file) => this.addImage(file));
    },
    onDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.isDragging = false;
      const files = e.dataTransfer.files;
      if (!this.isValidNumberOfImages(files.length)) {
        return false;
      }

      Array.from(files).forEach((file) => this.addImage(file));
    },
    isValidNumberOfImages(amount) {
      if (amount > this.maxImage) {
        // this.$emit("limit-exceeded", amount);
        console.log("limit exceed");
        return false;
      } else {
        return true;
      }
    },
    addImage(file) {
      if (this.images.length < this.maxImage) {
        console.log(true, this.images.length);
        if (!file.type.match("image.*")) {
          //   this.$toastr.e(`${file.name} is not an image`);
          return;
        }
        if (!this.isValidNumberOfImages(file.length)) {
          return false;
        }
        // this.files.push(file);
        const img = new Image(),
          reader = new FileReader();
        reader.onload = (e) => this.images.push(e.target.result);
        reader.readAsDataURL(file);

        // console.log(this.images);
        this.$emit("upload-success", this.images, "test");
      } else {
        console.log("not allowed to add more than 6 images");
      }
    },
    removeImage(e) {
      console.log(e);
      this.images.splice(e, 1);
    },
    removeAll() {
      console.log("triggerd from parent");
      this.images.splice(0);
    },
  },
};
</script>

<style>
.uploader {
  width: 100%;
  height: 195px;
  background: #2196f3;
  color: #fff;
  padding: 20px 15px;
  text-align: center;
  border-radius: 10px;
  border: 3px dashed #fff;
  font-size: 20px;
  position: relative;
}
.file-input {
  width: 100%;
  margin: auto;
  height: 68px;
  position: relative;
}
.img-wrapper {
  width: 160px;
  display: flex;
  flex-direction: column;
  margin: 10px;
  height: 150px;
  justify-content: space-between;
  background: #fff;
  box-shadow: 5px 5px 20px #3e3737;
}
.dragging {
  background: #fff;
  color: #2196f3;
  border: 3px dashed #2196f3;
}
.i_label {
  position: absolute;
  left: 0;
  top: 0;
  padding-left: 30%;
  border-radius: 4px;
  margin-top: 7px;
  cursor: pointer;
}
.i_c_Input {
  background: #fff;
  width: 50px;
  opacity: 0;
  z-index: -2;
}
.delete_image {
  position: absolute;
  padding: 0px 14px;
  margin-top: -35px;
  display: none;
  cursor: pointer;
}
.delete_image:hover {
  position: absolute;
  padding: 0px 14px;
  margin-top: -35px;
  display: block;
  cursor: pointer;
}
.image_selected {
  cursor: pointer;
}
.image_selected:hover + .delete_image {
  display: block;
  cursor: pointer;
}
</style>
