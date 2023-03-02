/// <reference types="express-serve-static-core" />
import { Server } from "socket.io";

interface HttpSocket {
  readonly io: Server;
}
export declare class httpSocket implements HttpSocket {
  readonly io: Server;
  constructor(server: Express.Application);
}
export declare function initSocket(server: Express.Application): void;
export declare function getSocketIO(): Server<
  import("socket.io/dist/typed-events").DefaultEventsMap,
  import("socket.io/dist/typed-events").DefaultEventsMap,
  import("socket.io/dist/typed-events").DefaultEventsMap,
  any
>;
