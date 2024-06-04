"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
var iconv = require("iconv-lite");
import JSZip from "jszip";

interface stkData {
  id?: number;
  partRef: string;
  partMat: string;
  partW: number;
  partL: number;
}

interface stkTableProps {
  stk: stkData[];
}

export const StkTable = (props: stkTableProps) => {
  return (
    <main>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>אזכור</th>
              <th>חומר</th>
              <th>אורך מ"מ</th>
              <th>רוחב מ"מ</th>
            </tr>
          </thead>
          <tbody>
            {props.stk.map((row) => (
              <tr key={row.id}>
                <td>{row.partRef}</td>
                <td>{row.partMat}</td>
                <td>{row.partL}</td>
                <td>{row.partW}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default function Home() {
  const [projName, setProjName] = useState<string>("");
  const [prodName, setProdName] = useState<string>("");
  const [width, setWidth] = useState<number>(0);
  const [len, setLen] = useState<number>(0);
  const [material, setMaterial] = useState<string>("");
  const [orderNum, setOrderNum] = useState<number>(0);

  const [stk, setStk] = useState<stkData[]>([]);
  const [stkText, setStkText] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;

    const data = {
      projName: target.projName?.value,
      prodName: target.prodName?.value,
      width: target.width?.value,
      len: target.len?.value,
      material: target.material?.value,
      orderNum: target.orderNum?.value,
    };

    setProjName(data.projName);
    setProdName(data.prodName);
    setWidth(data.width);
    setLen(data.len);
    setMaterial(data.material);
    setOrderNum(data.orderNum);
  };

  useEffect(() => {
    if (
      projName !== "" &&
      prodName !== "" &&
      width !== 0 &&
      len !== 0 &&
      material !== "" &&
      orderNum !== 0
    )
      buildStk();
  }, [prodName, width, len, material, orderNum]);

  const buildStk = () => {
    const arr = [
      { id: 1, ...amod() },
      { id: 2, ...mehetsa() },
    ];
    setStk(arr);
  };

  useEffect(() => {
    if (stk.length !== 0) {
      //stkText
      // Create the header line
      const headerLine = Object.keys(stk[0]).join(",");

      // Convert array of objects to CSV string
      const csvContent = stk
        .map((obj) => Object.values(obj).join(","))
        .join("\r\n");

      // Combine header line and CSV data
      const csvData = `${headerLine}\n${csvContent}`;

      // Add BOM to make it UTF-8 compatible
      const bomUtf8 = "\ufeff";

      setStkText(csvData);
    }
  }, [JSON.stringify(stk)]);

  /**
   * עומד ארון
   */
  const amod = () => {
    //ref
    let partRef = "";
    if (prodName === "ארון") {
      partRef = "עומד ארון";
    }
    //mat
    let partMat = "";
    if (width < 40) {
      partMat = material + "_17";
    } else {
      partMat = material + "_24";
    }
    //width
    const partW = width * 10;
    //length
    const partL = len * 10;

    return {
      partRef: partRef,
      partMat: partMat,
      partW: partW,
      partL: partL,
    };
  };

  /**
   * מחיצה
   */
  const mehetsa = (): stkData => {
    //ref
    let partRef = "";
    if (prodName === "ארון") {
      partRef = "מחיצה";
    }
    //mat
    let partMat = "";
    if (material.includes("שמנת")) {
      partMat = material + "_17";
    } else {
      partMat = material + "_24";
    }
    //width
    const partW = width * 10;
    //length
    const partL = len * 10;

    return {
      partRef: partRef,
      partMat: partMat,
      partW: partW,
      partL: partL,
    };
  };

  const utf = "\ufeff";

  // const handleDownload = () => {
  //   var link = window.document.createElement("a");
  //   // Convert text to binary data using Windows-1255 encoding
  //   var textEncoded = iconv.encode(stkText, "win1255");

  //   // Create a Blob object with the encoded text
  //   var blob = new Blob([textEncoded], {
  //     type: "text/plain;charset=windows-1255",
  //   });

  //   // Create a URL for the Blob object
  //   var url = URL.createObjectURL(blob);

  //   // Set attributes for the download link
  //   link.setAttribute("href", url);
  //   link.setAttribute("download", "test-csvText-1.txt");

  //   // Simulate a click event to trigger the download
  //   link.click();
  // };

  const handleDownloadZip = () => {
    const zip = new JSZip();

    // Add text file to zip
    const textEncoded = iconv.encode(stkText, "win1255");
    zip.file("csvTestX-1.csv", textEncoded);
    zip.file("csvTestX-2.csv", textEncoded);
    zip.file("csvTestX-3.csv", textEncoded);

    // Generate the zip file
    zip.generateAsync({ type: "blob" }).then((blob) => {
      // Create a URL for the zip file
      const url = URL.createObjectURL(blob);

      // Create a link for downloading the zip file
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projName}.zip`;

      // Simulate a click event to trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to release memory
      URL.revokeObjectURL(url);
    });
  };

  return (
    <main>
      <div className={styles.formContainer}>
        <form className="">
          <label>
            שם פרויקט:
            <input
              type="text"
              name="projName"
              onChange={(e) => setProjName(e.currentTarget.value)}
              className=" "
            />
          </label>
          <label>
            שם מוצר:
            <input
              type="text"
              name="prodName"
              onChange={(e) => setProdName(e.currentTarget.value)}
              className=" "
            />
          </label>
          <label>
            רוחב ס"מ:
            <input
              type="number"
              name="width"
              onChange={(e) => setWidth(parseFloat(e.currentTarget.value))}
              className=""
            />
          </label>
          <label>
            אורך ס"מ:
            <input
              type="number"
              name="len"
              onChange={(e) => setLen(parseFloat(e.currentTarget.value))}
              className=""
            />
          </label>
          <label>
            חומר:
            <input
              type="text"
              name="material"
              onChange={(e) => setMaterial(e.currentTarget.value)}
              className=""
            />
          </label>
          <label>
            מס הזמנה:
            <input
              type="number"
              name="orderNum"
              onChange={(e) => setOrderNum(parseFloat(e.currentTarget.value))}
              className=""
            />
          </label>
          {/* <input type="submit" value="Submit" className="" /> */}
        </form>
      </div>
      {stkText !== "" && (
        <button className={styles.exportBtn} onClick={handleDownloadZip}>
          Export
        </button>
      )}
      {stkText !== "" && <StkTable stk={stk} />}
    </main>
  );
}
