import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';

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

const VoucherCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const urlParams = useParams();
    
    useEffect(() => {
        set_entity({
            title: '',
            description: '',
            image: '',
            points: null,
            categoryId: '',
            termsAndCondition: '',
            isLatest: false
        });
        setError({});
        fetchCategories();
    }, [props.show]);

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await client.service('catergory').find({
                query: { $limit: 100 }
            });
            setCategories(response.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const validate = () => {
        let ret = true;
        const error = {};
          
        if (_.isEmpty(_entity?.title)) {
            error["title"] = `Title field is required`;
            ret = false;
        }
  
        if (_.isEmpty(_entity?.categoryId)) {
            error["categoryId"] = `Category field is required`;
            ret = false;
        }
  
        if (_entity?.points === null || _entity?.points === undefined || _entity?.points <= 0) {
            error["points"] = `Points field is required and must be greater than 0`;
            ret = false;
        }
  
        if (_.isEmpty(_entity?.image)) {
            error["image"] = `Image field is required`;
            ret = false;
        }
  
        if (_.isEmpty(_entity?.description)) {
            error["description"] = `Description field is required`;
            ret = false;
        }
  
        if (_.isEmpty(_entity?.termsAndCondition)) {
            error["termsAndCondition"] = `Terms and conditions field is required`;
            ret = false;
        }
        
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            categoryId: _entity?.categoryId,
            points: _entity?.points,
            title: _entity?.title,
            image: _entity?.image,
            description: _entity?.description,
            termsAndCondition: _entity?.termsAndCondition,
            isLatest: _entity?.isLatest || false
        };

        // Only add createdBy and updatedBy if user has a valid ObjectId
        if (props.user && props.user._id && props.user._id !== 'mock-admin-id') {
            _data.createdBy = props.user._id;
            _data.updatedBy = props.user._id;
        }

        setLoading(true);

        try {
            const result = await client.service("voucher").create(_data);
            props.onHide();
            props.alert({ type: "success", title: "Voucher Created", message: "Voucher created successfully" });
            props.onCreateResult(result);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || { error: "Failed to create voucher" });
            props.alert({ type: "error", title: "Creation Failed", message: "Failed to create voucher" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end gap-2">
            <Button 
                label="Cancel" 
                className="p-button-text no-focus-effect p-button-secondary" 
                onClick={props.onHide} 
            />
            <Button 
                label="Create Voucher" 
                className="p-button-primary no-focus-effect" 
                onClick={onSave} 
                loading={loading} 
            />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const selectedCategory = categories.find(cat => cat._id === _entity?.categoryId);

    return (
        <Dialog 
            header={
                <div className="flex items-center gap-2">
                    <i className="pi pi-plus text-green-600"></i>
                    <span>Create New Voucher</span>
                </div>
            } 
            visible={props.show} 
            closable={false} 
            onHide={props.onHide} 
            modal 
            style={{ 
                width: "90vw", 
                maxWidth: "800px",
                maxHeight: "90vh",
                margin: "2vh auto"
            }} 
            className="voucher-create-dialog scalein animation-ease-in-out animation-duration-1000" 
            footer={renderFooter()} 
            resizable={false}
        >
            <div className="grid p-fluid overflow-y-auto" style={{ 
                maxHeight: "calc(90vh - 200px)",
                maxWidth: "100%"
            }} role="voucher-create-dialog-component">
                
                {/* Voucher Image */}
                <div className="col-12 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Image URL *</label>
                    <InputText 
                        id="image" 
                        className="w-full" 
                        value={_entity?.image || ''} 
                        onChange={(e) => setValByKey("image", e.target.value)} 
                        placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                        required 
                    />
                    <small className="text-gray-500">Enter a valid image URL for the voucher</small>
                    <small className="p-error">
                        {!_.isEmpty(error["image"]) && (
                            <p className="m-0" key="error-image">{error["image"]}</p>
                        )}
                    </small>
                </div>

                {/* Title */}
                <div className="col-12 lg:col-6 field">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Voucher Title *
                    </label>
                    <InputText 
                        id="title" 
                        className="w-full" 
                        value={_entity?.title || ''} 
                        onChange={(e) => setValByKey("title", e.target.value)} 
                        placeholder="Enter voucher title"
                        required 
                    />
                    <small className="p-error">
                        {!_.isEmpty(error["title"]) && (
                            <p className="m-0" key="error-title">{error["title"]}</p>
                        )}
                    </small>
                </div>

                {/* Category */}
                <div className="col-12 lg:col-6 field">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <Dropdown
                        id="category"
                        value={selectedCategory}
                        options={categories}
                        onChange={(e) => setValByKey("categoryId", e.value?._id)}
                        optionLabel="name"
                        placeholder="Select a category"
                        className="w-full"
                        loading={categoriesLoading}
                        required
                    />
                    <small className="p-error">
                        {!_.isEmpty(error["categoryId"]) && (
                            <p className="m-0" key="error-categoryId">{error["categoryId"]}</p>
                        )}
                    </small>
                </div>

                {/* Points Required */}
                <div className="col-12 lg:col-6 field">
                    <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                        Points Required *
                    </label>
                    <InputNumber
                        id="points"
                        value={_entity?.points}
                        onValueChange={(e) => setValByKey("points", e.value)}
                        min={1}
                        max={999999}
                        className="w-full"
                        placeholder="Enter points required"
                        required
                    />
                    <small className="p-error">
                        {!_.isEmpty(error["points"]) && (
                            <p className="m-0" key="error-points">{error["points"]}</p>
                        )}
                    </small>
                </div>

                {/* Featured Voucher */}
                <div className="col-12 lg:col-6 field">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Voucher
                    </label>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="isLatest"
                            checked={_entity?.isLatest || false}
                            onChange={(e) => setValByKey("isLatest", e.checked)}
                        />
                        <label htmlFor="isLatest" className="text-sm text-gray-600">
                            Mark as featured/latest voucher
                        </label>
                    </div>
                    <small className="text-gray-500">Featured vouchers appear prominently in the customer dashboard</small>
                </div>

                {/* Description */}
                <div className="col-12 field">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <InputTextarea
                        id="description"
                        value={_entity?.description || ''}
                        onChange={(e) => setValByKey("description", e.target.value)}
                        rows={2}
                        className="w-full"
                        placeholder="Enter voucher description"
                        required
                    />
                    <small className="p-error">
                        {!_.isEmpty(error["description"]) && (
                            <p className="m-0" key="error-description">{error["description"]}</p>
                        )}
                    </small>
                </div>

                {/* Terms and Conditions */}
                <div className="col-12 field">
                    <label htmlFor="termsAndCondition" className="block text-sm font-medium text-gray-700 mb-2">
                        Terms and Conditions *
                    </label>
                    <InputTextarea
                        id="termsAndCondition"
                        value={_entity?.termsAndCondition || ''}
                        onChange={(e) => setValByKey("termsAndCondition", e.target.value)}
                        rows={3}
                        className="w-full"
                        placeholder="Enter terms and conditions"
                        required
                    />
                    <small className="p-error">
                        {!_.isEmpty(error["termsAndCondition"]) && (
                            <p className="m-0" key="error-termsAndCondition">{error["termsAndCondition"]}</p>
                        )}
                    </small>
                </div>

                {/* Error Display */}
                <div className="col-12">
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

export default connect(mapState, mapDispatch)(VoucherCreateDialogComponent);
