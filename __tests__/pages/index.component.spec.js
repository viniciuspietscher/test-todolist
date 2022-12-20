import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import "whatwg-fetch"
import Home from "../../pages"
import { setupWorker, rest } from "msw"
import { setupServer } from "msw/node"

const user = userEvent.setup()

// beforeAll(async()=> {

// })
const lists = [
  {
    _id: 1,
    title: "List One",
  },
  {
    _id: 2,
    title: "List Two",
  },
]

describe("render home component", () => {
  // const lists = [
  //   {
  //     _id: 1,
  //     title: "List One",
  //   },
  //   {
  //     _id: 2,
  //     title: "List Two",
  //   },
  //   {
  //     _id: 3,
  //     title: "List Three",
  //   },
  // ]
  const component = render(<Home lists={lists} />)
  // screen.debug()
  it("is displaying all the lists is was given", () => {
    for (const l of lists) {
      expect(screen.getByText(l.title)).toBeInTheDocument()
    }
  })
})

describe("add new list", () => {
  it("adds new list", async () => {
    const server = setupServer(
      rest.post("/api/lists/list", async (req, res, ctx) => {
        const { title } = await req.json()
        return res(
          ctx.json({
            list: {
              title: newListTitle,
              _id: "3",
            },
          })
        )
      })
    )

    server.listen()
    const component = render(<Home lists={lists} />)
    const newListTitle = "a new list test"
    // get input
    const addListInput = screen.getByRole("textbox")
    const addListButton = screen.getByRole("button", { name: /add list/i })

    await user.clear(addListInput)
    await user.type(addListInput, newListTitle)

    await user.click(addListButton)
    expect(await screen.findByText(newListTitle)).toBeInTheDocument()
    server.close()
  })
})
