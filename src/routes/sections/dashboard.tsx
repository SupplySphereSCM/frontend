import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
// auth
import { AuthGuard } from "src/auth/guard";
// layouts
import DashboardLayout from "src/layouts/dashboard";
// components
import { LoadingScreen } from "src/components/loading-screen";
import { CheckoutProvider } from "src/sections/supplychain/supplychain-new-edit-form/context";
// import ServicesDetailsPage from "src/pages/dashboard/supplychain/services/details";

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import("src/pages/dashboard/app"));
// const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
// const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
// const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
// const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(
  () => import("src/pages/dashboard/product/details")
);
const ProductListPage = lazy(() => import("src/pages/dashboard/product/list"));
const ProductCreatePage = lazy(() => import("src/pages/dashboard/product/new"));
const ProductEditPage = lazy(() => import("src/pages/dashboard/product/edit"));
// SERIVCE
const ServiceDetailsPage = lazy(
  () => import("src/pages/dashboard/service/details")
);
const ServiceListPage = lazy(() => import("src/pages/dashboard/service/list"));
const ServiceCreatePage = lazy(() => import("src/pages/dashboard/service/new"));
const ServiceEditPage = lazy(() => import("src/pages/dashboard/service/edit"));
// FAUCET
const FaucetPage = lazy(() => import("src/pages/dashboard/faucet/faucet-view"));

// ORDER
const OrderListPage = lazy(() => import("src/pages/dashboard/order/list"));
const OrderDetailsPage = lazy(
  () => import("src/pages/dashboard/order/details")
);
// MY-ORDER
const MyOrderListPage = lazy(
  () => import("src/pages/dashboard/order/my-order-list")
);
const MyOrderDetailsPage = lazy(
  () => import("src/pages/dashboard/order/my-order-details")
);
// INVOICE
const InvoiceListPage = lazy(() => import("src/pages/dashboard/invoice/list"));
const InvoiceDetailsPage = lazy(
  () => import("src/pages/dashboard/invoice/details")
);
const InvoiceCreatePage = lazy(() => import("src/pages/dashboard/invoice/new"));
const InvoiceEditPage = lazy(() => import("src/pages/dashboard/invoice/edit"));
// USER
// const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
// const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
// const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import("src/pages/dashboard/user/account"));
// const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
// const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// BLOG
// const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
// const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
// const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
// const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// SUPPLYCHAIN
const SupplyChainDetailsPage = lazy(
  () => import("src/pages/dashboard/supplychain/details")
);
const SupplyChainListPage = lazy(
  () => import("src/pages/dashboard/supplychain/list")
);
const SupplyChainCreatePage = lazy(
  () => import("src/pages/dashboard/supplychain/new")
);
const SupplyChainEditPage = lazy(
  () => import("src/pages/dashboard/supplychain/edit")
);

const LogisticsDetailsPage = lazy(
  () => import("src/pages/dashboard/supplychain/logistics/details")
);

const ServicesShopDetailsPage = lazy(
  () => import("src/pages/dashboard/supplychain/services/details")
);
// TOUR
// const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
// const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
// const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
// const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
// const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
// const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
// const MailPage = lazy(() => import('src/pages/dashboard/mail'));
// const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
// const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(
  () => import("src/pages/dashboard/permission")
);

