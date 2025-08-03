import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { Image } from "primereact/image";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Dropdown } from "primereact/dropdown";

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = [];
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg.push(element.message);
      }
    }
  }
  return errMsg.length ? errMsg.join(', ') : errorObj.message ? errorObj.message : null;
};

const UsersEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const urlParams = useParams();

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  const onSave = async () => {
    // Check if role is being changed to admin
    const isPromotingToAdmin = _entity?.role === "admin" && props.entity?.role !== "admin";
    const isDemotingFromAdmin = _entity?.role === "customer" && props.entity?.role === "admin";
    
    // Show confirmation for role changes
    if (isPromotingToAdmin) {
      const confirmed = window.confirm(
        `⚠️ WARNING: You are about to promote ${_entity?.username || _entity?.email} to Administrator role.\n\n` +
        `This will give them full system access including:\n` +
        `• User management\n` +
        `• Voucher management\n` +
        `• System analytics\n` +
        `• All administrative functions\n\n` +
        `Are you sure you want to continue?`
      );
      if (!confirmed) return;
    } else if (isDemotingFromAdmin) {
      const confirmed = window.confirm(
        `⚠️ WARNING: You are about to demote ${_entity?.username || _entity?.email} from Administrator to Customer role.\n\n` +
        `This will remove their administrative privileges.\n\n` +
        `Are you sure you want to continue?`
      );
      if (!confirmed) return;
    }

    let _data = {
      email: _entity?.email,
      username: _entity?.username,
      phoneNumber: _entity?.phoneNumber,
      profileImage: _entity?.profileImage,
      isActive: _entity?.isActive,
      points: _entity?.points,
      address: _entity?.address,
      aboutMe: _entity?.aboutMe,
      role: _entity?.role,
    };

    // Only include password if it's being changed
    if (_entity?.password && _entity.password !== props.entity?.password) {
      _data.password = _entity.password;
    }

    console.log("Updating user data:", _data);

    setLoading(true);
    try {
      const result = await client.service("users").patch(_entity._id, _data);
      props.onHide();
      
      // Show appropriate success message based on role change
      let successMessage = "User information updated successfully";
      if (isPromotingToAdmin) {
        successMessage = `User ${_entity?.username || _entity?.email} has been promoted to Administrator successfully`;
      } else if (isDemotingFromAdmin) {
        successMessage = `User ${_entity?.username || _entity?.email} has been demoted to Customer successfully`;
      }
      
      props.alert({
        type: "success",
        title: "User Updated",
        message: successMessage,
      });
      props.onEditResult(result);
    } catch (error) {
      console.log("error", error);
      setError(
        getSchemaValidationErrorsStrings(error) || "Failed to update user information",
      );
      props.alert({
        type: "error",
        title: "Update Failed",
        message: "Failed to update user information",
      });
    }
    setLoading(false);
  };

  const renderFooter = () => (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancel"
        className="p-button-text no-focus-effect p-button-secondary"
        onClick={props.onHide}
        disabled={loading}
      />
      <Button
        label="Save Changes"
        className="p-button-text no-focus-effect"
        onClick={onSave}
        loading={loading}
        icon="pi pi-check"
      />
    </div>
  );

  const setValByKey = (key, val) => {
    let new_entity = { ..._entity, [key]: val };
    set_entity(new_entity);
    setError("");
  };

  const resetPassword = () => {
    setValByKey("password", "password123");
    props.alert({
      type: "info",
      title: "Password Reset",
      message: "Password has been reset to 'password123'. User should change it on next login.",
    });
  };

  // Check if role is being changed
  const isRoleChanged = _entity?.role !== props.entity?.role;
  const isPromotingToAdmin = _entity?.role === "admin" && props.entity?.role !== "admin";
  const isDemotingFromAdmin = _entity?.role === "customer" && props.entity?.role === "admin";

  return (
    <Dialog
      header={
        <div className="flex align-items-center gap-2">
          <span>Edit User Information</span>
          {isRoleChanged && (
            <Tag 
              value={isPromotingToAdmin ? "Promoting to Admin" : isDemotingFromAdmin ? "Demoting to Customer" : "Role Changed"} 
              severity={isPromotingToAdmin ? "danger" : isDemotingFromAdmin ? "warning" : "info"}
              icon={isPromotingToAdmin ? "pi pi-shield" : isDemotingFromAdmin ? "pi pi-user" : "pi pi-info-circle"}
            />
          )}
        </div>
      }
      visible={props.show}
      closable={false}
      onHide={props.onHide}
      modal
      style={{ width: "60vw" }}
      className="min-w-max"
      footer={renderFooter()}
      resizable={false}
    >
      <div
        className="grid p-fluid overflow-y-auto"
        style={{ maxWidth: "55vw" }}
        role="users-edit-dialog-component"
      >
        {/* Basic Information Section */}
        <div className="col-12">
          <h5 className="mb-3 text-primary">Basic Information</h5>
        </div>
        
        <div className="col-12 md:col-6 field">
          <label htmlFor="email" className="font-medium">Email Address *</label>
          <InputText
            id="email"
            className="w-full mb-3 p-inputtext-sm"
            value={_entity?.email || ""}
            onChange={(e) => setValByKey("email", e.target.value)}
            required
            type="email"
          />
        </div>

        <div className="col-12 md:col-6 field">
          <label htmlFor="username" className="font-medium">Username *</label>
          <InputText
            id="username"
            className="w-full mb-3 p-inputtext-sm"
            value={_entity?.username || ""}
            onChange={(e) => setValByKey("username", e.target.value)}
            required
          />
        </div>

        <div className="col-12 md:col-6 field">
          <label htmlFor="phoneNumber" className="font-medium">Phone Number</label>
          <InputText
            id="phoneNumber"
            className="w-full mb-3 p-inputtext-sm"
            value={_entity?.phoneNumber || ""}
            onChange={(e) => setValByKey("phoneNumber", e.target.value)}
            placeholder="+1234567890"
          />
        </div>

        <div className="col-12 md:col-6 field">
          <label htmlFor="points" className="font-medium">Points Balance</label>
          <InputNumber
            id="points"
            className="w-full mb-3 p-inputtext-sm"
            value={_entity?.points || 0}
            onValueChange={(e) => setValByKey("points", e.value)}
            min={0}
            max={999999999}
          />
        </div>

        <div className="col-12 md:col-6 field">
          <label htmlFor="role" className="font-medium">User Role *</label>
          <Dropdown
            id="role"
            className="w-full mb-3 p-inputtext-sm"
            value={_entity?.role || "customer"}
            options={[
              { label: "Customer", value: "customer" },
              { label: "Administrator", value: "admin" }
            ]}
            onChange={(e) => setValByKey("role", e.value)}
            placeholder="Select user role"
            optionLabel="label"
            optionValue="value"
          />
          <small className="text-gray-600">
            {_entity?.role === "admin" ? 
              "Administrators have full system access and can manage all users and vouchers." : 
              "Customers can browse and redeem vouchers using their points."
            }
          </small>
          {_entity?.role === "admin" && props.entity?.role !== "admin" && (
            <div className="mt-2">
              <Message 
                severity="warn" 
                text="⚠️ Warning: Granting admin access gives this user full system control. Please ensure this is intentional." 
              />
            </div>
          )}
        </div>

        {/* Profile Information Section */}
        <div className="col-12">
          <Divider />
          <h5 className="mb-3 text-primary">Profile Information</h5>
        </div>

        <div className="col-12 md:col-6 field">
          <label htmlFor="profileImage" className="font-medium">Profile Image URL</label>
          <InputText
            id="profileImage"
            className="w-full mb-3 p-inputtext-sm"
            value={_entity?.profileImage || ""}
            onChange={(e) => setValByKey("profileImage", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {_entity?.profileImage && (
            <div className="mt-2">
              <Image
                src={_entity.profileImage}
                alt="Profile"
                width="100"
                height="100"
                className="rounded-lg"
                preview
              />
            </div>
          )}
        </div>

        <div className="col-12 md:col-6 field">
          <label htmlFor="isActive" className="font-medium">Account Status</label>
          <div className="flex align-items-center mt-2">
            <Checkbox
              id="isActive"
              checked={_entity?.isActive !== false}
              onChange={(e) => setValByKey("isActive", e.checked)}
            />
            <label htmlFor="isActive" className="ml-2">
              {_entity?.isActive !== false ? "Active" : "Inactive"}
            </label>
          </div>
        </div>

        <div className="col-12 field">
          <label htmlFor="address" className="font-medium">Address</label>
          <InputTextarea
            id="address"
            className="w-full mb-3 p-inputtext-sm"
            value={_entity?.address || ""}
            onChange={(e) => setValByKey("address", e.target.value)}
            rows={2}
            placeholder="Enter full address"
          />
        </div>

        <div className="col-12 field">
          <label htmlFor="aboutMe" className="font-medium">About Me</label>
          <InputTextarea
            id="aboutMe"
            className="w-full mb-3 p-inputtext-sm"
            value={_entity?.aboutMe || ""}
            onChange={(e) => setValByKey("aboutMe", e.target.value)}
            rows={3}
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Security Section */}
        <div className="col-12">
          <Divider />
          <h5 className="mb-3 text-primary">Security</h5>
        </div>

        <div className="col-12 md:col-6 field">
          <label htmlFor="password" className="font-medium">New Password</label>
          <div className="p-inputgroup">
            <InputText
              id="password"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.password || ""}
              onChange={(e) => setValByKey("password", e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Leave blank to keep current password"
            />
            <Button
              type="button"
              icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
              className="p-button-secondary"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className="col-12 md:col-6 field">
          <label className="font-medium">Password Actions</label>
          <div className="mt-2">
            <Button
              label="Reset Password"
              icon="pi pi-refresh"
              className="p-button-sm p-button-outlined p-button-warning"
              onClick={resetPassword}
            />
          </div>
        </div>

        {/* Metadata Section */}
        <div className="col-12">
          <Divider />
          <h5 className="mb-3 text-primary">Account Metadata</h5>
        </div>

        <div className="col-12 md:col-6 field">
          <p className="m-0">
            <Tag value="Created:" severity="info"></Tag>
            {" " + moment(_entity?.createdAt).format('MMMM DD, YYYY [at] h:mm A')}
          </p>
        </div>

        <div className="col-12 md:col-6 field">
          <p className="m-0">
            <Tag value="Last Updated:" severity="info"></Tag>
            {" " + moment(_entity?.updatedAt).format('MMMM DD, YYYY [at] h:mm A')}
          </p>
        </div>

        <div className="col-12 md:col-6 field">
          <p className="m-0">
            <Tag value="User ID:" severity="secondary"></Tag>
            {" " + _entity?._id}
          </p>
        </div>

        <div className="col-12 md:col-6 field">
          <p className="m-0">
            <Tag value="Account Type:" severity="success"></Tag>
            {" " + (_entity?.isActive !== false ? "Active User" : "Inactive User")}
          </p>
        </div>

        <div className="col-12 md:col-6 field">
          <p className="m-0">
            <Tag value="User Role:" severity={_entity?.role === "admin" ? "danger" : "info"}></Tag>
            {" " + (_entity?.role === "admin" ? "Administrator" : "Customer")}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="col-12">
            <Message severity="error" text={error} />
          </div>
        )}
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

export default connect(mapState, mapDispatch)(UsersEditDialogComponent);
