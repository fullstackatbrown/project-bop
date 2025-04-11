export const csvToJson = (csvString) => {
    const rows = csvString.split("\n").map(row => row.trim()).filter(row => row); // Remove empty rows
    const headers = rows[0].split(",").map(header => header.trim()); // Extract column names

    const jsonData = rows.slice(1).map(row => {
        const values = row.split(",");
        let obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] ? values[index].trim() : "";
        });
        return obj;
    }).filter(row => Object.values(row).some(value => value !== ""));

    return jsonData;
};

export const getColumnProportions = (csvString, columnName) => {
    const jsonData = csvToJson(csvString); // Convert CSV to JSON first

    const counts = {};
    let total = 0;

    jsonData.forEach(row => {
        const value = row[columnName];
        if (value) {
            counts[value] = (counts[value] || 0) + 1;
            total++;
        }
    });

    const proportions = {};
    for (const key in counts) {
        proportions[key] = (counts[key] / total).toFixed(2); 
    }

    return proportions;
};

export const parsePollCSV = (csvText) => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").slice(1);
    const columnData = headers.map(() => []);
  
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
      for (let j = 1; j < row.length; j++) {
        let value = row[j].trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1); 
        }
        const splitValues = value.split(",").map(v => v.trim());
        columnData[j - 1].push(...splitValues);
      }
    }

    function countResponses(arr) {
      const counts = {};
      for (const val of arr) {
        counts[val] = (counts[val] || 0) + 1;
      }
      return counts;
    }
  
    const result = columnData.map((values, idx) => {
      const counts = countResponses(values);
      return {
        question: headers[idx],
        labels: Object.keys(counts),
        values: Object.values(counts)
      };
    });
  
    return result;
};