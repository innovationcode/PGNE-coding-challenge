const request = require("supertest");

const app = require("../src/index");

describe("TSET FOR ROUTES IN ...src/index.js to get all stations info", () => {
  //TEST FOR ROUTE TO GET ENDPOINT....
  it("should return status code 200 on success.. ", async () => {
    let response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  it("should return json data", async () => {
    let response = await request(app).get("/");
    expect(response.type).toEqual("application/json");
  });
});
