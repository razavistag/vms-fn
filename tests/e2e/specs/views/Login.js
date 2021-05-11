describe("Login.vue ", () => {
  clearInputs = () => {
    cy.get("#loginEmail").clear();
    cy.get("#loginPassword").clear();
  };

    it("Login with empty credentials ", () => {
      cy.get("#loginSubmitBtn").click();
    });
    it("Should display an account pending message when user is not approved ", () => {
      clearInputs();
      cy.get("#loginEmail").type("zcummings@example.net");
      cy.get("#loginPassword").type("password");
      cy.get("#loginSubmitBtn").click();
    });

    it("Should login and navigate to admin dashboard", () => {
      clearInputs();
      cy.get("#loginEmail").type("admin@gmail.com");
      cy.get("#loginPassword").type("password");
      cy.get("#loginSubmitBtn").click();
    });

    it("Should logout when the logout button clicked", () => {
      cy.get("#logoutBtn").click();
      cy.clearLocalStorage("token");
    });

    it("Should not visit to admin dashbaord when no one logged-in", () => {
      cy.visit("/dashboard");
    });
 
});
