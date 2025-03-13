// Import commands.js using ES2015 syntax:
import './commands'

// Xử lý lỗi không xử lý được
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

// Xóa localStorage trước mỗi test
beforeEach(() => {
  cy.clearLocalStorage()
}) 