import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import entityCreate from "../../../utils/entity";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import AreYouSureDialog from "../../common/AreYouSureDialog";
import DynaLoaderDatatable from "./DynaLoaderDataTable";
import DynaLoaderEditDialogComponent from "./DynaLoaderEditDialogComponent";
import DynaLoaderCreateDialogComponent from "./DynaLoaderCreateDialogComponent";

const DynaLoaderPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [showAreYouSureDialog, setShowAreYouSureDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRecord, setRecord] = useState({});
  const [showFakerDialog, setShowFakerDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showSeederDialog, setShowSeederDialog] = useState(false);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilterFields, setSelectedFilterFields] = useState([]);
  const [selectedHideFields, setSelectedHideFields] = useState([]);
  const [showColumns, setShowColumns] = useState(false);
  const [searchDialog, setSearchDialog] = useState(false);
  const urlParams = useParams();
  const filename = "dynaLoader.csv";

  useEffect(() => {
    const _getSchema = async () => {
      const _schema = await props.getSchema("dynaLoader");
      let _fields = _schema.data.map((field, i) => i > 5 && field.field);
      setSelectedHideFields(_fields);
      _fields = _schema.data.map((field, i) => {
        return {
          name: field.field,
          value: field.field,
          type: field?.properties?.type,
        };
      });
      setFields(_fields);
    };
    _getSchema();
    if (location?.state?.action === "create") {
      entityCreate(location, setRecord);
      setShowCreateDialog(true);
    } else if (location?.state?.action === "edit") {
      setShowCreateDialog(true);
    }
    location.state = null;
  }, []);

  useEffect(() => {
    //on mount
    client
      .service("dynaLoader")
      .find({
        query: {
          $limit: 10000,
          $populate: [
            {
              path: "createdBy",
              service: "users",
              select: ["name"],
            },
            {
              path: "updatedBy",
              service: "users",
              select: ["name"],
            },
          ],
        },
      })
      .then((res) => {
        let results = res.data;
        setData(results);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "DynaLoader",
          type: "error",
          message: error.message || "Failed get DynaLoader",
        });
      });
  }, [showFakerDialog, showDeleteAllDialog]);

  const onClickSaveFilteredfields = (ff) => {
    console.log(ff);
  };

  const onClickSaveHiddenfields = (ff) => {
    console.log(ff);
  };

  const onEditRow = (rowData, rowIndex) => {
    setSelectedEntityIndex(rowData._id);
    setShowEditDialog(true);
  };

  const onCreateResult = (newEntity) => {
    setData([...data, newEntity]);
  };
  const onFakerCreateResults = (newEntities) => {
    setSelectedEntityIndex();
    setData([...data, ...newEntities]);
  };
  const onSeederResults = (newEntities) => {
    setSelectedEntityIndex();
    setData([...data, ...newEntities]);
  };

  const onEditResult = (newEntity) => {
    let _newData = _.cloneDeep(data);
    _.set(_newData, { _id: selectedEntityIndex }, newEntity);
    setData(_newData);
  };

  const deleteRow = async () => {
    try {
      await client.service("dynaLoader").remove(selectedEntityIndex);
      await deleteDynaFieldsAll(data[selectedEntityIndex]?._id);
      let _newData = data.filter((data) => data._id !== selectedEntityIndex);
      setData(_newData);
      setSelectedEntityIndex();
      setShowAreYouSureDialog(false);
    } catch (error) {
      console.log({ error });
      props.alert({
        title: "DynaLoader",
        type: "error",
        message: error.message || "Failed delete record",
      });
    }
  };
  const onRowDelete = (index) => {
    setSelectedEntityIndex(index);
    setShowAreYouSureDialog(true);
  };

  const onShowDeleteAll = (rowData, rowIndex) => {
    setShowDeleteAllDialog(true);
  };

  const deleteAll = async () => {
    if (process.env.REACT_APP_ENV !== "development") {
      props.alert({
        title: "Delete is disabled for non-dev envs",
        type: "error",
        message: "Delete is not recommended.",
      });
      return;
    }

    setShowDeleteAllDialog(false);
    const countDataItems = data?.length;
    const promises = data.map((e) =>
      client.service("dynaLoader").remove(e._id),
    );
    await Promise.all(
      promises.map((p) =>
        p.catch((error) => {
          props.alert({
            title: "DynaLoader",
            type: "error",
            message: error.message || "Failed to delete all records",
          });
          console.log({ error });
        }),
      ),
    );

    await props.alert({
      title: "DynaLoader",
      type: "warn",
      message: `Successfully dropped ${countDataItems} records`,
    });
  };

  const deleteDynaFieldsAll = async (id) => {
    const dynaFields = await client
      .service("dynaFields")
      .find({ query: { dynaLoader: id } });
    const promises = dynaFields?.data?.map((e) =>
      client.service("dynaFields").remove(e._id),
    );
    await Promise.all(
      promises.map((p) =>
        p.catch((error) => {
          props.alert({
            title: "DynaFields",
            type: "error",
            message: error.message || "Failed to delete all records",
          });
          console.log({ error });
        }),
      ),
    );
    await props.alert({
      title: "DynaFields",
      type: "warn",
      message: `Successfully dropped ${dynaFields?.data?.length} records`,
    });
  };

  const onRowClick = ({ data }) => {
    navigate(`/dynaLoader/${data._id}`);
  };

  const menuItems = [
    {
      label: "Testing",
      icon: "pi pi-check-circle",
      items: [
        {
          label: "Faker",
          icon: "pi pi-bullseye",
          command: (e) => {
            setShowFakerDialog(true);
          },
          show: true,
        },
        {
          label: `Drop ${data?.length}`,
          icon: "pi pi-trash",
          command: (e) => {
            setShowDeleteAllDialog(true);
          },
        },
      ],
    },
    {
      label: "Datum",
      icon: "pi pi-database",
      items: [
        {
          label: "Seeder",
          icon: "pi pi-box",
          command: (e) => {
            setShowSeederDialog(true);
          },
          show: true,
        },
      ],
    },
    {
      label: "Columns",
      icon: "pi pi-objects-column",
      items: [
        {
          label: `Hide`,
          icon: "pi pi-exclamation-triangle",
          command: () => setShowColumns(true),
        },
        {
          label: `Show All`,
          icon: "pi pi-exclamation-triangle",
          command: () => setSelectedHideFields([]),
        },
        {
          label: `Filter`,
          icon: "pi pi-filter",
          command: () => setShowFilter(true),
        },
        {
          label: `Clear`,
          icon: "pi pi-filter-slash",
          command: () => setSelectedFilterFields([]),
        },
      ],
    },
    // {
    //     label: `Search`,
    //     icon: "pi pi-search",
    //     command : () => setSearchDialog(true)
    // },
    // {
    //     label: `Check`,
    //     icon: "pi pi-list-check",
    // },
  ];

  const onDynaFieldJob = async () => {
    let _data = {
      name: _entity?.name,
      type: "dynaLoader",
      data: [],
      service: _entity?.from,
      start: Date.now(),
      end: _entity?.end,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("jobQues").create(_data);
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Job Ques created successfully",
      });
      props.onCreateResult(result);
    } catch (error) {
      console.log("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Job Ques",
      });
    }
    setLoading(false);
  };

  return (
    <div className="mt-5">
      <div className="grid">
        <div className="col-6 flex justify-content-start">
          <h4 className="mb-0 ml-2">
            <span>
              {" "}
              <small>Data</small> /{" "}
            </span>
            <strong>Dynaloader </strong>
          </h4>
        </div>
        <div className="col-6 flex justify-content-end">
          <>
            <Button
              label="add"
              style={{ height: "30px" }}
              rounded
              icon="pi pi-plus"
              onClick={() => setShowCreateDialog(true)}
              role="dynaLoader-add-button"
            />
            <SplitButton
              model={menuItems.filter(
                (m) => !(m.icon === "pi pi-trash" && data?.length === 0),
              )}
              dropdownIcon="pi pi-ellipsis-v"
              buttonClassName="hidden"
              menuButtonClassName="ml-1 p-button-text"
            ></SplitButton>
          </>
        </div>
      </div>
      <div className="grid align-items-center">
        <div className="col-12" role="dynaLoader-datatable">
          <DynaLoaderDatatable
            items={data}
            fields={fields}
            onRowDelete={onRowDelete}
            onEditRow={onEditRow}
            onRowClick={onRowClick}
            searchDialog={searchDialog}
            setSearchDialog={setSearchDialog}
            showUpload={showUpload}
            setShowUpload={setShowUpload}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            showColumns={showColumns}
            setShowColumns={setShowColumns}
            onClickSaveFilteredfields={onClickSaveFilteredfields}
            selectedFilterFields={selectedFilterFields}
            setSelectedFilterFields={setSelectedFilterFields}
            selectedHideFields={selectedHideFields}
            setSelectedHideFields={setSelectedHideFields}
            onClickSaveHiddenfields={onClickSaveHiddenfields}
            loading={loading}
            user={props.user}
          />
        </div>
      </div>

      <AreYouSureDialog
        header="Delete"
        body="Are you sure you want to delete this record?"
        show={showAreYouSureDialog}
        onHide={() => setShowAreYouSureDialog(false)}
        onYes={() => deleteRow()}
      />

      <DynaLoaderCreateDialogComponent
        data={data}
        entity={newRecord}
        show={showCreateDialog}
        onHide={() => setShowCreateDialog(false)}
        onCreateResult={onCreateResult}
      />
    </div>
  );
};
const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  getSchema: (serviceName) => dispatch.db.getSchema(serviceName),
});

export default connect(mapState, mapDispatch)(DynaLoaderPage);
