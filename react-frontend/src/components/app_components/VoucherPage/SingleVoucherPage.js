import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { SplitButton } from "primereact/splitbutton";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import client from "../../../services/restClient";
import CommentsSection from "../../common/CommentsSection";
import ProjectLayout from "../../Layouts/ProjectLayout";


const SingleVoucherPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

    

    useEffect(() => {
        //on mount
        client
            .service("voucher")
            .get(urlParams.singleVoucherId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },] }})
            .then((res) => {
                set_entity(res || {});
                
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Voucher", type: "error", message: error.message || "Failed get voucher" });
            });
    }, [props,urlParams.singleVoucherId]);


    const goBack = () => {
        navigate("/voucher");
    };

      const toggleHelpSidebar = () => {
    setHelpSidebarVisible(!isHelpSidebarVisible);
  };

  const copyPageLink = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        props.alert({
          title: "Link Copied",
          type: "success",
          message: "Page link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        props.alert({
          title: "Error",
          type: "error",
          message: "Failed to copy page link.",
        });
      });
  };

    const menuItems = [
        {
            label: "Copy link",
            icon: "pi pi-copy",
            command: () => copyPageLink(),
        },
        {
            label: "Help",
            icon: "pi pi-question-circle",
            command: () => toggleHelpSidebar(),
        },
    ];

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-12">
                <div className="flex align-items-center justify-content-between">
                <div className="flex align-items-center">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Voucher</h3>
                    <SplitButton
                        model={menuItems.filter(
                        (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                        )}
                        dropdownIcon="pi pi-ellipsis-h"
                        buttonClassName="hidden"
                        menuButtonClassName="ml-1 p-button-text"
                    />
                </div>
                
                {/* <p>voucher/{urlParams.singleVoucherId}</p> */}
            </div>
            <div className="card w-full">
                <div className="grid">
                    {/* Voucher Image Section */}
                    <div className="col-12 lg:col-4">
                        <Card className="h-full">
                            <div className="text-center">
                                <h5 className="mb-3">Voucher Image</h5>
                                {_entity?.image ? (
                                    <Image 
                                        src={_entity.image} 
                                        alt={_entity?.title || "Voucher Image"}
                                        width="100%"
                                        height="300px"
                                        className="rounded-lg shadow-md"
                                        preview
                                        imageClassName="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">No image available</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Voucher Details Section */}
                    <div className="col-12 lg:col-8">
                        <Card className="h-full">
                            <h5 className="mb-4">Voucher Details</h5>
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <label className="text-sm text-gray-600 font-medium">ID</label>
                                    <p className="m-0 mt-1 text-lg">{_entity?.id || "N/A"}</p>
                                </div>
                                <div className="col-12 md:col-6">
                                    <label className="text-sm text-gray-600 font-medium">Category ID</label>
                                    <p className="m-0 mt-1 text-lg">{_entity?.categoryid || "N/A"}</p>
                                </div>
                                <div className="col-12 md:col-6">
                                    <label className="text-sm text-gray-600 font-medium">Points Required</label>
                                    <p className="m-0 mt-1 text-lg font-bold text-blue-600">{_entity?.points?.toLocaleString() || "0"} points</p>
                                </div>
                                <div className="col-12 md:col-6">
                                    <label className="text-sm text-gray-600 font-medium">Latest Voucher</label>
                                    <p className="m-0 mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            _entity?.islatest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {_entity?.islatest ? 'Yes' : 'No'}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-12">
                                    <label className="text-sm text-gray-600 font-medium">Title</label>
                                    <p className="m-0 mt-1 text-xl font-semibold">{_entity?.title || "N/A"}</p>
                                </div>
                                <div className="col-12">
                                    <label className="text-sm text-gray-600 font-medium">Description</label>
                                    <p className="m-0 mt-1 text-gray-700 leading-relaxed">{_entity?.description || "No description available"}</p>
                                </div>
                                <div className="col-12">
                                    <label className="text-sm text-gray-600 font-medium">Terms & Conditions</label>
                                    <p className="m-0 mt-1 text-gray-700 leading-relaxed">{_entity?.termsandcondition || "No terms and conditions available"}</p>
                                </div>
                                <div className="col-12">
                                    <label className="text-sm text-gray-600 font-medium">Image URL</label>
                                    <p className="m-0 mt-1 text-sm text-blue-600 break-all">
                                        {_entity?.image ? (
                                            <a href={_entity.image} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {_entity.image}
                                            </a>
                                        ) : (
                                            "No image URL available"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-2">
            <TabView>
                
            </TabView>
        </div>

      <CommentsSection
        recordId={urlParams.singleVoucherId}
        user={props.user}
        alert={props.alert}
        serviceName="voucher"
      />
      <div
        id="rightsidebar"
        className={classNames("overlay-auto z-1 surface-overlay shadow-2 absolute right-0 w-20rem animation-duration-150 animation-ease-in-out", { "hidden" : !isHelpSidebarVisible })}
        style={{ top: "60px", height: "calc(100% - 60px)" }}
      >
        <div className="flex flex-column h-full p-4">
          <span className="text-xl font-medium text-900 mb-3">Help bar</span>
          <div className="border-2 border-dashed surface-border border-round surface-section flex-auto"></div>
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

export default connect(mapState, mapDispatch)(SingleVoucherPage);
