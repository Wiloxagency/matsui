import "./inkCalculator.scss";
import { Input } from "@nextui-org/input";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { cn } from "@nextui-org/system";
import { useEffect, useState } from "react";

import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
// import "../node_modules/react-super-responsive-table/dist/SuperResponsive";
import "../../../node_modules/react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useMediaQuery } from "react-responsive";
import { calculateResults } from "./costCalculation";

export default function InkCalculator() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [artworkHeight, setArtworkHeight] = useState<number>(10);
  const [artworkWidth, setArtworkWidth] = useState<number>(8);
  const [inkCost, setInkCost] = useState<number>(20);
  const [coverage, setCoverage] = useState<number>(100);

  const [calculatorUnit, setCalculatorUnit] = useState<string>("inch");

  const initialInchValues = [
    {
      meshCount: 355,
      depositThickness: 1,
      unitPerGallon: 230.4,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
    {
      meshCount: 200,
      depositThickness: 2,
      unitPerGallon: 115.2,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
    {
      meshCount: 130,
      depositThickness: 3,
      unitPerGallon: 76.752,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
    {
      meshCount: 110,
      depositThickness: 3.5,
      unitPerGallon: 61.176,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
    {
      meshCount: 96,
      depositThickness: 4,
      unitPerGallon: 57.6,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
    {
      meshCount: 60,
      depositThickness: 5,
      unitPerGallon: 46.08,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
  ];

  const initialCmValues = [
    {
      meshCount: 355,
      depositThickness: 1,
      unitPerGallon: 1486448.64,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
    {
      meshCount: 200,
      depositThickness: 2,
      unitPerGallon: 743224.32,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
    {
      meshCount: 130,
      depositThickness: 3,
      unitPerGallon: 495173.2,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
    {
      meshCount: 110,
      depositThickness: 3.5,
      unitPerGallon: 433392.68,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
    {
      meshCount: 96,
      depositThickness: 4,
      unitPerGallon: 371612.16,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
    {
      meshCount: 60,
      depositThickness: 5,
      unitPerGallon: 297289.73,
      printsPerGallon: 0,
      costPerShirt: 0,
    },
  ];

  const columns = [
    {
      key: "mesh",
      label: "MESH COUNT",
      mobileLabel: "MESH COUNT",
    },
    {
      key: "thickness",
      label: "DEPOSIT THICKNESS",
      mobileLabel: "DEP. THICKNESS",
    },
    {
      key: "inches",
      label: "UNIT PER GALLON",
      mobileLabel: "UNIT / GALLON",
    },
    {
      key: "prints",
      label: "PRINTS PER GALLON",
      mobileLabel: "PRINTS / GALLON",
    },
    {
      key: "cost",
      label: "COST PER SHIRT",
      mobileLabel: "COST / SHIRT",
    },
  ];

  const [resultValues, setResultValues] = useState<
    {
      meshCount: number;
      depositThickness: number;
      unitPerGallon: number;
      // squareInchesPerGallon: number;
      // squareCmPerGallon: number;
      printsPerGallon: number;
      costPerShirt: number;
    }[]
  >([]);

  useEffect(() => {
    let calculatedResults;
    if (calculatorUnit === "inch" || calculatorUnit === "cm") {
      calculatedResults = calculateResults(
        {
          unit: calculatorUnit,
          height: artworkHeight,
          width: artworkWidth,
          inkCost: inkCost,
          coverage: coverage,
        },
        calculatorUnit === "inch" ? initialInchValues : initialCmValues
      );
      console.log(calculatedResults);
      setResultValues(calculatedResults);
    }
  }, [calculatorUnit, artworkHeight, artworkWidth, inkCost, coverage]);

  useEffect(() => {
    setResultValues(initialInchValues);
  }, []);

  return (
    <div
      className={
        isMobile ? "inkCalculatorLayout mobileLayout" : "inkCalculatorLayout"
      }
    >
      <div className="leftSection">
        <div className="sectionHeader">
          <span>MEASUREMENTS</span>
        </div>
        <div className="card">
          <div className="flex flex-col gap-3">
            <RadioGroup
              label="Select the measurement unit"
              value={calculatorUnit}
              onValueChange={setCalculatorUnit}
              orientation="horizontal"
            >
              <Radio
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                }}
                value="inch"
              >
                inch
              </Radio>
              <Radio
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-1",
                    "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                }}
                value="cm"
              >
                cm
              </Radio>
            </RadioGroup>
            <Input
              type="number"
              label="Arwork height"
              min={0}
              labelPlacement="outside"
              value={String(artworkHeight)}
              onValueChange={(value) => setArtworkHeight(Number(value))}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">
                    {calculatorUnit}
                  </span>
                </div>
              }
            />
            <Input
              type="number"
              label="Arwork width"
              min={0}
              labelPlacement="outside"
              value={String(artworkWidth)}
              onValueChange={(value) => setArtworkWidth(Number(value))}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">
                    {calculatorUnit}
                  </span>
                </div>
              }
            />
            <Input
              type="number"
              label="Ink cost"
              min={0}
              placeholder="000"
              labelPlacement="outside"
              value={String(inkCost)}
              onValueChange={(value) => setInkCost(Number(value))}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small whitespace-nowrap">
                    per gallon
                  </span>
                </div>
              }
            />
            <Input
              type="number"
              label="Coverage"
              min={0}
              max={100}
              placeholder="000"
              labelPlacement="outside"
              value={String(coverage)}
              onValueChange={(value) => setCoverage(Number(value))}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small whitespace-nowrap">
                    %
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </div>
      <div className="rightSection">
        <div className="sectionHeader">
          <span>ESTIMATED RESULTS</span>
        </div>
        <div
          className="card"
          style={{ width: "100%", minWidth: "350px", maxWidth: "100vw" }}
        >
          <Table className="inkCalculatorTable">
            <Thead>
              <Tr>
                {columns.map((columnHeader) => {
                  return (
                    <Th key={columnHeader.key}>
                      {isMobile ? columnHeader.mobileLabel : columnHeader.label}
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {resultValues.map((row) => {
                return (
                  <Tr key={row.meshCount}>
                    <Td>{row.meshCount}</Td>
                    <Td>{row.depositThickness}</Td>
                    <Td>
                      {row.unitPerGallon.toLocaleString(undefined, {maximumFractionDigits:2})}{" "}
                      {calculatorUnit === "inch" ? " in" : " cm"}
                    </Td>
                    <Td>{row.printsPerGallon}</Td>
                    <Td>{row.costPerShirt}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
