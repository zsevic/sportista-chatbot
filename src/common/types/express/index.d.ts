interface Session {
  socketId: string;
}

declare namespace Express {
  interface Request {
    session: Session;
  }
}
