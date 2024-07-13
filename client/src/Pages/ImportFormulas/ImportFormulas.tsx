import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/modal";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { FaDownload, FaTrash } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import DeleteSeriesModal from "../../Components/Modals/DeleteSeriesModal/DeleteSeriesModal";
import CustomDropzone from "../../Components/Dropzone/Dropzone";
import ImportedSeriesModal from "../../Components/Modals/ImportedSeriesModal/ImportedSeriesModal";
import {
  api,
  useAddSeriesMutation,
  useDeleteSeriesMutation,
  useGetPigmentsQuery,
  useImportFormulasMutation,
} from "../../State/api";
import "./ImportFormulas.scss";
import { FormulaComponentInterface } from "../../interfaces/interfaces";
import MissingPigmentsModal from "../../Components/Modals/MissingPigmentsModal/MissingPigments";
import { useNavigate } from "react-router-dom";

// interface ImportFormulaHeaderColumnIndexesInterface {
//   indexFormulaCode: number;
//   indexFormulaDescription: number;
//   indexComponentCode: number;
//   indexComponentDescription: number;
//   indexPercentage: number;
// }

// TODO: OPTIMIZE THIS LATER. THE LABELS SHOULD BE PART OF AN ARRAY
// OF HEADER OBJECTS 👇🏻
// const labels = [
//   "FORMULA CODE",
//   "FORMULA DESCRIPTION",
//   "COMPONENT CODE",
//   "COMPONENT DESCRIPTION",
//   "COMPONENT PERCENTAGE",
// ];

