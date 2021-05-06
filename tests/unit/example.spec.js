import { mount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Login from "@/views/Login.vue";

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

  test("Should not allow to login when email & password textboxes are empty", async () => {
    let wrapper = mount(Login, {
      stubs: ["router-link", "router-view"],
      vuetify,
    });
    await wrapper.setData({ email: "", password: "" });
    expect(wrapper.vm.email).toBe("");
    expect(wrapper.vm.password).toBe("");

    let mockMethod = jest.fn(wrapper.vm.Login());
    wrapper.vm.Login();
    // wrapper.setMethods({ Login: mockMethod });
    wrapper.find("#loginBtn").trigger("click");
    // expect(mockMethod).toHaveBeenCalled();
  });
});
