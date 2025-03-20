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
