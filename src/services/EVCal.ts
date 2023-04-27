import xlsx from 'sheetjs-style';

export const insertXlSData = (data: xlsx.WorkSheet) => {
    const wb: xlsx.WorkBook = xlsx.readFile("./src/resources/Output.xlsx", {
        cellFormula: true,
        type: "binary",
        cellDates: true,
        cellStyles: true,
    });
    const sheetname: string[] = wb.SheetNames;
    const ws: xlsx.WorkSheet = wb.Sheets["JP-M"];
    const xls = xlsx.utils.sheet_to_json(ws);
    const secondWorksheetData: xlsx.WorkSheet = data;
    const mergedDataMap = new Map();
    [xls, secondWorksheetData].map((worksheetData) => {
        worksheetData.map((row: any) => {
            const Resource = row["Resource"];
            if (mergedDataMap.has(Resource)) {
                const existingRow = mergedDataMap.get(Resource);
                mergedDataMap.set(Resource, Object.assign(existingRow, row));
            } else {
                mergedDataMap.set(Resource, row);
            }
        });

    });

    const mergedData = Array.from(mergedDataMap.values());
    const newWs: xlsx.WorkSheet = xlsx.utils.json_to_sheet(mergedData);
    const newwb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newwb, newWs, "JP-M");
    sheetname.map((sheet) => {
        if (sheet !== "JP-M") {
            const ws: xlsx.WorkSheet = wb.Sheets[sheet];
            xlsx.utils.book_append_sheet(newwb, ws, sheet);
        }
    });
    xlsx.writeFile(newwb, "./src/resources/Output.xlsx", {
        bookType: "xlsx",
        bookSST: true,
        cellStyles: true,
    });
    xlsxSort();
}


const xlsxSort = () => {
    const workbook = xlsx.readFile('./src/resources/Output.xlsx', {
        cellFormula: true,
        type: 'binary',
        cellDates: true,
        cellStyles: true,
    });
    const sheetName = 'JP-M';

    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const offshoreSum: Record<string, number> = {};
    const onsiteSum: Record<string, number> = {};



    data.map((row: any) => {
        Object.keys(row).slice(2).map((colName) => {
            const cellValue = row[colName];
            const cellValueNum = Number(cellValue);
            const offshore = row['Ofshore'];
            if (offshore === 'Y') {
                if (colName in offshoreSum) {
                    offshoreSum[colName] += cellValueNum || 0;
                } else {
                    offshoreSum[colName] = cellValueNum || 0;
                }
            } else if (offshore === 'N') {
                if (colName in onsiteSum) {
                    onsiteSum[colName] += cellValueNum || 0;
                } else {
                    onsiteSum[colName] = cellValueNum || 0;
                }
            }
        });
    })

    //Calculation Offshore
    const YearOffShore: { [key: string]: any } = {};
    const month = Object.keys(offshoreSum);
    month.map((month: string) => {
        const year = month.split("-")[1];
        if (!isNaN(Number(year))) {
            if (!Object.prototype.hasOwnProperty.call(YearOffShore, year)) {
                YearOffShore[year] = [];
            }
            YearOffShore[year].push(`${offshoreSum[month]}`);
        }
    });
    Object.keys(YearOffShore).map((data: string) => {
        const sum = YearOffShore[data].reduce(
            (acc: number, val: string) => acc + parseFloat(val),
            0
        );
        YearOffShore[data] = sum;
    });
    Object.keys(YearOffShore).map((key: string) => {
        const year = Number(`20${key}`);
        YearOffShore[year] = YearOffShore[key];
        delete YearOffShore[key];
    });

    const YearOnShore : { [key: string]: any } = {};
    const monthOnShore = Object.keys(onsiteSum);
    monthOnShore.forEach((monthOnShore) => {
        const year = monthOnShore.split("-")[1];
        if (!isNaN(Number(year))) {
            if (!Object.prototype.hasOwnProperty.call(YearOnShore, year)) {
                YearOnShore[year] = [];
            }
            YearOnShore[year].push(`${onsiteSum[monthOnShore]}`);
        }
    });
    
    //Yearly Onshore
    Object.keys(YearOnShore).map((data: string) => {
        const sum = YearOnShore[data].reduce(
            (acc: number, val: string) => acc + parseFloat(val),
            0
        );
        YearOnShore[data] = sum;
    });
   

    Object.keys(YearOnShore).map((key) => {
        const year = Number(`20${key}`);
        YearOnShore[year] = YearOnShore[key];
        delete YearOnShore[key];
    });
    const offshoreTotal = Object.values(offshoreSum).reduce(
        (total, value) => total + value,
        0
      );
    
      const onsiteTotal = Object.values(onsiteSum).reduce(
        (total, value) => total + value,
        0
      );
    //   console.log(offshoreTotal,onsiteTotal)
    
      //UPDATE EXCEL DATA
      //dataUpdate(YearOffShore, YearOnShore);







};
