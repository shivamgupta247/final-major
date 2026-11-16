declare module "@liveblocks/client" {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
    };
    UserMeta: {
      id: string;
      info: {
        name: string;
        color: string;
        avatar: string;
      };
    };
    RoomEvent: {};
    Storage: {};
  }
}

export {};
