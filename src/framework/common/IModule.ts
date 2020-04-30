export interface IModule {
  name : string;
  init() : Promise<boolean>;
}
