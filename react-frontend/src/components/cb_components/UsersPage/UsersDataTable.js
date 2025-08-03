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
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import DownloadCSV from "../../../utils/DownloadCSV";
import client from "../../../services/restClient";

const UsersDataTable = ({
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
  const [roleChangeLoading, setRoleChangeLoading] = useState({});

  // Role options for dropdown
  const roleOptions = [
    { label: "Customer", value: "customer" },
    { label: "Admin", value: "admin" }
  ];

  // Role change handler
  const handleRoleChange = async (userId, newRole) => {
    setRoleChangeLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      await client.service("users").patch(userId, { role: newRole });
      
      // Update the local data
      const updatedItems = items.map(item => 
        item._id === userId ? { ...item, role: newRole } : item
      );
      
      // Trigger parent component update
      if (onRowClick) {
        onRowClick({ data: updatedItems });
      }
      
    } catch (error) {
      console.error("Error updating user role:", error);
      // You might want to show an error message here
    } finally {
      setRoleChangeLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Role display template
  const roleTemplate = (rowData, { rowIndex }) => {
    const isAdmin = rowData.role === "admin";
    const isCustomer = rowData.role === "customer";
    
    return (
      <div className="flex items-center gap-2">
        <Tag 
          value={rowData.role?.toUpperCase() || "CUSTOMER"} 
          severity={isAdmin ? "danger" : "success"}
          className="text-xs font-semibold"
        />
        <Dropdown
          value={rowData.role || "customer"}
          options={roleOptions}
          onChange={(e) => handleRoleChange(rowData._id, e.value)}
          className="w-24"
          disabled={roleChangeLoading[rowData._id]}
          loading={roleChangeLoading[rowData._id]}
          showClear={false}
        />
      </div>
    );
  };

  const pTemplate0 = (rowData, { rowIndex }) => <p>{rowData.name}</p>;
  const pTemplate1 = (rowData, { rowIndex }) => <p>{rowData.email}</p>;
  const p_booleanTemplate3 = (rowData, { rowIndex }) => (
    <p>{String(rowData.status)}</p>
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
  const paginatorLeft = (
    <Button
      type="button"
      icon="pi pi-upload"
      text
      onClick={() => setShowUpload(true)}
      disabled={!true}
    />
  );
  const paginatorRight = DownloadCSV({ data: items, fileName: "download" });

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
      >
        <Column
          field="name"
          header="Name"
          body={pTemplate0}
          filter={selectedFilterFields.includes("name")}
          hidden={selectedHideFields?.includes("name")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="email"
          header="Email"
          body={pTemplate1}
          filter={selectedFilterFields.includes("email")}
          hidden={selectedHideFields?.includes("email")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="status"
          header="Status"
          body={p_booleanTemplate3}
          filter={selectedFilterFields.includes("status")}
          hidden={selectedHideFields?.includes("status")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="role"
          header="Role"
          body={roleTemplate}
          filter={selectedFilterFields.includes("role")}
          hidden={selectedHideFields?.includes("role")}
          sortable
          style={{ minWidth: "12rem" }}
        />
        <Column header="Edit" body={editTemplate} />
        {/* <Column header="Delete" body={deleteTemplate} /> */}
      </DataTable>
      <Dialog
        header="Upload Users Data"
        visible={showUpload}
        onHide={() => setShowUpload(false)}
      >
        <UploadService
          user={user}
          serviceName="users"
          onUploadComplete={() => {
            setShowUpload(false); // Close the dialog after upload
          }}
          disabled={true}
        />
      </Dialog>
      <Dialog
        header="Search Users"
        visible={searchDialog}
        onHide={() => setSearchDialog(false)}
      >
        SearchService
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
          label="save"
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
          label="save"
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

export default UsersDataTable;
