import { useMemo } from "react";
// routes
import { paths } from "src/routes/paths";
// locales
import { useLocales } from "src/locales";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import SvgColor from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon("ic_job"),
  blog: icon("ic_blog"),
  chat: icon("ic_chat"),
  mail: icon("ic_mail"),
  user: icon("ic_user"),
  file: icon("ic_file"),
  lock: icon("ic_lock"),
  tour: icon("ic_tour"),
  order: icon("ic_order"),
  label: icon("ic_label"),
  blank: icon("ic_blank"),
  kanban: icon("ic_kanban"),
  folder: icon("ic_folder"),
  banking: icon("ic_banking"),
  booking: icon("ic_booking"),
  invoice: icon("ic_invoice"),
  product: icon("ic_product"),
  calendar: icon("ic_calendar"),
  disabled: icon("ic_disabled"),
  external: icon("ic_external"),
  menuItem: icon("ic_menu_item"),
  ecommerce: icon("ic_ecommerce"),
  analytics: icon("ic_analytics"),
  dashboard: icon("ic_dashboard"),
};

// ----------------------------------------------------------------------
export function useSecondaryNavData() {
  const data = [
    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: "",
      items: [
        // PRODUCT
        {
          title: "Shop",
          path: paths.product.root,
          icon: ICONS.product,
        },
      ],
    },
  ];
  return data;
}

