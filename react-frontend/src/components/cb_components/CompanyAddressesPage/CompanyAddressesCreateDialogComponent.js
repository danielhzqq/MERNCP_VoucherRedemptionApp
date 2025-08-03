import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = {};
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg[key] = element.message;
      }
    }
  }
  return errMsg.length
    ? errMsg
    : errorObj.message
      ? { error: errorObj.message }
      : {};
};

const CompanyAddressesCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [companyId, setCompanyId] = useState([]);

  useEffect(() => {
    let init = { isDefault: false };
    if (!_.isEmpty(props?.entity)) {
      init = initilization(
        { ...props?.entity, ...init },
        [companyId],
        setError,
      );
    }
    set_entity({ ...init });
  }, [props.show]);

  const validate = () => {
    let ret = true;
    const error = {};

    if (!ret) setError(error);
    return ret;
  };

  const onSave = async () => {
    if (!validate()) return;
    let _data = {
      companyId: _entity?.companyId?._id,
      Street1: _entity?.Street1,
      Street2: _entity?.Street2,
      Poscode: _entity?.Poscode,
      City: _entity?.City,
      State: _entity?.State,
      Province: _entity?.Province,
      Country: _entity?.Country,
      isDefault: _entity?.isDefault || false,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("companyAddresses").create(_data);
      const eagerResult = await client.service("companyAddresses").find({
        query: {
          $limit: 10000,
          _id: { $in: [result._id] },
          $populate: [
            {
              path: "companyId",
              service: "companies",
              select: ["name"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Company Addresses updated successfully",
      });
      props.onCreateResult(eagerResult.data[0]);
    } catch (error) {
      console.log("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Company Addresses",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // on mount companies
    client
      .service("companies")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleCompaniesId,
        },
      })
      .then((res) => {
        setCompanyId(
          res.data.map((e) => {
            return { name: e["name"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Companies",
          type: "error",
          message: error.message || "Failed get companies",
        });
      });
  }, []);

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

  const companyIdOptions = companyId.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Create Company Addresses"
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
        role="companyAddresses-create-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="companyId">Company:</label>
            <Dropdown
              id="companyId"
              value={_entity?.companyId?._id}
              optionLabel="name"
              optionValue="value"
              options={companyIdOptions}
              onChange={(e) => setValByKey("companyId", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["companyId"]) ? (
              <p className="m-0" key="error-companyId">
                {error["companyId"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="Street1">Street1:</label>
            <InputTextarea
              id="Street1"
              rows={5}
              cols={30}
              value={_entity?.Street1}
              onChange={(e) => setValByKey("Street1", e.target.value)}
              autoResize
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["Street1"]) ? (
              <p className="m-0" key="error-Street1">
                {error["Street1"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="Street2">Street2:</label>
            <InputTextarea
              id="Street2"
              rows={5}
              cols={30}
              value={_entity?.Street2}
              onChange={(e) => setValByKey("Street2", e.target.value)}
              autoResize
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["Street2"]) ? (
              <p className="m-0" key="error-Street2">
                {error["Street2"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="Poscode">Poscode:</label>
            <InputText
              id="Poscode"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.Poscode}
              onChange={(e) => setValByKey("Poscode", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["Poscode"]) ? (
              <p className="m-0" key="error-Poscode">
                {error["Poscode"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="City">City:</label>
            <InputText
              id="City"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.City}
              onChange={(e) => setValByKey("City", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["City"]) ? (
              <p className="m-0" key="error-City">
                {error["City"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="State">State:</label>
            <InputText
              id="State"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.State}
              onChange={(e) => setValByKey("State", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["State"]) ? (
              <p className="m-0" key="error-State">
                {error["State"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="Province">Province:</label>
            <InputText
              id="Province"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.Province}
              onChange={(e) => setValByKey("Province", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["Province"]) ? (
              <p className="m-0" key="error-Province">
                {error["Province"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="Country">Country:</label>
            <InputText
              id="Country"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.Country}
              onChange={(e) => setValByKey("Country", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["Country"]) ? (
              <p className="m-0" key="error-Country">
                {error["Country"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field flex">
          <span className="align-items-center">
            <label htmlFor="isDefault">Is Default:</label>
            <Checkbox
              id="isDefault"
              className="ml-3"
              checked={_entity?.isDefault}
              onChange={(e) => setValByKey("isDefault", e.checked)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["isDefault"]) ? (
              <p className="m-0" key="error-isDefault">
                {error["isDefault"]}
              </p>
            ) : null}
          </small>
        </div>
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

export default connect(
  mapState,
  mapDispatch,
)(CompanyAddressesCreateDialogComponent);
