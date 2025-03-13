describe('Authentication Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('Should display login page', () => {
    cy.visit('/login')
    cy.get('h1').should('be.visible')
    cy.get('input[type="text"]').first().should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('Should display register page', () => {
    cy.visit('/register')
    cy.get('h1').should('contain', 'Đăng ký')
    cy.get('input[type="text"]').first().should('exist')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').first().should('exist')
  })

  it('Should login successfully with valid credentials', () => {
    cy.visit('/login')
    cy.get('input[type="text"]').first().clear().type('vip2')
    cy.get('input[type="password"]').clear().type('vip123')
    cy.get('button[type="submit"]').click()
    
    cy.url().should('include', '/member')
  })

  Cypress.Commands.add('login', (username = 'vip2', password = 'vip123') => {
    cy.visit('/login')
    cy.get('input[type="text"]').first().clear().type(username)
    cy.get('input[type="password"]').clear().type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login')
  })
}) 