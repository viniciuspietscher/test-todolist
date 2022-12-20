/**
 * @jest-environment node
 */

import Home, { getServerSideProps } from "../../pages/index"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import List from "../../models/model.list"
import { MongoClient } from "mongodb"
import connectMongo from "../../utils/connectMongo"

jest.mock("../../utils/connectMongo", () => {
  const original = jest.requireActual("../../utils/connectMongo")
  return {
    __esModule: true,
    default: jest.fn(original.default),
  }
})

let mongod, conn
const startTestMongo = async () => {
  // This will create an new instance of "MongoMemoryServer" and automatically start it
  mongod = await MongoMemoryServer.create()
  const mongoUri = mongod.getUri()
  mongoose.set("strictQuery", true)
  process.env.MONGO_URI = mongoUri
  conn = await MongoClient.connect(mongoUri, {})
  // console.log(process.env.MONGO_URI)
}

const shutdownTestMongo = async () => {
  if (conn) {
    await conn.close()
  }
  mongoose.disconnect()
  if (mongod) {
    await mongod.stop()
  }
}

beforeAll(async () => {
  await startTestMongo()
})

afterAll(async () => {
  await shutdownTestMongo()
})

describe("test home page getServerSideProps", () => {
  it("returns empty list array when there are no lists", async () => {
    const result = await getServerSideProps()
    // run some tests on the result
    expect(result).toEqual({ props: { lists: [] } })
  })

  // it("returns all lists in array", async () => {
  //   await List.create({ title: "Test List 0" })
  //   await List.create({ title: "Test List 1" })
  //   await List.create({ title: "Test List 2" })
  //   const result = await getServerSideProps()

  // run some tests on the result
  // expect(result).toEqual({ props: { lists: [] } })
  // })

  it("returns all lists in array", async () => {
    const dummyData = [{ title: "List 1" }, { title: "List 2" }]
    const db = conn.db(mongod.instanceInfo.dbName)
    await db.collection("lists").drop()
    const res = await db.collection("lists").insertMany(dummyData)
    const result = await getServerSideProps()
    expect(result.props).toBeDefined()
    expect(result.props.lists).toBeDefined()
    expect(Array.isArray(result.props.lists)).toBeTruthy()
    expect(result.props.lists.length).toBe(dummyData.length)
    for (const i in dummyData) {
      expect(result.props.lists[i].title).toBe(dummyData[i].title)
    }
    for (const i in res.insertedIds) {
      expect(result.props.lists[i]._id).toEqual(res.insertedIds[i] + "")
    }
  })

  it("handles thrown errors well", async () => {
    connectMongo.mockImplementationOnce(async () => {
      throw new Error("error thrown")
    })

    const result = await getServerSideProps()
    expect(result.props).toBeUndefined()
    expect(result.notFound).toBeDefined()
    expect(result.notFound).toBeTruthy()
  })

  // it.only("mock", async () => {
  //   jest.mock("../../pages/index", async () => {
  //     getServerSideProps: jest.fn(() => {
  //       console.log("here")
  //     })
  //   })
  //   expect(jest.isMockFunction(getServerSideProps)).toBeTruthy()
  //   const res = await getServerSideProps()
  //   console.log(res)
  //   // expect(async () => {
  //   //   await getServerSideProps()
  //   // }).toBeFalsy()
  // })

  // test what happens if an error is thrown
})