export default function ImportFormulas() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  // const [isSwitchSelected, setIsSwitchSelected] = useState(true);
  const [JSONFormulas, setJSONFormulas] = useState<unknown[]>([]);
  const [mappedComponents, setMappedComponents] = useState<
    FormulaComponentInterface[]
  >([]);
  const [extractedHeaders, setExtractedHeaders] = useState<string[]>([]);
  const [missingPigments, setMissingPigments] = useState<string[]>([]);
  const [newSeriesName, setNewSeriesName] = useState<string>("");
  const [seriesToDelete, setSeriesToDelete] = useState<string>("");
  const [wasSeriesDeleted, setWasSeriesDeleted] = useState<boolean | undefined>(
    undefined
  );
  const [numberOfDeletedComponents, setNumberOfDeletedComponents] = useState<
    number | null
  >(null);

  const [numberOfImportedFormulas, setNumberOfImportedFormulas] =
    useState<number>(0);

  const [nullFormulaCodes, setNullFormulaCodes] = useState<string[]>([]);

  const { data: fetchedPigments } = useGetPigmentsQuery();

  const {
    isOpen: isOpenDeleteSeriesModal,
    onOpenChange: onOpenChangeDeleteSeriesModal,
  } = useDisclosure();

  const {
    isOpen: isOpenImportedSeriesModal,
    onOpenChange: onOpenChangeImportedSeriesModal,
  } = useDisclosure();

  const {
    isOpen: isOpenMissingPigmentsModal,
    onOpenChange: onOpenChangeMissingPigmentsModal,
  } = useDisclosure();

  const [addSeries] = useAddSeriesMutation();
  const [importFormulas] = useImportFormulasMutation();
  const [deleteSeries] = useDeleteSeriesMutation();
  const [isSpinnerVisible, setIsSpinnerVisible] = useState<boolean>(false);
  const [triggerGetSeries] = api.endpoints.getSeries.useLazyQuery();

  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("isAdmin");

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

  // const [columnIndexes, setColumnIndexes] =
  //   useState<ImportFormulaHeaderColumnIndexesInterface>({
  //     indexFormulaCode: 1,
  //     indexFormulaDescription: 1,
  //     indexComponentCode: 1,
  //     indexComponentDescription: 1,
  //     indexPercentage: 1,
  //   });

  // function handleColumnIndexesChange(value: number, receivedHeader: string) {
  //   const columnIndexesShallowCopy: ImportFormulaHeaderColumnIndexesInterface =
  //     columnIndexes;

  //   columnIndexesShallowCopy[
  //     receivedHeader as keyof ImportFormulaHeaderColumnIndexesInterface
  //   ] = value;

  //   setColumnIndexes(columnIndexesShallowCopy);
  // }

  async function handleConfirmColumnHeaders() {
    // setValidationMessage(`The series you are about to upload has pigments are missing:`);
    // const columnValues: number[] = [];
    // for (const header of Object.keys(columnIndexes)) {
    //   columnValues.push(
    //     columnIndexes[header as keyof ImportFormulaHeaderColumnIndexesInterface]
    //   );
    // }
    // const repeatedValues = columnValues.filter(
    //   (e, i, a) => a.indexOf(e) !== i
    // ).length;

    // if (repeatedValues > 0) {
    //   setValidationMessage(
    //     "All fields must be set. Can't use the same column twice"
    //   );
    //   return;
    // }
    // const remappedJSONFormulas = await remapJSONFormulas(columnValues);
    setIsSpinnerVisible(true);
    await addSeries({ seriesName: newSeriesName })
      .unwrap()
      .then(async (response: any) => {
        if (response.message === "Series already exist") {
          alert(`Series named ${newSeriesName} already exist`);
          return;
        } else if (response.message === "Series created") {
          const importFormulasComponents = JSONFormulas.map(
            (component: any) => {
              // (component: FormulaComponentInterface) => {
              return { ...component, FormulaSerie: newSeriesName };
            }
          );

          const importFormulasPayload = {
            formulaComponents: importFormulasComponents,
            company: localStorage.getItem("userCompany")!,
            createdBy: localStorage.getItem("userEmail")!,
            formulaSeries: newSeriesName,
          };
          await importFormulas(importFormulasPayload)
            .unwrap()
            .then((importFormulasResponse) => {
              console.log("importFormulasResponse: ", importFormulasResponse);
              setIsSpinnerVisible(false);

              console.log(
                "Formulas not created: ",
                importFormulasResponse.formulasNotCreated
              );

              setNullFormulaCodes(importFormulasResponse.formulasNotCreated);

              setNumberOfImportedFormulas(
                importFormulasResponse.formulasCreated
              );
              triggerGetSeries();
              onOpenChangeImportedSeriesModal();
              resetFields();
            })
            .catch((error) => {
              console.error(error);
              setIsSpinnerVisible(false);
            });
        }
      });
  }

  function resetFields() {
    setNewSeriesName("");
    setJSONFormulas([]);
    setMappedComponents([]);
  }

  async function validateUploadedComponents() {
    const extractedComponents = Array.from(
      new Set(
        JSONFormulas.map(({ ComponentCode }: any) => {
          return ComponentCode;
        })
      )
    );

    if (fetchedPigments) {
      const existingPigments = Array.from(
        new Set(
          fetchedPigments.map(({ code }: any) => {
            return code;
          })
        )
      );

      const getMissingPigments = extractedComponents.filter(
        (item) => existingPigments.indexOf(item) == -1
      );

      // console.log(getMissingPigments);
      setMissingPigments(getMissingPigments);

      if (getMissingPigments.length > 0) {
        onOpenChangeMissingPigmentsModal();
      }

      const mapComponents = JSONFormulas.map((component: any) => {
        // (component: FormulaComponentInterface) => {
        return { ...component, FormulaSerie: newSeriesName };
      });
      setMappedComponents(mapComponents);
    }
  }

  // async function remapJSONFormulas(columnsMatchOrder: number[]) {
  //   const headers: string[] = Object.keys(JSONFormulas[0] as []);

  //   const columnsMatch = {
  //     FormulaCode: headers[columnsMatchOrder[0] - 1],
  //     FormulaDescription: headers[columnsMatchOrder[1] - 1],
  //     ComponentCode: headers[columnsMatchOrder[2] - 1],
  //     ComponentDescription: headers[columnsMatchOrder[3] - 1],
  //     Percentage: headers[columnsMatchOrder[4] - 1],
  //   };

  //   const transformComponent = (component: any) => {
  //     const transformed: any = {};
  //     for (const [newKey, oldKey] of Object.entries(columnsMatch)) {
  //       transformed[newKey] = component[oldKey];
  //     }
  //     return transformed;
  //   };

  //   const transformedComponents = JSONFormulas.map(transformComponent);
  //   console.log("Transformed Components: ", transformedComponents);
  //   setJSONFormulas(transformedComponents);
  //   return transformedComponents;
  // }

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
        setSeriesToDelete("");
      })
      .catch((error) => console.error("rejected", error));
    deleteSeriesResponse;
  }

  function handleCloseDeleteSeriesModal() {
    setWasSeriesDeleted(undefined);
    setNumberOfDeletedComponents(null);
    triggerGetSeries();
    onOpenChangeDeleteSeriesModal();
  }

  // useEffect(() => {
  //   console.log(columnIndexes);
  // }, [columnIndexes]);

  useEffect(() => {
    if (extractedHeaders.length > 0) {
      validateUploadedComponents();
    }
  }, [extractedHeaders]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/formulas");
    }
  });

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
        numberOfImportedFormulas={numberOfImportedFormulas}
        newSeriesName={newSeriesName}
        nullFormulaCodes={nullFormulaCodes}
      ></ImportedSeriesModal>
      <MissingPigmentsModal
        isOpenMissingPigmentsModal={isOpenMissingPigmentsModal}
        onOpenChangeMissingPigmentsModal={onOpenChangeMissingPigmentsModal}
        missingPigments={missingPigments}
      ></MissingPigmentsModal>
      <div
        className={
          isMobile ? "importFormulaLayout mobileLayout" : "importFormulaLayout"
        }
      >
        <div className="leftSection">
          <div className="sectionHeader">
            <span>UPLOAD FILE</span>
            <Button
              startContent={<FaDownload />}
              color="primary"
              onPress={handleTemplateDownload}
            >
              DOWNLOAD TEMPLATE
            </Button>
          </div>
          <div className="card">
            <p className="row">
              You must fill out the provided template in order to upload a
              series.
            </p>
            <p className="row">Upload the .xls file containing the series.</p>
            <p className="row">You can only upload one series at a time.</p>
            {/* <p className="row">
              Formula code, formula description, component code, component
              description, and component percentage.
            </p> */}
            <div className="row title">NEW SERIES NAME</div>
            <Input
              type="text"
              className="row"
              value={newSeriesName}
              onValueChange={setNewSeriesName}
            ></Input>
            {/* <div className="row title">
              DOES THE FIRST ROW CONTAIN THE HEADERS?
            </div>
            <Switch
              className="row"
              isSelected={isSwitchSelected}
              onValueChange={setIsSwitchSelected}
            >
              {isSwitchSelected ? "YES" : "NO"}
            </Switch> */}
            <div className={newSeriesName === "" ? "disabled" : undefined}>
              <CustomDropzone
                setJSONFormulas={setJSONFormulas}
                setExtractedHeaders={setExtractedHeaders}
              />
            </div>
          </div>
        </div>
        <div className="rightSection">
          <div className="sectionHeader">
            <span>VALIDATION</span>
          </div>
          <div className={JSONFormulas.length === 0 ? "card " : "card"}>
            {/* <div className={JSONFormulas.length === 0 ? "card disabled" : "card"}> */}
            {mappedComponents.length === 0 ? (
              <p className="mb-4">
                Here you'll see a preview of the formulas before uploading them
              </p>
            ) : (
              <>
                <div className="row title">COMPONENTS PREVIEW:</div>
                {mappedComponents.map((component, indexComponent) => {
                  if (indexComponent < 3)
                    return (
                      <Fragment key={indexComponent}>
                        <div className="componentPreview">
                          <div>
                            <span>Formula code: </span>
                            <span style={{ fontWeight: 600 }}>
                              {component.FormulaCode}
                            </span>
                          </div>
                          <div>
                            <span>Component code: </span>
                            <span style={{ fontWeight: 600 }}>
                              {component.ComponentCode}
                            </span>
                          </div>
                          <div>
                            <span>Component description: </span>
                            <span style={{ fontWeight: 600 }}>
                              {component.ComponentDescription}
                            </span>
                          </div>
                          <div>
                            <span>Percentage: </span>
                            <span style={{ fontWeight: 600 }}>
                              {component.Percentage}
                            </span>
                          </div>
                        </div>
                      </Fragment>
                    );
                })}
              </>
            )}

            {/* <div className="row title">
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
              )} */}

            <Button
              color="primary"
              variant="ghost"
              isDisabled={mappedComponents.length === 0}
              onPress={handleConfirmColumnHeaders}
              isLoading={isSpinnerVisible}
            >
              Confirm and upload series
            </Button>
          </div>

          <div className="sectionHeader mt-4">
            <span>DELETE SERIES</span>
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
