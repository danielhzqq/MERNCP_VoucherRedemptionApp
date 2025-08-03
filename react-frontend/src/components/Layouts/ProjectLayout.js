import AppSideBar from "./appSideBar/AppSideBar.js";

/*

import ProductsPage from "../ProductsPage/ProductsPage";
import CartitemsPage from "../CartitemsPage/CartitemsPage";
import VoucherPage from "../VoucherPage/VoucherPage";
import CartitemhistoryPage from "../CartitemhistoryPage/CartitemhistoryPage";
import CatergoryPage from "../CatergoryPage/CatergoryPage";
~cb-add-import~

~cb-add-services-card~

case "products":
                return <ProductsPage />;
case "cartitems":
                return <CartitemsPage />;
case "voucher":
                return <VoucherPage />;
case "cartitemhistory":
                return <CartitemhistoryPage />;
case "catergory":
                return <CatergoryPage />;
~cb-add-thurthy~

*/

const AppLayout = (props) => {
  const { children, activeKey, activeDropdown } = props;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] mt-20 bg-white">
      <AppSideBar activeKey={activeKey} activeDropdown={activeDropdown} />
      <div className="flex-1 ml-2">{children}</div>
    </div>
  );
};

export default AppLayout;
