import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/modal";
import { Switch } from "@nextui-org/switch";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaDownload, FaTrash } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import DeleteSeriesModal from "../../Components/DeleteSeriesModal/DeleteSeriesModal";
import CustomDropzone from "../../Components/Dropzone/Dropzone";
import {
  api,
  useAddSeriesMutation,
  useDeleteSeriesMutation,
  useImportFormulasMutation,
} from "../../State/api";
import "./ImportFormulas.scss";
import ImportedSeriesModal from "../../Components/ImportedSeriesModal/ImportedSeriesModal";

interface ImportFormulaHeaderColumnIndexesInterface {
  indexFormulaCode: number;
  indexFormulaDescription: number;
  indexComponentCode: number;
  indexComponentDescription: number;
  indexPercentage: number;
}

// TODO: OPTIMIZE THIS LATER. THE LABELS SHOULD BE PART OF AN ARRAY
// OF HEADER OBJECTS 👇🏻
const labels = [
  "FORMULA CODE",
  "FORMULA DESCRIPTION",
  "COMPONENT CODE",
  "COMPONENT DESCRIPTION",
  "COMPONENT PERCENTAGE",
];

export default function ImportFormulas() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [isSwitchSelected, setIsSwitchSelected] = useState(true);
  const [JSONFormulas, setJSONFormulas] = useState<unknown[]>([]);
  const [extractedHeaders, setExtractedHeaders] = useState<string[]>([]);

  const [validationMessage, setValidationMessage] = useState<string>("");
  const [newSeriesName, setNewSeriesName] = useState<string>("");
  const [seriesToDelete, setSeriesToDelete] = useState<string>("");
  const [wasSeriesDeleted, setWasSeriesDeleted] = useState<boolean | undefined>(
    undefined
  );
  const [numberOfDeletedComponents, setNumberOfDeletedComponents] =
    useState<number>(0);

  const [numberOfImportedComponents, setNumberOfImportedComponents] =
    useState<number>(0);

  const {
    isOpen: isOpenDeleteSeriesModal,
    // onOpen: onOpenDeleteSeriesModal,
    onOpenChange: onOpenChangeDeleteSeriesModal,
  } = useDisclosure();

  const {
    isOpen: isOpenImportedSeriesModal,
    onOpenChange: onOpenChangeImportedSeriesModal,
  } = useDisclosure();

  const [addSeries] = useAddSeriesMutation();
  const [importFormulas] = useImportFormulasMutation();
  const [deleteSeries] = useDeleteSeriesMutation();

  const [triggerGetSeries] = api.endpoints.getSeries.useLazyQuery();

  const handleTemplateDownload = () => {
    axios({
      url: "https://sophieassets.blob.core.windows.net/files/MatsuiImportFormulaTemplate.xlsx",
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", "MatsuiImportFormulaTemplate.xlsx");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error downloading file: ", error);
      });
  };

  const [columnIndexes, setColumnIndexes] =
    useState<ImportFormulaHeaderColumnIndexesInterface>({
      indexFormulaCode: 1,
      indexFormulaDescription: 1,
      indexComponentCode: 1,
      indexComponentDescription: 1,
      indexPercentage: 1,
    });

  function handleColumnIndexesChange(value: number, receivedHeader: string) {
    const columnIndexesShallowCopy: ImportFormulaHeaderColumnIndexesInterface =
      columnIndexes;

    columnIndexesShallowCopy[
      receivedHeader as keyof ImportFormulaHeaderColumnIndexesInterface
    ] = value;

    setColumnIndexes(columnIndexesShallowCopy);
  }

  async function handleConfirmColumnHeaders() {
    setValidationMessage("");
    const columnValues: number[] = [];
    for (const header of Object.keys(columnIndexes)) {
      columnValues.push(
        columnIndexes[header as keyof ImportFormulaHeaderColumnIndexesInterface]
      );
    }
    const repeatedValues = columnValues.filter(
      (e, i, a) => a.indexOf(e) !== i
    ).length;

    if (repeatedValues > 0) {
      setValidationMessage(
        "All fields must be set. Can't use the same column twice"
      );
      return;
    }
    const remappedJSONFormulas = await remapJSONFormulas(columnValues);

    await addSeries({ seriesName: newSeriesName })
      .unwrap()
      .then(async (response) => {
        response;

        const importFormulasPayload = remappedJSONFormulas.map(
          (component: any) => {
            // (component: FormulaComponentInterface) => {
            return { ...component, FormulaSerie: newSeriesName };
          }
        );

        await importFormulas(importFormulasPayload)
          .unwrap()
          .then((importFormulasResponse: any) => {
            console.log("importFormulasResponse: ", importFormulasResponse);
            console.log(
              "importFormulasResponse: ",
              importFormulasResponse.insertedCount
            );
            setNumberOfImportedComponents(importFormulasResponse.insertedCount);
            triggerGetSeries();
            onOpenChangeImportedSeriesModal();
          });
      });
  }

  async function remapJSONFormulas(columnsMatchOrder: number[]) {
    // console.log(JSONFormulas);
    // console.log("columnsMatchOrder: ", columnsMatchOrder)
    // console.log("columnIndexes: ", columnIndexes);

    // return
    const headers: string[] = Object.keys(JSONFormulas[0] as []);

    // const columnsMatchOrder = [4, 5, 1, 2, 3];

    const columnsMatch = {
      FormulaCode: headers[columnsMatchOrder[0] - 1],
      FormulaDescription: headers[columnsMatchOrder[1] - 1],
      ComponentCode: headers[columnsMatchOrder[2] - 1],
      ComponentDescription: headers[columnsMatchOrder[3] - 1],
      Percentage: headers[columnsMatchOrder[4] - 1],
    };

    const transformComponent = (component: any) => {
      const transformed: any = {};
      for (const [newKey, oldKey] of Object.entries(columnsMatch)) {
        transformed[newKey] = component[oldKey];
      }
      return transformed;
    };

    const transformedComponents = JSONFormulas.map(transformComponent);
    console.log("Transformed Components: ", transformedComponents);
    setJSONFormulas(transformedComponents);
    return transformedComponents;
  }

  async function handleDeleteSeries(): Promise<void> {
    const deleteSeriesResponse = await deleteSeries({
      seriesName: seriesToDelete,
    })
      .unwrap()
      .then((payload: any) => {
        console.log("fulfilled", payload);
        const wasSeriesDeletedComputation =
          payload.deleteSeries.deletedCount > 0 ? true : false;
        setWasSeriesDeleted(wasSeriesDeletedComputation);
        setNumberOfDeletedComponents(payload.deleteComponents.deletedCount);
      })
      .catch((error) => console.error("rejected", error));
    deleteSeriesResponse;
  }

  function handleCloseDeleteSeriesModal() {
    onOpenChangeDeleteSeriesModal();
    setWasSeriesDeleted(undefined);
    setNumberOfDeletedComponents(0);
  }

  useEffect(() => {
    console.log(columnIndexes);
  }, [columnIndexes]);

  return (
    <>
      <DeleteSeriesModal
        isOpenDeleteSeriesModal={isOpenDeleteSeriesModal}
        onOpenChangeDeleteSeriesModal={onOpenChangeDeleteSeriesModal}
        seriesToDelete={seriesToDelete}
        handleDeleteSeries={handleDeleteSeries}
        wasSeriesDeleted={wasSeriesDeleted}
        numberOfDeletedComponents={numberOfDeletedComponents}
        handleCloseDeleteSeriesModal={handleCloseDeleteSeriesModal}
      ></DeleteSeriesModal>
      <ImportedSeriesModal
        isOpenImportedSeriesModal={isOpenImportedSeriesModal}
        onOpenChangeImportedSeriesModal={onOpenChangeImportedSeriesModal}
        numberOfImportedComponents={numberOfImportedComponents}
        newSeriesName={newSeriesName}
      ></ImportedSeriesModal>
      <div
        className={
          isMobile ? "importFormulaLayout mobileLayout" : "importFormulaLayout"
        }
      >
        <div className="leftSection">
          <div className="sectionHeader">
            <span>STEP 1: UPLOAD FILE</span>
            <Button
              startContent={<FaDownload />}
              color="primary"
              onPress={handleTemplateDownload}
            >
              DOWNLOAD TEMPLATE
            </Button>
          </div>
          <div className="card">
            <p className="row">Upload an .xls file containing a series.</p>
            <p className="row">You can only upload one series at a time.</p>
            <p className="row">
              Make sure the spreadsheet contains the following information:
            </p>
            <p className="row">
              Formula code, formula description, component code, component
              description, and component percentage.
            </p>
            <div className="row title">NEW SERIES NAME</div>
            <Input
              type="text"
              className="row"
              value={newSeriesName}
              onValueChange={setNewSeriesName}
            ></Input>
            <div className="row title">
              DOES THE FIRST ROW CONTAIN THE HEADERS?
            </div>
            <Switch
              className="row"
              isSelected={isSwitchSelected}
              onValueChange={setIsSwitchSelected}
            >
              {isSwitchSelected ? "YES" : "NO"}
            </Switch>
            <div className={newSeriesName === "" ? "disabled" : undefined}>
              <CustomDropzone
                setJSONFormulas={setJSONFormulas}
                setExtractedHeaders={setExtractedHeaders}
              />
            </div>
          </div>
        </div>
        <div className="rightSection" style={{ minWidth: "350px" }}>
          <div
            className={
              JSONFormulas.length === 0
                ? "disabled formulaDetailsContainer"
                : "formulaDetailsContainer"
            }
          >
            <div className="sectionHeader">
              <span>STEP 2: MATCH THE COLUMNS TO THE CORRESPONDING VALUES</span>
            </div>
            <div className="card">
              <div className="row title">
                <span style={{ flex: "2" }}>SOURCE HEADER</span>
                <span style={{ flex: "1" }}>SOURCE COLUMN</span>
              </div>

              <div className="mt-3">
                {extractedHeaders.map((header: string, indexHeader) => {
                  return (
                    <div key={header} className="row">
                      <span style={{ flex: "3" }}>{header}</span>
                      <span style={{ flex: "1" }}>
                        <Input
                          type="number"
                          size="sm"
                          disabled
                          placeholder={String(indexHeader + 1)}
                        ></Input>
                      </span>
                    </div>
                  );
                  //  <span key={header}> {header}, </span>;
                })}
              </div>

              <div className="row title">
                <span style={{ flex: "2" }}>TARGET HEADER</span>
                <span style={{ flex: "1" }}>TARGET COLUMN</span>
              </div>
              {Object.entries(columnIndexes).map(
                ([key, value], indexHeader) => {
                  value;
                  return (
                    <div key={key} className="row">
                      <span style={{ flex: "3" }}>{labels[indexHeader]}</span>
                      <span style={{ flex: "1" }}>
                        <Input
                          type="number"
                          // value={value.toString()}
                          // placeholder={value.toString()}
                          min={1}
                          onValueChange={(inputValue) => {
                            handleColumnIndexesChange(Number(inputValue), key);
                          }}
                        ></Input>
                      </span>
                    </div>
                  );
                }
              )}
              <p
                style={{ color: "red", textAlign: "center" }}
                className={
                  validationMessage !== ""
                    ? "validationErrorMessage active"
                    : "validationErrorMessage"
                }
              >
                {validationMessage}
              </p>
              <Button
                color="primary"
                variant="ghost"
                onPress={handleConfirmColumnHeaders}
              >
                Confirm order and upload series
              </Button>
            </div>
          </div>
        </div>
        <div className="tempRightmostSectiom">
          <div className="sectionHeader">
            <span>Temp: Delete series</span>
          </div>
          <div className="card mt-4">
            <Input
              className="my-4"
              label="Type here the name of the series to be deleted"
              color="primary"
              value={seriesToDelete}
              onValueChange={setSeriesToDelete}
            ></Input>
            <Button
              color="danger"
              variant="ghost"
              startContent={<FaTrash />}
              onPress={onOpenChangeDeleteSeriesModal}
              isDisabled={seriesToDelete == ""}
            >
              Delete series
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
