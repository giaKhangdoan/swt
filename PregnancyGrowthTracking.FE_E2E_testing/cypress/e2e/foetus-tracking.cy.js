describe('Foetus Tracking Tests', () => {
  beforeEach(() => {
    // Tăng timeout mặc định lên 30 giây
    Cypress.config('defaultCommandTimeout', 30000)
    cy.login('vip2', 'vip123')
    cy.visit('/member')
    // Đợi cho trang load xong
    cy.wait(10000)
  })

  it('Hiển thị danh sách thai nhi', () => {
    // Kiểm tra header có đúng text không
    cy.get('.foetus-list-header h2')
      .should('be.visible')
      .and('contain', 'Danh sách thai nhi')
  })

  it('Thêm thai nhi mới với log request', () => {
    // Intercept API call để xem request
    cy.intercept('POST', '**/api/foetus').as('createFoetus')

    // Click nút thêm thai nhi
    cy.get('.foetus-list-header .add-foetus-btn')
      .should('be.visible')
      .click()

    cy.wait(5000)

    const babyName = `Test Baby ${Date.now()}`
    
    // Điền form
    cy.get('.add-foetus-form input[type="text"]')
      .should('be.visible')
      .clear()
      .type(babyName)

    cy.get('.add-foetus-form .gender-select')
      .should('be.visible')
      .select('Nam')

    cy.wait(2000)

    // Click submit và log request
    cy.get('.add-foetus-form button[type="submit"]')
      .click()

    // Log request để debug
    cy.wait('@createFoetus').then((interception) => {
      // Log request body
      console.log('Request Body:', interception.request.body)
      // Log response
      console.log('Response:', interception.response)
    })
  })

  it('Xóa thai nhi', () => {
    // Đợi danh sách load
    cy.get('.foetus-item')
      .should('exist')
      .first()
      .within(() => {
        // Click nút xóa (có icon Trash2)
        cy.get('.delete-btn')
          .should('be.visible')
          .click()
      })

    // Xác nhận xóa trong dialog
    cy.on('window:confirm', () => true)

    // Đợi api call hoàn thành
    cy.wait(5000)
  })
}) 