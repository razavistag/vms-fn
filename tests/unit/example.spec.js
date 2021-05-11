import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";
import Vuetify from "vuetify";
// import router from "vue-router";
import VueRouter from "vue-router";
import Login from "@/views/Login.vue";
import axios from "axios";
// import Appbar from "@/component/Appbar.vue";

describe("Example", () => {
  const localVue = createLocalVue();
  let vuetify = new Vuetify();
  localVue.use(VueRouter);
  const router = new VueRouter();

  // axios get mock
  test("Mocking axios get response", () => {
    let mockResponse = {
      data: {
        project_id: "1",
        title: "project 1",
      },
    };
    let wrapper = mount(Login, {
      stubs: ["router-link", "router-view"],
      vuetify,
    });
    jest.mock("axios");
    axios.get = jest.fn();

    axios.get.mockResolvedValue(mockResponse);
    wrapper.vm.mockAxiosGetFunction();
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledWith("/projects?page=1");
  });

  // axios post mock
  test("Mocking axios Post response", async () => {
    let post_arr = {
      email: "admin@gmail.com",
      password: "password",
    };

    let mockResponse = {
      expires_at: "2022-05-07 21:20:03",
      message: "User Logged-in successfully",
      success: true,
      token_type: "Bearer",
      user_access: 4,
    };

    let wrapper = mount(Login, {
      stubs: ["router-link", "router-view"],
      vuetify,
    });

    axios.post = jest.fn();
    jest.mock("axios");

    axios.post.mockResolvedValue(mockResponse);
    let txtEmail = wrapper.find("#loginEmail");
    await txtEmail.setValue("admin@gmail.com");

    let txtPassword = wrapper.find("#loginPassword");
    await txtPassword.setValue("password");

    wrapper.vm.mockAxiosPostFunction();
    expect(axios.post).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith("/login", post_arr);
  });
});
