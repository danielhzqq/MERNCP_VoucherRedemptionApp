import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import client from "../../../services/restClient";
import { Tag } from "primereact/tag";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import ProjectLayout from "../../Layouts/ProjectLayout";

import ProfilesPage from "../ProfilesPage/ProfilesPage";
import PermissionServicesPage from "../PermissionServicesPage/PermissionServicesPage";
import PermissionFieldsPage from "../PermissionFieldsPage/PermissionFieldsPage";
import UserAddressesPage from "../UserAddressesPage/UserAddressesPage";
import UserPhonesPage from "../UserPhonesPage/UserPhonesPage";

const SingleUsersPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});

  useEffect(() => {
    //on mount
    client
      .service("users")
      .get(urlParams.singleUsersId, { query: { $populate: [] } })
      .then((res) => {
        set_entity(res || {});
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Users",
          type: "error",
          message: error.message || "Failed get users",
        });
      });
  }, [props, urlParams.singleUsersId]);

  const goBack = () => {
    navigate("/users");
  };

  return (
    <ProjectLayout>
      <div className="col-12 flex flex-column align-items-center">
        <div className="col-10">
          <div className="flex align-items-center justify-content-start">
            <Button
              className="p-button-text"
              icon="pi pi-chevron-left"
              onClick={() => goBack()}
            />
            <h3 className="m-0">Users</h3>
          </div>
          <p>users/{urlParams.singleUsersId}</p>
          {/* ~cb-project-dashboard~ */}
        </div>
        <div className="card w-full">
          <div className="grid ">
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Name</label>
              <p className="m-0 ml-3">{_entity?.name}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Email</label>
              <p className="m-0 ml-3">{_entity?.email}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Status</label>
              <p className="m-0 ml-3">
                <i
                  id="status"
                  className={`pi ${_entity?.status ? "pi-check" : "pi-times"}`}
                ></i>
              </p>
            </div>

            <div className="col-12">&nbsp;</div>
          </div>
        </div>
      </div>
      <ProfilesPage />
      <PermissionServicesPage />
      <PermissionFieldsPage />
      <UserAddressesPage />
      <UserPhonesPage />
    </ProjectLayout>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleUsersPage);
