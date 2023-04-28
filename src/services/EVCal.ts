import xlsx from 'sheetjs-style';
import { EmployeeData, TypeYearValueCalcutaion, TypeYearValueCalcutaion2 } from '../types';


 
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
        worksheetData.map((row: EmployeeData) => {
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
    const workbook: xlsx.WorkBook = xlsx.readFile('./src/resources/Output.xlsx', {
        cellFormula: true,
        type: 'binary',
        cellDates: true,
        cellStyles: true,
    });
    const sheetName = 'JP-M';

    const worksheet: xlsx.WorkSheet = workbook.Sheets[sheetName];
    const data: EmployeeData[] = xlsx.utils.sheet_to_json(worksheet);

    const offshoreSum: Record<string, number> = {};
    const onsiteSum: Record<string, number> = {};



    data.map((row: EmployeeData) => {
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
    const YearOffShore: TypeYearValueCalcutaion = {};
    const YearOffShore2: TypeYearValueCalcutaion2 = {};


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
        YearOffShore2[data] = sum;

    });
     

    Object.keys(YearOffShore2).map((key: string) => {
        const year = Number(`20${key}`);
        YearOffShore2[year] = YearOffShore2[key];
        delete YearOffShore2[key];
    });
    


    const YearOnShore: TypeYearValueCalcutaion = {};
    const YearOnShore2: TypeYearValueCalcutaion2 = {};


    const monthOnShore = Object.keys(onsiteSum);
    monthOnShore.map((monthOnShore) => {
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
        YearOnShore2[data] = sum;
    });
    Object.keys(YearOnShore2).map((key) => {
        const year = Number(`20${key}`);
        YearOnShore2[year] = YearOnShore2[key];
        delete YearOnShore2[key];
    });
    // const offshoreTotal = Object.values(offshoreSum).reduce(
    //     (total, value) => total + value,
    //     0
    //   );

    //   const onsiteTotal = Object.values(onsiteSum).reduce(
    //     (total, value) => total + value,
    //     0
    //   );
    //   console.log(offshoreTotal,onsiteTotal)

    //UPDATE EXCEL DATA
    dataUpdate(YearOffShore2, YearOnShore2);
};

const dataUpdate = (YearOffShore: TypeYearValueCalcutaion2, YearOnShore: TypeYearValueCalcutaion2) => {
    const workbook: xlsx.WorkBook = xlsx.readFile("./src/resources/Output.xlsx", {
        cellFormula: true,
        type: "binary",
        cellDates: true,
        cellStyles: true,
    });

    const sheetnames = workbook.SheetNames;

    const allYears: { [key: string]: { offshore: number, onshore: number, offRate: number, onRate: number } } = {};
    // 

    Object.keys(YearOffShore).map((year: string) => {
        if (Object.prototype.hasOwnProperty.call(YearOnShore, year)) {
            allYears[year] = {
                offshore: YearOffShore[year],
                onshore: YearOnShore[year],
                offRate: 3260,
                onRate: 11075,
            };
        }
    })
    
    const headers = ["Year", "Type", "Hours", "Rate", "Consumption"];
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
        Object.entries(allYears).flatMap(([year, values]) => [
            [
                year,
                "Offshore",
                values.offshore,
                values.offRate,
                values.offshore * values.offRate,
            ],
            [
                year,
                "Onsite",
                values.onshore,
                values.onRate,
                values.onshore * values.onRate,
            ],
        ])
    );

    xlsx.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    const style = {
        fill: {
            patternType: "solid",
            fgColor: {
                theme: 4,
                tint: 0.5999938962981048,
                rgb: "B9CDE5",
            },
            bgColor: {
                indexed: 64,
            },
        },
        border: {
            top: {
                style: "thin",
                color: "FFFFFF",
            },
            bottom: {
                style: "thin",
                color: "FFFFFF",
            },
            left: {
                style: "thin",
                color: "FFFFFF",
            },
            right: {
                style: "thin",
                color: "FFFFFF",
            },
        },
    };

    let rowIndex = 2;
    const header = 1;

    Object.keys(allYears).map((year: string) => {
        const yearData = allYears[year];

        //Headers
        worksheet[`A${header}`] = { t: "s", v: "Year", s: style };
        worksheet[`B${header}`] = { t: "s", v: "Type", s: style };
        worksheet[`C${header}`] = { t: "s", v: "Hours", s: style };
        worksheet[`D${header}`] = { t: "s", v: "Rate (JPY)", s: style };
        worksheet[`E${header}`] = { t: "s", v: "Consumption", s: style };

        //// Offshore

        worksheet[`C${rowIndex}`] = { t: "n", v: yearData.offshore };
        worksheet[`D${rowIndex}`] = { t: "s", v: "JPY 3260" };
        const consumptionFormula = `="JPY"&" "&ROUND(C${rowIndex}*REPLACE(D${rowIndex},1,4,0),2)`;
        worksheet[`E${rowIndex}`] = { t: "n", f: consumptionFormula };
        rowIndex++;

        //// Onsite

        worksheet[`C${rowIndex}`] = { t: "n", v: yearData.onshore };
        worksheet[`D${rowIndex}`] = { t: "s", v: "JPY 11075" };
        const consumptionFormula2 = `="JPY"&" "&ROUND(C${rowIndex}*REPLACE(D${rowIndex},1,4,0),2)`;
        worksheet[`E${rowIndex}`] = { t: "n", f: consumptionFormula2 };
        rowIndex++;
    })

    // console.log(worksheet, 'final sheet');

    const newwb: xlsx.WorkBook = xlsx.utils.book_new();
    worksheet["!cols"] = [
        { width: 7 },
        { width: 10 },
        { width: 12 },
        { width: 10 },
        { width: 20 },
    ];
    xlsx.utils.book_append_sheet(newwb, worksheet, "JP-EV");
    sheetnames.map((sheet: string) => {
        if (sheet !== "JP-EV") {
            const ws = workbook.Sheets[sheet];
            xlsx.utils.book_append_sheet(newwb, ws, sheet);
        }
    });

    //writng workbook to xlsx file
    xlsx.writeFile(newwb, "./src/resources/Output.xlsx", {
        bookType: "xlsx",
        type: "file",
        bookSST: true,
        cellStyles: true,
    });
};