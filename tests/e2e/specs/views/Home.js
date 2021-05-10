describe("Home.vue ", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
  });
  it("Navigating to login page", () => {
    cy.get("#login_btn").click();
  });
});
