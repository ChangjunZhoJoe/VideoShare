import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Video {
  readonly id: string;
  readonly storageInfo?: string;
  constructor(init: ModelInit<Video>);
  static copyOf(source: Video, mutator: (draft: MutableModel<Video>) => MutableModel<Video> | void): Video;
}