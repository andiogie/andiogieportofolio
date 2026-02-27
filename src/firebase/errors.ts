
export class FirestorePermissionError extends Error {
  public path: string;
  public operation: string;
  public requestData: any;

  constructor(details: { path: string; operation: string; requestResourceData: any }) {
    super(`Permission denied for ${details.operation} at ${details.path}`);
    this.name = 'FirestorePermissionError';
    this.path = details.path;
    this.operation = details.operation;
    this.requestData = details.requestResourceData;
  }
}
