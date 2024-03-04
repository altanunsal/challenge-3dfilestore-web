export type ObjFile = {
  id: string;
  name: string;
  creation_date: Date;
  size: number;
};

export type ObjFileMeta = Omit<ObjFile, "creation_date"> & {
  creation_date: string; // using string as the sqlite DB does expects ISO18601 date string
  file_path: string; // so we can retrieve the file from local
};

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};
