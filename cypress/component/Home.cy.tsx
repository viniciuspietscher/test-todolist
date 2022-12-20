import Home from "../../pages/index"

describe("Home.cy.ts", () => {
  it("playground", () => {
    cy.viewport(1920, 1080)

    const lists = [
      {
        _id: "1",
        title: "List One",
        __v: 0,
      },
      {
        _id: "2",
        title: "List Two",
        __v: 0,
      },
      {
        _id: "3",
        title: "List Three",
        __v: 0,
      },
    ]
    cy.mount(<Home lists={lists} />)
    cy.get("#list-title").contains("List One")
    // cy.get("#list-title").
    // cy.get("#list-title").contains("List Three")
  })
})
