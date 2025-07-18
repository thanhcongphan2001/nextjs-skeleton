import i18n from "@i18n";
import { FuseNavItemType } from "@fuse/core/FuseNavigation/types/FuseNavItemType";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";

i18n.addResourceBundle("en", "navigation", en);
i18n.addResourceBundle("tr", "navigation", tr);
i18n.addResourceBundle("ar", "navigation", ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
  {
    id: "example-component",
    title: "Example",
    translate: "EXAMPLE",
    type: "item",
    icon: "lucide:star",
    url: "example",
  },
  {
    id: "tanstack-form-demo",
    title: "TanStack Form Demo",
    translate: "TANSTACK_FORM_DEMO",
    type: "item",
    icon: "lucide:clipboard-list",
    url: "tanstack-form-demo",
  },
  {
    id: "react-hook-form-demo",
    title: "React Hook Form Demo",
    translate: "REACT_HOOK_FORM_DEMO",
    type: "item",
    icon: "lucide:clipboard-list",
    url: "react-hook-form-demo",
  },
];

export default navigationConfig;
