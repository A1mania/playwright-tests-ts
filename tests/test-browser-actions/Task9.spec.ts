// Task9: Для сайта https://the-internet.herokuapp.com/tables
// Создать скрипт на получение заголовка сайта (title) 
// Запустить скрипт через page.evaluate()
// Проверить что полученные title совпадает с ожидаемым
// (опционально, сложная задача) Создать функцию которая будет принимать в себя число 1 или 2
//     На выходе функция должна собирать данные из соответствующей таблицы (Example 1 или Example 2)
//     Выходные данные должны иметь вид массива (порядок свойств объектов не важен, порядок объектов в массиве - соответствует порядку строк в таблице)
// [
//   {
//     "Last Name": "Smith",
//     "First Name": "John",
//     "Email": "jsmith@gmail.com",
//     "Due": "$50.00",
//     "Web Site": "http://www.jsmith.com",
//     "Action": "edit delete"
//   },
//   {
//     "Last Name": "Bach",
//     "First Name": "Frank",
//     "Email": "fbach@yahoo.com",
//     "Due": "$51.00",
//     "Web Site": "http://www.frank.com",
//     "Action": "edit delete"
//   },
//   {
//     "Last Name": "Doe",
//     "First Name": "Jason",
//     "Email": "jdoe@hotmail.com",
//     "Due": "$100.00",
//     "Web Site": "http://www.jdoe.com",
//     "Action": "edit delete"
//   },
//   {
//     "Last Name": "Conway",
//     "First Name": "Tim",
//     "Email": "tconway@earthlink.net",
//     "Due": "$50.00",
//     "Web Site": "http://www.timconway.com",
//     "Action": "edit delete"
//   }
// ]
// 

import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/tables");
  });

test("check page title", async ({ page }) => {
  const title = await page.evaluate(() => document.title)
  expect(title).toEqual("The Internet");
});

test("get table data", async ({ page }) => {
 
  async function getTableData(tableNumber: number) {
    const tableData = [];

    const rows = await page.locator(`#table${tableNumber} tbody tr`).count();

    for (let i = 0; i < rows; i++) {
      const objectData = {
        "Last Name": await page
          .locator(
            `#table${tableNumber} tbody tr:nth-of-type(${i + 1}) td:nth-of-type(1)`
          )
          .innerText(),
        "First Name": await page
          .locator(
            `#table${tableNumber} tbody tr:nth-of-type(${i + 1}) td:nth-of-type(2)`
          )
          .innerText(),
        "Email": await page
          .locator(
            `#table${tableNumber} tbody tr:nth-of-type(${i + 1}) td:nth-of-type(3)`
          )
          .innerText(),
        "Due": await page
          .locator(
            `#table${tableNumber} tbody tr:nth-of-type(${i + 1}) td:nth-of-type(4)`
          )
          .innerText(),
        "Web Site": await page
          .locator(
            `#table${tableNumber} tbody tr:nth-of-type(${i + 1}) td:nth-of-type(5)`
          )
          .innerText(),
        "Action": await page
          .locator(
            `#table${tableNumber} tbody tr:nth-of-type(${i + 1}) td:nth-of-type(6)`
          )
          .innerText(),
      };
      tableData.push(objectData);
    }
    return tableData;
  }
  const data = await getTableData(2);
  console.log(data);
});

