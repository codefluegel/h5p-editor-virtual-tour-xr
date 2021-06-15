
declare type AudioTrack = {
  path: string;
  mime: string;
  copyright: { license: string; }
}

declare type Playlist = {
  audioTracks: Array<AudioTrack>;
  playlistId: string;
  title: string;
}

declare type Scene = {
  sceneId: number;
  interactions: Array<Interaction>;
  cameraStartPosition: string;
  sceneType: "360" | "panorama" | "static" | null;
  playlist: string;
};

declare type Interaction = {
  id: string;
  interactionpos: string;
  action: {
    library: string;
    params: {
      nextSceneId?: number | string;
    };
  };
  label?: {
    hotSpotSizeValues: string;
    isHotspotTabbable: boolean;
    labelPosition: string;
    showAsHotspot: boolean;
    showAsOpenSceneContent: boolean;
    showHotspotOnHover: boolean;
    showLabel: string;
  };
};

declare type CameraPosition = {
  yaw: number;
  pitch: number;
};

declare type Library = {
  uberName: string;
}

declare type ScenePreview = {
  getCamera: () => {
    camera: CameraPosition;
    fov: number;
  }
}

declare const H5P: any;
declare const H5PEditor: any;
