import { mount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Login from "@/views/Login.vue";
import axios from "axios";
// import Appbar from "@/component/Appbar.vue";

describe("Login.vue", () => {
  let vuetify = new Vuetify();

  test("Rending Appbar", () => {
    let wrapper = mount(Login, {
      stubs: ["router-link", "router-view"],
      vuetify,
    });
    let navBar = wrapper.findComponent({ name: "Appbar" }); // => Finding AppBar Component inside the Login
    expect(navBar.exists()).toBe(true);
  });

  test("Should have login elements", () => {
    let wrapper = mount(Login, {
      stubs: ["router-link", "router-view"],
      vuetify,
    });
    expect(wrapper.find("#loginEmail").exists()).toBe(true);
    expect(wrapper.find("#loginPassword").exists()).toBe(true);
    expect(wrapper.find("#loginRememberCheckBox").exists()).toBe(true);
    expect(wrapper.find("#loginBtn").exists()).toBe(true);
  });

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
  test("Mocking axios Post response", () => {
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
    wrapper.vm.mockAxiosPostFunction();
    expect(axios.post).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith("/login", post_arr);
  });

  test("Should not login if email & passowrd are empty", () => {
    let login_arr = {
      email: "",
      password: "",
    };

    let mockResponse = {
      success: false,
      help: "CHECK AUTH CONFIGURATION",
      message: "PLEASE TRY AGAIN LATER",
    };

    let wrapper = mount(Login, {
      stubs: ["router-link", "router-view"],
      vuetify,
    });

    axios.post = jest.fn();
    jest.mock("axios");
    axios.post.mockResolvedValue(mockResponse);
    wrapper.setData(login_arr);

    wrapper.vm.LoginSubmit();

    expect(axios.post).not.toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalledWith("/login", login_arr);

    // expect(axios.post).toHaveBeenCalled();
    // expect(axios.post).toHaveBeenCalledWith("/login", login_arr);
  });

  test("Should Login When email password correct", () => {
    let valid_auth = {
      email: "admin@gmail.com",
      password: "password",
    };
    let mockResponse = {
      data: {
        success: true,
        user_information: {
          id: 1,
          name: "admin",
          phone: "+94777123456",
        },
        message: "User Logged-in successfully",
        user_access: 4,
        user_access_url: '["0","1","2","3","4"]',
        access_token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZGZhYzRjNjBiYjkyYzNkN2EwOWU2Y2M2NjBmNzBhODRjOTk0YTNkZDY1NzVmMmMxYmY1MmE2YmFjODJlNjVkYjUwOTRjYTcyYTA0MDVjMmUiLCJpYXQiOjE2MjA0MjI2NDMuNjE5NTkyLCJuYmYiOjE2MjA0MjI2NDMuNjE5NTk1LCJleHAiOjE2NTE5NTg2NDMuNjE0Mzc2LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.hXDalUIruY3MkDrk9E4Zk0UkTFVG4FzsybXba9S-I-o9H19ikY9NBXx02eFRbNrGOgOvhCy2qQkQtkoTlOgue8Q5z_0b6Ina9WVHm251GbqdGkuanbe4a1SqnSI0x5ORM1LxHcAjAjr5jhDHEE6BS4dmGJm50MTrzCQ-EYDefRjl0ql9B9JNpbGWK9QGlL9XNEQMu5dl57PPISEZqb1N-6SYxHB-J80njuTa1RKnNh-aHBRY6vsmELCGsyfSKWQWEOeUjCrVJOf6-taSbLF7FsnV45KvO-WAI8a3dik90qMI2qVYN3MNUtnwgFJ6QYT0nryMMJGpYDgV_CLSDVf67UapeJx-MvdLiM3K9TMEv6M0DKHG2ZSsY2e5QlPPWhg2kmW_kS27ZOFNsqoqfpQ9h2gt3wIP8DWCdBfdvI9V0WjEI-Fofvc9B6Avnw88vFmJNRm-V4s2Msa3itmZ6DB0gov4h-YCfdTVbBQH4WrYWKAu9fkXjJ3WNTDJz_pjL8tPJC1_ZZrgH7MYCWqnePD3-GzgQuAVMgvU5Qy5rEcpHe4shlrAvdfkwCl2neNYbvq3_y-3NVjNI7MEEB_PmXJqFsp3MiDH4U32wsWI0bhgeLEc5dcxGKLtxBNEHcy38oGK-V66vOOO38DXCPJTRY-S7YWou-5KzdCdf_Jp9rjktw8",
        token_type: "Bearer",
        expires_at: "2022-05-07 21:24:03",
      },
    };
    let wrapper = mount(Login, {
      stubs: ["router-link", "router-view"],
      vuetify,
    });

    axios.post = jest.fn();
    jest.mock("axios");

    axios.post.mockResolvedValue(mockResponse);
    wrapper.setData(valid_auth);
    wrapper.vm.LoginSubmit();
    wrapper.vm.$refs.form.validate();
    expect(axios.post).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith("/login", valid_auth);
  });
});
