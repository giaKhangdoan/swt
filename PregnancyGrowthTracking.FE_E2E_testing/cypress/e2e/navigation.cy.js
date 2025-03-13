describe('Navigation Tests', () => {
  it('Should navigate to public pages', () => {
    cy.visit('/')
    cy.get('nav').should('be.visible')
    cy.get('footer').should('be.visible')
  })

  it('Should navigate to member pages after login', () => {
    cy.login()
    cy.visit('/member/basic-tracking')
    cy.url().should('include', '/member/basic-tracking')
  })
}) 