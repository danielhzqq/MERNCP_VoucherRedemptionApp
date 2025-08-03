import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = {};
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg.push(element.message);
      }
    }
  }
  return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const StaffinfoCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  const onSave = async () => {
    let _data = {
      empno: _entity?.empno,
      name: _entity?.name,
      namenric: _entity?.namenric,
      compcode: _entity?.compcode,
      compname: _entity?.compname,
      deptcode: _entity?.deptcode,
      deptdesc: _entity?.deptdesc,
      sectcode: _entity?.sectcode,
      sectdesc: _entity?.sectdesc,
      designation: _entity?.designation,
      email: _entity?.email,
      resign: _entity?.resign,
      supervisor: _entity?.supervisor,
      datejoin: _entity?.datejoin,
      empgroup: _entity?.empgroup,
      empgradecode: _entity?.empgradecode,
      terminationdate: _entity?.terminationdate,
    };

    setLoading(true);
    try {
      const result = await client
        .service("staffinfo")
        .patch(_entity._id, _data);
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info staffinfo updated successfully",
      });
      props.onEditResult(result);
    } catch (error) {
      console.log("error", error);
      setError(
        getSchemaValidationErrorsStrings(error) || "Failed to update info",
      );
      props.alert({
        type: "error",
        title: "Edit info",
        message: "Failed to update info",
      });
    }
    setLoading(false);
  };

  const renderFooter = () => (
    <div className="flex justify-content-end">
      <Button
        label="save"
        className="p-button-text no-focus-effect"
        onClick={onSave}
        loading={loading}
      />
      <Button
        label="close"
        className="p-button-text no-focus-effect p-button-secondary"
        onClick={props.onHide}
      />
    </div>
  );

  const setValByKey = (key, val) => {
    let new_entity = { ..._entity, [key]: val };
    set_entity(new_entity);
    setError({});
  };

  return (
    <Dialog
      header="Edit Staffinfo"
      visible={props.show}
      closable={false}
      onHide={props.onHide}
      modal
      style={{ width: "40vw" }}
      className="min-w-max"
      footer={renderFooter()}
      resizable={false}
    >
      <div
        className="grid p-fluid overflow-y-auto"
        style={{ maxWidth: "55vw" }}
        role="staffinfo-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="empno">Empno:</label>
            <InputNumber
              id="empno"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.empno}
              useGrouping={false}
              onChange={(e) => setValByKey("empno", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["empno"]) && (
              <p className="m-0" key="error-empno">
                {error["empno"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="name">Name:</label>
            <InputText
              id="name"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.name}
              onChange={(e) => setValByKey("name", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["name"]) && (
              <p className="m-0" key="error-name">
                {error["name"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="namenric">Namenric:</label>
            <InputText
              id="namenric"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.namenric}
              onChange={(e) => setValByKey("namenric", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["namenric"]) && (
              <p className="m-0" key="error-namenric">
                {error["namenric"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="compcode">Compcode:</label>
            <InputNumber
              id="compcode"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.compcode}
              useGrouping={false}
              onChange={(e) => setValByKey("compcode", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["compcode"]) && (
              <p className="m-0" key="error-compcode">
                {error["compcode"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="compname">Compname:</label>
            <InputText
              id="compname"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.compname}
              onChange={(e) => setValByKey("compname", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["compname"]) && (
              <p className="m-0" key="error-compname">
                {error["compname"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="deptcode">Deptcode:</label>
            <InputText
              id="deptcode"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.deptcode}
              onChange={(e) => setValByKey("deptcode", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["deptcode"]) && (
              <p className="m-0" key="error-deptcode">
                {error["deptcode"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="deptdesc">Deptdesc:</label>
            <InputText
              id="deptdesc"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.deptdesc}
              onChange={(e) => setValByKey("deptdesc", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["deptdesc"]) && (
              <p className="m-0" key="error-deptdesc">
                {error["deptdesc"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="sectcode">Sectcode:</label>
            <InputNumber
              id="sectcode"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.sectcode}
              useGrouping={false}
              onChange={(e) => setValByKey("sectcode", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["sectcode"]) && (
              <p className="m-0" key="error-sectcode">
                {error["sectcode"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="sectdesc">Sectdesc:</label>
            <InputText
              id="sectdesc"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.sectdesc}
              onChange={(e) => setValByKey("sectdesc", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["sectdesc"]) && (
              <p className="m-0" key="error-sectdesc">
                {error["sectdesc"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="designation">Designation:</label>
            <InputText
              id="designation"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.designation}
              onChange={(e) => setValByKey("designation", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["designation"]) && (
              <p className="m-0" key="error-designation">
                {error["designation"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="email">Email:</label>
            <InputText
              id="email"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.email}
              onChange={(e) => setValByKey("email", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["email"]) && (
              <p className="m-0" key="error-email">
                {error["email"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="resign">Resign:</label>
            <InputText
              id="resign"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.resign}
              onChange={(e) => setValByKey("resign", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["resign"]) && (
              <p className="m-0" key="error-resign">
                {error["resign"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="supervisor">Supervisor:</label>
            <InputText
              id="supervisor"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.supervisor}
              onChange={(e) => setValByKey("supervisor", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["supervisor"]) && (
              <p className="m-0" key="error-supervisor">
                {error["supervisor"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="datejoin">Datejoin:</label>
            <InputNumber
              id="datejoin"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.datejoin}
              useGrouping={false}
              onChange={(e) => setValByKey("datejoin", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["datejoin"]) && (
              <p className="m-0" key="error-datejoin">
                {error["datejoin"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="empgroup">Empgroup:</label>
            <InputText
              id="empgroup"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.empgroup}
              onChange={(e) => setValByKey("empgroup", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["empgroup"]) && (
              <p className="m-0" key="error-empgroup">
                {error["empgroup"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="empgradecode">Empgradecode:</label>
            <InputText
              id="empgradecode"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.empgradecode}
              onChange={(e) => setValByKey("empgradecode", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["empgradecode"]) && (
              <p className="m-0" key="error-empgradecode">
                {error["empgradecode"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="terminationdate">Terminationdate:</label>
            <InputText
              id="terminationdate"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.terminationdate}
              onChange={(e) => setValByKey("terminationdate", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["terminationdate"]) && (
              <p className="m-0" key="error-terminationdate">
                {error["terminationdate"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12">&nbsp;</div>
        <small className="p-error">
          {Array.isArray(Object.keys(error))
            ? Object.keys(error).map((e, i) => (
                <p className="m-0" key={i}>
                  {e}: {error[e]}
                </p>
              ))
            : error}
        </small>
      </div>
    </Dialog>
  );
};

const mapState = (state) => {
  const { user } = state.auth;
  return { user };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(StaffinfoCreateDialogComponent);
