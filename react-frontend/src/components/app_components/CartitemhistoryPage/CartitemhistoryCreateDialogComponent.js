import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";


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
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const CartitemhistoryCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.id)) {
                error["id"] = `Id field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.voucherid)) {
                error["voucherid"] = `Voucherid field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.userid)) {
                error["userid"] = `Userid field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.quantity)) {
                error["quantity"] = `Quantity field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.completeddate)) {
                error["completeddate"] = `Completeddate field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            id: _entity?.id,voucherid: _entity?.voucherid,userid: _entity?.userid,quantity: _entity?.quantity,completeddate: _entity?.completeddate
        };

        // Only add createdBy and updatedBy if user has a valid ObjectId
        if (props.user && props.user._id && props.user._id !== 'mock-admin-id') {
            _data.createdBy = props.user._id;
            _data.updatedBy = props.user._id;
        }

        setLoading(true);

        try {
            
        const result = await client.service("cartitemhistory").create(_data);
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Cartitemhistory created successfully" });
        props.onCreateResult(result);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Cartitemhistory" });
        }
        setLoading(false);
    };

    

    

    

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    

    return (
        <Dialog header="Create Cartitemhistory" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="cartitemhistory-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="id">Id:</label>
                <InputText id="id" className="w-full mb-3 p-inputtext-sm" value={_entity?.id} onChange={(e) => setValByKey("id", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["id"]) ? (
              <p className="m-0" key="error-id">
                {error["id"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="voucherid">Voucherid:</label>
                <InputText id="voucherid" className="w-full mb-3 p-inputtext-sm" value={_entity?.voucherid} onChange={(e) => setValByKey("voucherid", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["voucherid"]) ? (
              <p className="m-0" key="error-voucherid">
                {error["voucherid"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="userid">Userid:</label>
                <InputText id="userid" className="w-full mb-3 p-inputtext-sm" value={_entity?.userid} onChange={(e) => setValByKey("userid", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["userid"]) ? (
              <p className="m-0" key="error-userid">
                {error["userid"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="quantity">Quantity:</label>
                <InputText id="quantity" className="w-full mb-3 p-inputtext-sm" value={_entity?.quantity} onChange={(e) => setValByKey("quantity", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["quantity"]) ? (
              <p className="m-0" key="error-quantity">
                {error["quantity"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="completeddate">Completeddate:</label>
                <InputText id="completeddate" className="w-full mb-3 p-inputtext-sm" value={_entity?.completeddate} onChange={(e) => setValByKey("completeddate", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["completeddate"]) ? (
              <p className="m-0" key="error-completeddate">
                {error["completeddate"]}
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

export default connect(mapState, mapDispatch)(CartitemhistoryCreateDialogComponent);
