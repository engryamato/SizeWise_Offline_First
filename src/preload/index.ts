import { contextBridge } from 'electron';

type Api = {
  ping: () => string;
};

const api: Api = {
  ping: () => 'pong',
};

contextBridge.exposeInMainWorld('api', api);

