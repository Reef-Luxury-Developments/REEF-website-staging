declare module "react-gtm-module" {
  export interface TagManagerArgs {
    gtmId: string;
    dataLayer?: Record<string, any>;
    dataLayerName?: string;
    auth?: string;
    preview?: string;
  }

  export interface DataLayerArgs {
    dataLayer?: Record<string, any>;
    dataLayerName?: string;
  }

  const TagManager: {
    initialize: (args: TagManagerArgs) => void;
    dataLayer: (args: DataLayerArgs) => void;
  };

  export default TagManager;
}
