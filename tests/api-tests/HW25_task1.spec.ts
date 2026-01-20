import { test, expect, APIResponse } from "@playwright/test";

import { apiUrl } from "./constants";

test.describe("Test restful api", () => {
  test.describe("List of all objects", () => {
    let objectResponse: APIResponse;

    test.beforeEach(async ({ request }) => {
      const url = apiUrl + "objects";
      objectResponse = await request.get(url);
    });

    test("get all objects", async () => {
      expect(objectResponse.status()).toEqual(200);
    });

    test("all objects has body", async () => {
      const body = await objectResponse.json();
      expect(body.length).toBeGreaterThan(0);
    });

    test("all objects body params", async () => {
      const body = await objectResponse.json();
      expect(body[0]).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          name: expect.anything(),
        })
      );
    });
  });

  test.describe("List of objects by ids", () => {
    let objectResponse: APIResponse;
    let getListObjects: (...args: Array<number>) => Promise<APIResponse>;

    test.beforeEach(async ({ request }) => {
      getListObjects = function (...args: Array<number>) {
        const url = apiUrl + "objects?";
        let urlParams: string = "id=" + args[args.length - 1];
        for (let i = 0; i < args.length - 1; i++) {
          urlParams += `&id=${args[i]}`;
        }
        return request.get(url + urlParams);
      };
    });

    test("get one object", async () => {
      objectResponse = await getListObjects(1);
      expect(objectResponse.status()).toEqual(200);
    });

    test("one object has body", async () => {
      objectResponse = await getListObjects(1);
      const body = await objectResponse.json();
      expect(body.length).toBeGreaterThan(0);
    });

    test("check 1 object body", async () => {
      objectResponse = await getListObjects(1);
      const body = await objectResponse.json();

      interface Object {
        id: string;
        name: string;
        data: object;
      }

      const expectedObj: Object[] = [
        {
          id: "1",
          name: "Google Pixel 6 Pro",
          data: {
            color: "Cloudy White",
            capacity: "128 GB",
          },
        },
      ];

      expect(body).toEqual(expectedObj);
    });

    test("get several objects", async () => {
      const objectResponse2 = await getListObjects(1, 3);
      expect(objectResponse2.status()).toEqual(200);
    });
  });

  test.describe("Single object", () => {
    let objectResponse: APIResponse;
    let getSingleObject: (id:number) => Promise<APIResponse>;
    const url = apiUrl + "objects";

    test.beforeEach(async ({ request }) => {
      getSingleObject = function (id: number) {
        return request.get(url + "/" + id);
      };
    });

    test("get single object", async () => {
      objectResponse = await getSingleObject(7);
      expect(objectResponse.status()).toEqual(200);
    });

    test("single object has body", async () => {
      objectResponse = await getSingleObject(7);
      const body = await objectResponse.json();
      expect(body).not.toBeNull();
    });

    test("check single object body", async () => {
      objectResponse = await getSingleObject(7);
      interface Object {
        id: string;
        name: string;
        data: object;
      }
      const expectedObj: Object = {
        id: "7",
        name: "Apple MacBook Pro 16",
        data: {
          year: 2019,
          price: 1849.99,
          "CPU model": "Intel Core i9",
          "Hard disk size": "1 TB",
        },
      };
      const body = await objectResponse.json();
      expect(body).toEqual(expectedObj);
    });
  });

  test.describe("Add object", () => {
    const url = apiUrl + "objects";

    test("create min object", async ({ request }) => {
      const res = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: { name: "Apple MacBook Pro 16" },
      });
      const body = await res.json();
      expect(res.status()).toEqual(200);
      expect(body).toMatchObject({
        id: expect.any(String),
        name: "Apple MacBook Pro 16",
      });
    });

    test("create full object", async ({ request }) => {
      const res = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });
      const body = await res.json();
      expect(res.status()).toEqual(200);
      expect(body).toMatchObject({
        id: expect.any(String),
        name: "Apple MacBook Pro 16",
        data: expect.objectContaining({
          year: 2019,
          price: 1849.99,
          "CPU model": "Intel Core i9",
          "Hard disk size": "1 TB",
        }),
      });
    });

    test("create invalid object: null name", async ({ request }) => {
      const res = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: null,
        },
      });

      expect(res.status()).toEqual(400);
    });

    test("create invalid object: empty name", async ({ request }) => {
      const res = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: " ",
        },
      });

      expect(res.status()).toEqual(400);
    });

    test("create invalid object: no name key", async ({ request }) => {
      const res = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(res.status()).toEqual(400);
    });
  });

  test.describe("Update object", () => {
    const url = apiUrl + "objects";

    test("update min object", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: { name: "Temporary object" },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.put(url + "/" + id, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Temporary object (updated)",
        },
      });
      const body = await res.json();
      expect(res.status()).toEqual(200);
      expect(body).toMatchObject({
        id: id,
        name: "Temporary object (updated)",
      });
    });

    test("update full object", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.put(url + "/" + id, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16 upd",
          data: {
            year: 2020,
            price: 3087.99,
            "CPU model": "Intel Core i9 upd",
            "Hard disk size": "2 TB",
          },
        },
      });
      const body = await res.json();

      expect(res.status()).toEqual(200);
      expect(body).toMatchObject({
        id: id,
        name: "Apple MacBook Pro 16 upd",
        data: {
          year: 2020,
          price: 3087.99,
          "CPU model": "Intel Core i9 upd",
          "Hard disk size": "2 TB",
        },
      });
    });

    test("update only data", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.put(url + "/" + id, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2020,
            price: 3087.99,
            "CPU model": "Intel Core i9 upd",
            "Hard disk size": "2 TB",
          },
        },
      });
      const body = await res.json();

      expect(res.status()).toEqual(200);
      expect(body).toMatchObject({
        id: id,
        name: "Apple MacBook Pro 16",
        data: {
          year: 2020,
          price: 3087.99,
          "CPU model": "Intel Core i9 upd",
          "Hard disk size": "2 TB",
        },
      });
    });

    test("update only name", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.put(url + "/" + id, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16 upd",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(res.status()).toEqual(200);
      const body = await res.json();
      expect(body).toMatchObject({
        id: id,
        name: "Apple MacBook Pro 16 upd",
        data: {
          year: 2019,
          price: 1849.99,
          "CPU model": "Intel Core i9",
          "Hard disk size": "1 TB",
        },
      });
    });

    test("update not existed object", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.put(url + "/" + (id + 1), {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16 upd",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(res.status()).toEqual(404);
    });

    test("update with empty name", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.put(url + "/" + id, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(res.status()).toEqual(400);
    });

    test("update with null name", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.put(url + "/" + id, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: null,
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(res.status()).toEqual(400);
    });

    test("update with no body", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.put(url + "/" + id, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(res.status()).toEqual(400);
    });
  });

  test.describe("Partially update object", () => {
    const url = apiUrl + "objects";

    test("partially update min object", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: { name: "Temporary object" },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.patch(url + "/" + id, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Temporary object (updated)",
        },
      });

      const body = await res.json();

      expect(res.status()).toEqual(200);
      expect(body).toMatchObject({
        id: id,
        name: "Temporary object (updated)",
      });
    });

    test("partially update full object", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.patch(url + "/" + id, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16 upd",
          data: {
            year: 2020,
            price: 3087.99,
            "CPU model": "Intel Core i9 upd",
            "Hard disk size": "2 TB",
          },
        },
      });

      const body = await res.json();

      expect(res.status()).toEqual(200);
      expect(body).toMatchObject({
        id: id,
        name: "Apple MacBook Pro 16 upd",
        data: {
          year: 2020,
          price: 3087.99,
          "CPU model": "Intel Core i9 upd",
          "Hard disk size": "2 TB",
        },
      });
    });

    test("partially update only name", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.patch(url + "/" + id, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16 upd",
        },
      });

      const body = await res.json();

      expect(res.status()).toEqual(200);
      expect(body).toMatchObject({
        id: id,
        name: "Apple MacBook Pro 16 upd",
        data: {
          year: 2019,
          price: 1849.99,
          "CPU model": "Intel Core i9",
          "Hard disk size": "1 TB",
        },
      });
    });

    test("partially update only data", async ({ request }) => {
      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.patch(url + "/" + id, {
        data: {
          year: 2020,
          price: 3087.99,
          "CPU model": "Intel Core i9 upd",
          "Hard disk size": "2 TB",
        },
      });

      const body = await res.json();

      expect(res.status()).toEqual(200);
      expect(body).toMatchObject({
        id: id,
        name: "Apple MacBook Pro 16",
        data: {
          year: 2020,
          price: 3087.99,
          "CPU model": "Intel Core i9 upd",
          "Hard disk size": "2 TB",
        },
      });
    });
  });

  test.describe("Delete object", () => {
    test("delete object", async ({ request }) => {
      const url = apiUrl + "objects";

      const tempObject = await request.post(url, {
        headers: { "Content-Type": "application/json" },
        data: {
          name: "Apple MacBook Pro 16",
          data: {
            year: 2019,
            price: 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      });

      expect(tempObject.status()).toEqual(200);
      const bodyTemp = await tempObject.json();
      const id = bodyTemp.id;

      const res = await request.delete(url + "/" + id);
      const body = await res.json();

      expect(res.status()).toEqual(200);
      expect(body).toMatchObject({
        message: `Object with id = ${id} has been deleted.`,
      });
      expect((await request.get(url + "/" + id)).status()).toEqual(404);
    });
  });
});