// SUpplychain QR
const SupplychainQRPage = lazy(
  () => import("src/pages/SupplyChainQR/supplychainQR")
);
// BLANK PAGE
// const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      // { path: 'ecommerce', element: <OverviewEcommercePage /> },
      // { path: 'analytics', element: <OverviewAnalyticsPage /> },
      // { path: 'banking', element: <OverviewBankingPage /> },
      // { path: 'booking', element: <OverviewBookingPage /> },
      // { path: 'file', element: <OverviewFilePage /> },
      {
        path: "user",
        children: [
          //     { element: <UserProfilePage />, index: true },
          //     { path: 'profile', element: <UserProfilePage /> },
          //     { path: 'cards', element: <UserCardsPage /> },
          //     { path: 'list', element: <UserListPage /> },
          //     { path: 'new', element: <UserCreatePage /> },
          //     { path: ':id/edit', element: <UserEditPage /> },
          { path: "account", element: <UserAccountPage /> },
        ],
      },
      {
        path: "product",
        children: [
          { element: <ProductListPage />, index: true },
          { path: "list", element: <ProductListPage /> },
          { path: ":id", element: <ProductDetailsPage /> },
          { path: "new", element: <ProductCreatePage /> },
          { path: ":id/edit", element: <ProductEditPage /> },
        ],
      },
      {
        path: "service",
        children: [
          { element: <ServiceListPage />, index: true },
          { path: "list", element: <ServiceListPage /> },
          { path: ":id", element: <ServiceDetailsPage /> },
          { path: "new", element: <ServiceCreatePage /> },
          { path: ":id/edit", element: <ServiceEditPage /> },
        ],
      },
      {
        path: "faucet",
        children: [{ element: <FaucetPage />, index: true }],
      },
      {
        path: "order",
        children: [
          { element: <OrderListPage />, index: true },
          { path: "list", element: <OrderListPage /> },
          { path: ":id", element: <OrderDetailsPage /> },
        ],
      },
      {
        path: "myorder",
        children: [
          { element: <MyOrderListPage />, index: true },
          { path: "list", element: <MyOrderListPage /> },
          { path: ":id", element: <MyOrderDetailsPage /> },
        ],
      },
      {
        path: "invoice",
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: "list", element: <InvoiceListPage /> },
          { path: ":id", element: <InvoiceDetailsPage /> },
          { path: ":id/edit", element: <InvoiceEditPage /> },
          { path: "new", element: <InvoiceCreatePage /> },
        ],
      },
      // {
      //   path: 'post',
      //   children: [
      //     { element: <BlogPostsPage />, index: true },
      //     { path: 'list', element: <BlogPostsPage /> },
      //     { path: ':title', element: <BlogPostPage /> },
      //     { path: ':title/edit', element: <BlogEditPostPage /> },
      //     { path: 'new', element: <BlogNewPostPage /> },
      //   ],
      // },
      {
        path: "supplychain",
        element: (
          <CheckoutProvider>
            <Outlet />
          </CheckoutProvider>
        ),
        children: [
          { element: <SupplyChainListPage />, index: true },
          { path: "list", element: <SupplyChainListPage /> },
          { path: ":id", element: <SupplyChainDetailsPage /> },
          { path: "new", element: <SupplyChainCreatePage /> },
          { path: ":id/edit", element: <SupplyChainEditPage /> },
        ],
      },
      {
        path: "transporter",
        children: [
          { element: <LogisticsDetailsPage />, index: true },

          { path: ":id", element: <LogisticsDetailsPage /> },
        ],
      },
      {
        path: "shopservice",
        children: [
          { element: <ServicesShopDetailsPage />, index: true },

          { path: ":id", element: <ServicesShopDetailsPage /> },
        ],
      },
      // {
      //   path: "service",
      //   children: [
      //     { element: <ServicesShopDetailsPage />, index: true },

      //     { path: ":id", element: <ServicesShopDetailsPage /> },
      //   ],
      // },

      // {
      //   path: 'tour',
      //   children: [
      //     { element: <TourListPage />, index: true },
      //     { path: 'list', element: <TourListPage /> },
      //     { path: ':id', element: <TourDetailsPage /> },
      //     { path: 'new', element: <TourCreatePage /> },
      //     { path: ':id/edit', element: <TourEditPage /> },
      //   ],
      // },
      // { path: 'file-manager', element: <FileManagerPage /> },
      // { path: 'mail', element: <MailPage /> },
      // { path: 'chat', element: <ChatPage /> },
      // { path: 'calendar', element: <CalendarPage /> },
      // { path: 'kanban', element: <KanbanPage /> },
      { path: "permission", element: <PermissionDeniedPage /> },
      // { path: 'blank', element: <BlankPage /> },
    ],
  },
  {
    path: "supplychain",
    children: [{ element: <SupplychainQRPage />, index: true }],
  },
];
