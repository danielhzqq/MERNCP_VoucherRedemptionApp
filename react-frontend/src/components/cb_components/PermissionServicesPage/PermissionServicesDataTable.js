import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useRef } from "react";
import _ from "lodash";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import moment from "moment";
import UploadService from "../../../services/UploadService";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";

const PermissionServicesDataTable = ({
  items,
  fields,
  onEditRow,
  onRowDelete,
  onRowClick,
  searchDialog,
  setSearchDialog,
  showUpload,
  setShowUpload,
  showFilter,
  setShowFilter,
  showColumns,
  setShowColumns,
  onClickSaveFilteredfields,
  selectedFilterFields,
  setSelectedFilterFields,
  selectedHideFields,
  setSelectedHideFields,
  onClickSaveHiddenfields,
  loading,
  user,
}) => {
  const dt = useRef(null);
  const urlParams = useParams();
  const [globalFilter, setGlobalFilter] = useState("");

  const pTemplate0 = (rowData, { rowIndex }) => <p>{rowData.service}</p>;
  const p_booleanTemplate1 = (rowData, { rowIndex }) => (
    <p>{String(rowData.create)}</p>
  );
  const pTemplate2 = (rowData, { rowIndex }) => <p>{rowData.read}</p>;
  const pTemplate3 = (rowData, { rowIndex }) => <p>{rowData.update}</p>;
  const pTemplate4 = (rowData, { rowIndex }) => <p>{rowData.delete}</p>;
  const dropdownTemplate5 = (rowData, { rowIndex }) => (
    <p>{rowData.profile?.name}</p>
  );
  const dropdownTemplate6 = (rowData, { rowIndex }) => (
    <p>{rowData.roleId?.name}</p>
  );
  const dropdownTemplate7 = (rowData, { rowIndex }) => (
    <p>{rowData.positionId?.name}</p>
  );
  const dropdownTemplate8 = (rowData, { rowIndex }) => (
    <p>{rowData.employeeId?.name}</p>
  );
  const dropdownTemplate9 = (rowData, { rowIndex }) => (
    <p>{rowData.userId?.name}</p>
  );
  const editTemplate = (rowData, { rowIndex }) => (
    <Button
      onClick={() => onEditRow(rowData, rowIndex)}
      icon={`pi ${rowData.isEdit ? "pi-check" : "pi-pencil"}`}
      className={`p-button-rounded p-button-text ${rowData.isEdit ? "p-button-success" : "p-button-warning"}`}
    />
  );
  const deleteTemplate = (rowData, { rowIndex }) => (
    <Button
      onClick={() => onRowDelete(rowData._id)}
      icon="pi pi-times"
      className="p-button-rounded p-button-danger p-button-text"
    />
  );
  const pCreatedAt = (rowData, { rowIndex }) => (
    <p>{moment(rowData.createdAt).fromNow()}</p>
  );
  const pUpdatedAt = (rowData, { rowIndex }) => (
    <p>{moment(rowData.updatedAt).fromNow()}</p>
  );
  const pCreatedBy = (rowData, { rowIndex }) => (
    <p>{rowData.createdBy?.name}</p>
  );
  const pUpdatedBy = (rowData, { rowIndex }) => (
    <p>{rowData.updatedBy?.name}</p>
  );
  const paginatorLeft = (
    <Button
      type="button"
      icon="pi pi-upload"
      text
      onClick={() => setShowUpload(true)}
      disabled={!true}
    />
  );
  const paginatorRight = (
    <Button
      type="button"
      icon="pi pi-download"
      text
      onClick={() => exportCSV()}
      disabled={!true}
    />
  );
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  return (
    <>
      <DataTable
        value={items}
        ref={dt}
        removableSort
        onRowClick={onRowClick}
        scrollable
        rowHover
        stripedRows
        paginator
        rows={10}
        rowsPerPageOptions={[10, 50, 250, 500]}
        size={"small"}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        rowClassName="cursor-pointer"
        alwaysShowPaginator={!urlParams.singleUsersId}
        loading={loading}
      >
        <Column
          field="service"
          header="Service"
          body={pTemplate0}
          filter={selectedFilterFields.includes("service")}
          hidden={selectedHideFields?.includes("service")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="create"
          header="Create"
          body={p_booleanTemplate1}
          filter={selectedFilterFields.includes("create")}
          hidden={selectedHideFields?.includes("create")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="read"
          header="Read"
          body={pTemplate2}
          filter={selectedFilterFields.includes("read")}
          hidden={selectedHideFields?.includes("read")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="update"
          header="Update"
          body={pTemplate3}
          filter={selectedFilterFields.includes("update")}
          hidden={selectedHideFields?.includes("update")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="delete"
          header="Delete"
          body={pTemplate4}
          filter={selectedFilterFields.includes("delete")}
          hidden={selectedHideFields?.includes("delete")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="profile"
          header="Profile"
          body={dropdownTemplate5}
          filter={selectedFilterFields.includes("profile")}
          hidden={selectedHideFields?.includes("profile")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="roleId"
          header="RoleId"
          body={dropdownTemplate6}
          filter={selectedFilterFields.includes("roleId")}
          hidden={selectedHideFields?.includes("roleId")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="positionId"
          header="PositionId"
          body={dropdownTemplate7}
          filter={selectedFilterFields.includes("positionId")}
          hidden={selectedHideFields?.includes("positionId")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="employeeId"
          header="EmployeeId"
          body={dropdownTemplate8}
          filter={selectedFilterFields.includes("employeeId")}
          hidden={selectedHideFields?.includes("employeeId")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="userId"
          header="UserId"
          body={dropdownTemplate9}
          filter={selectedFilterFields.includes("userId")}
          hidden={selectedHideFields?.includes("userId")}
          style={{ minWidth: "8rem" }}
        />
        <Column header="Edit" body={editTemplate} />
        <Column header="Delete" body={deleteTemplate} />
        {/*<Column field="createdAt" header="created" body={pCreatedAt} sortable style={{ minWidth: "8rem" }} />*/}
        {/*<Column field="updatedAt" header="updated" body={pUpdatedAt} sortable style={{ minWidth: "8rem" }} />*/}
        {/*<Column field="createdBy" header="createdBy" body={pCreatedBy} sortable style={{ minWidth: "8rem" }} />*/}
        {/*<Column field="updatedBy" header="updatedBy" body={pUpdatedBy} sortable style={{ minWidth: "8rem" }} />*/}
      </DataTable>
      <Dialog
        header="Upload PermissionServices Data"
        visible={showUpload}
        onHide={() => setShowUpload(false)}
      >
        <UploadService
          user={user}
          serviceName="permissionService"
          onUploadComplete={() => {
            setShowUpload(false); // Close the dialog after upload
          }}
        />
      </Dialog>

      <Dialog
        header="Search PermissionServices"
        visible={searchDialog}
        onHide={() => setSearchDialog(false)}
      >
        Search
      </Dialog>
      <Dialog
        header="Filter Users"
        visible={showFilter}
        onHide={() => setShowFilter(false)}
      >
        <div className="card flex justify-content-center">
          <MultiSelect
            value={selectedFilterFields}
            onChange={(e) => setSelectedFilterFields(e.value)}
            options={fields}
            optionLabel="name"
            optionValue="value"
            filter
            placeholder="Select Fields"
            maxSelectedLabels={6}
            className="w-full md:w-20rem"
          />
        </div>
        <Button
          text
          label="save as pref"
          onClick={() => {
            console.log(selectedFilterFields);
            onClickSaveFilteredfields(selectedFilterFields);
            setSelectedFilterFields(selectedFilterFields);
            setShowFilter(false);
          }}
        ></Button>
      </Dialog>

      <Dialog
        header="Hide Columns"
        visible={showColumns}
        onHide={() => setShowColumns(false)}
      >
        <div className="card flex justify-content-center">
          <MultiSelect
            value={selectedHideFields}
            onChange={(e) => setSelectedHideFields(e.value)}
            options={fields}
            optionLabel="name"
            optionValue="value"
            filter
            placeholder="Select Fields"
            maxSelectedLabels={6}
            className="w-full md:w-20rem"
          />
        </div>
        <Button
          text
          label="save as pref"
          onClick={() => {
            console.log(selectedHideFields);
            onClickSaveHiddenfields(selectedHideFields);
            setSelectedHideFields(selectedHideFields);
            setShowColumns(false);
          }}
        ></Button>
      </Dialog>
    </>
  );
};

export default PermissionServicesDataTable;
