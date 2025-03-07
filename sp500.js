import { JSDOM } from "jsdom"; // Ensure this is imported correctly in your environment

export default async function fetchAndParseSAndP500() {
  const url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    // Create a DOM parser to parse the HTML content
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Get the table with id 'constituents'
    const table = doc.querySelector("#constituents");
    if (!table) {
      throw new Error('Table with id "constituents" not found');
    }

    // Get all rows in the table body
    const rows = table.querySelectorAll("tbody tr");

    // Extract the first <td> from each row and return an array
    const data = Array.from(rows)
      .map((row) => {
        const firstTd = row.querySelector("td");
        return firstTd ? firstTd.textContent.trim() : null;
      })
      .filter(Boolean); // Filter out null values

    return data;
  } catch (error) {
    console.error("Error fetching or parsing S&P 500 data:", error);
    return null;
  }
}
