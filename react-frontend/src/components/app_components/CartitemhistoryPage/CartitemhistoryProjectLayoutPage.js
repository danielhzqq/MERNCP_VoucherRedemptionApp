import React from "react";
import ProjectLayout from "../../Layouts/ProjectLayout";
import { connect } from "react-redux";
import CartitemhistoryPage from "./CartitemhistoryPage";

const CartitemhistoryProjectLayoutPage = (props) => {
  return (
    <ProjectLayout>
      <CartitemhistoryPage />
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

export default connect(mapState, mapDispatch)(CartitemhistoryProjectLayoutPage);