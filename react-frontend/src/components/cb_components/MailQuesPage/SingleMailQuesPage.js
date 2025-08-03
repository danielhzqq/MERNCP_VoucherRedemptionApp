import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../../services/restClient";
import { Tag } from "primereact/tag";
import moment from "moment";
import ProjectLayout from "../../Layouts/ProjectLayout";

import { Chip } from "primereact/chip";

const SingleMailQuesPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});

  const [templateId, setTemplateId] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("mailQues")
      .get(urlParams.singleMailQuesId, {
        query: {
          $populate: ["templateId"],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const templateId = Array.isArray(res.templateId)
          ? res.templateId.map((elem) => ({ _id: elem._id, name: elem.name }))
          : res.templateId
            ? [{ _id: res.templateId._id, name: res.templateId.name }]
            : [];
        setTemplateId(templateId);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "MailQues",
          type: "error",
          message: error.message || "Failed get mailQues",
        });
      });
  }, [props, urlParams.singleMailQuesId]);

  const goBack = () => {
    navigate("/mailQues");
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
            <h3 className="m-0">Mail Ques</h3>
          </div>
          <p>mailQues/{urlParams.singleMailQuesId}</p>
          {/* ~cb-project-dashboard~ */}
        </div>
        <div className="card w-full">
          <div className="grid ">
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Name</label>
              <p className="m-0 ml-3">{_entity?.name}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">From</label>
              <p className="m-0 ml-3">{_entity?.from}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Recipients</label>
              <p className="m-0 ml-3">
                <Chip id="recipients" label={_entity?.recipients} />
              </p>
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
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Template</label>
              <p className="m-0 ml-3">{_entity?.templateId?.name}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Subject</label>
              <p className="m-0 ml-3">{_entity?.subject}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Content</label>
              <p className="m-0 ml-3">{_entity?.content}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Job Id</label>
              <p className="m-0 ml-3">{Number(_entity?.jobId)}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Errors</label>
              <p className="m-0 ml-3">{_entity?.errors}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">End</label>
              <p id="end" className="m-0 ml-3">
                {_entity?.end}
              </p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm">Template</label>
              {templateId.map((elem) => (
                <Link key={elem._id} to={`/templates/${elem._id}`}>
                  <div className="card">
                    <p className="text-xl text-primary">{elem.name}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="col-12">&nbsp;</div>
            <div className="col-12 md:col-6 lg:col-3">
              <Tag value="created At:"></Tag>
              <p className="m-0 ml-3">{moment(_entity?.createdAt).fromNow()}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <Tag value="updated At:"></Tag>
              <p className="m-0 ml-3">{moment(_entity?.updatedAt).fromNow()}</p>
            </div>
          </div>
        </div>
      </div>
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

export default connect(mapState, mapDispatch)(SingleMailQuesPage);