export function useNavData() {
  const {} = useLocales();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      // {
      //   subheader: ('overview'),
      //   items: [
      //     {
      //       title: ('app'),
      //       path: paths.dashboard.root,
      //       icon: ICONS.dashboard,
      //     },
      //     {
      //       title: ('ecommerce'),
      //       path: paths.dashboard.general.ecommerce,
      //       icon: ICONS.ecommerce,
      //     },
      //     {
      //       title: ('analytics'),
      //       path: paths.dashboard.general.analytics,
      //       icon: ICONS.analytics,
      //     },
      //     {
      //       title: ('banking'),
      //       path: paths.dashboard.general.banking,
      //       icon: ICONS.banking,
      //     },
      //     {
      //       title: ('booking'),
      //       path: paths.dashboard.general.booking,
      //       icon: ICONS.booking,
      //     },
      //     {
      //       title: ('file'),
      //       path: paths.dashboard.general.file,
      //       icon: ICONS.file,
      //     },
      //   ],
      // },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: "management",
        items: [
          // USER
          // {
          //   title: ('user'),
          //   path: paths.dashboard.user.root,
          //   icon: ICONS.user,
          //   children: [
          //     { title: ('profile'), path: paths.dashboard.user.root },
          //     { title: ('cards'), path: paths.dashboard.user.cards },
          //     { title: ('list'), path: paths.dashboard.user.list },
          //     { title: ('create'), path: paths.dashboard.user.new },
          //     { title: ('edit'), path: paths.dashboard.user.demo.edit },
          //     { title: ('account'), path: paths.dashboard.user.account },
          //   ],
          // },

          // PRODUCT
          {
            title: "product",
            path: paths.dashboard.product.root,
            icon: ICONS.product,
            children: [
              { title: "list", path: paths.dashboard.product.root },
              {
                title: "details",
                path: paths.dashboard.product.demo.details,
              },
              { title: "create", path: paths.dashboard.product.new },
              { title: "edit", path: paths.dashboard.product.demo.edit },
            ],
          },

          // ORDER
          {
            title: "order",
            path: paths.dashboard.order.root,
            icon: ICONS.order,
            children: [
              { title: "list", path: paths.dashboard.order.root },
              { title: "details", path: paths.dashboard.order.demo.details },
            ],
          },

          // INVOICE
          {
            title: "invoice",
            path: paths.dashboard.invoice.root,
            icon: ICONS.invoice,
            children: [
              { title: "list", path: paths.dashboard.invoice.root },
              {
                title: "details",
                path: paths.dashboard.invoice.demo.details,
              },
              { title: "create", path: paths.dashboard.invoice.new },
              { title: "edit", path: paths.dashboard.invoice.demo.edit },
            ],
          },

          // BLOG
          // {
          //   title: ('blog'),
          //   path: paths.dashboard.post.root,
          //   icon: ICONS.blog,
          //   children: [
          //     { title: ('list'), path: paths.dashboard.post.root },
          //     { title: ('details'), path: paths.dashboard.post.demo.details },
          //     { title: ('create'), path: paths.dashboard.post.new },
          //     { title: ('edit'), path: paths.dashboard.post.demo.edit },
          //   ],
          // },

          // JOB
          // {
          //   title: ('job'),
          //   path: paths.dashboard.job.root,
          //   icon: ICONS.job,
          //   children: [
          //     { title: ('list'), path: paths.dashboard.job.root },
          //     { title: ('details'), path: paths.dashboard.job.demo.details },
          //     { title: ('create'), path: paths.dashboard.job.new },
          //     { title: ('edit'), path: paths.dashboard.job.demo.edit },
          //   ],
          // },

          // TOUR
          // {
          //   title: ('tour'),
          //   path: paths.dashboard.tour.root,
          //   icon: ICONS.tour,
          //   children: [
          //     { title: ('list'), path: paths.dashboard.tour.root },
          //     { title: ('details'), path: paths.dashboard.tour.demo.details },
          //     { title: ('create'), path: paths.dashboard.tour.new },
          //     { title: ('edit'), path: paths.dashboard.tour.demo.edit },
          //   ],
          // },

          // FILE MANAGER
          // {
          //   title: ('file_manager'),
          //   path: paths.dashboard.fileManager,
          //   icon: ICONS.folder,
          // },

          // MAIL
          // {
          //   title: ('mail'),
          //   path: paths.dashboard.mail,
          //   icon: ICONS.mail,
          //   info: <Label color="error">+32</Label>,
          // },

          // CHAT
          // {
          //   title: ('chat'),
          //   path: paths.dashboard.chat,
          //   icon: ICONS.chat,
          // },

          // CALENDAR
          // {
          //   title: ('calendar'),
          //   path: paths.dashboard.calendar,
          //   icon: ICONS.calendar,
          // },

          // KANBAN
          // {
          //   title: ('kanban'),
          //   path: paths.dashboard.kanban,
          //   icon: ICONS.kanban,
          // },
        ],
      },

      // DEMO MENU STATES
      // {
      //   subheader: (('other_cases')),
      //   items: [
      //     {
      //       // default roles : All roles can see this entry.
      //       // roles: ['user'] Only users can see this item.
      //       // roles: ['admin'] Only admin can see this item.
      //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
      //       // Reference from 'src/guards/RoleBasedGuard'.
      //       title: ('item_by_roles'),
      //       path: paths.dashboard.permission,
      //       icon: ICONS.lock,
      //       roles: ['admin', 'manager'],
      //       caption: ('only_admin_can_see_this_item'),
      //     },
      //     {
      //       title: ('menu_level'),
      //       path: '#/dashboard/menu_level',
      //       icon: ICONS.menuItem,
      //       children: [
      //         {
      //           title: ('menu_level_1a'),
      //           path: '#/dashboard/menu_level/menu_level_1a',
      //         },
      //         {
      //           title: ('menu_level_1b'),
      //           path: '#/dashboard/menu_level/menu_level_1b',
      //           children: [
      //             {
      //               title: ('menu_level_2a'),
      //               path: '#/dashboard/menu_level/menu_level_1b/menu_level_2a',
      //             },
      //             {
      //               title: ('menu_level_2b'),
      //               path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b',
      //               children: [
      //                 {
      //                   title: ('menu_level_3a'),
      //                   path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b/menu_level_3a',
      //                 },
      //                 {
      //                   title: ('menu_level_3b'),
      //                   path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b/menu_level_3b',
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     {
      //       title: ('item_disabled'),
      //       path: '#disabled',
      //       icon: ICONS.disabled,
      //       disabled: true,
      //     },
      //     {
      //       title: ('item_label'),
      //       path: '#label',
      //       icon: ICONS.label,
      //       info: (
      //         <Label color="info" startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}>
      //           NEW
      //         </Label>
      //       ),
      //     },
      //     {
      //       title: ('item_caption'),
      //       path: '#caption',
      //       icon: ICONS.menuItem,
      //       caption:
      //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
      //     },
      //     {
      //       title: ('item_external_link'),
      //       path: 'https://www.google.com/',
      //       icon: ICONS.external,
      //     },
      //     {
      //       title: ('blank'),
      //       path: paths.dashboard.blank,
      //       icon: ICONS.blank,
      //     },
      //   ],
      // },
    ],
    []
  );

  return data;
}
