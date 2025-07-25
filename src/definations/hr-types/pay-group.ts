export interface Grade {
  name: string;
  id: string;
}

export interface PayGroup {
  [x: string]: any;
  position: {
    name: string;
    id: number | string;
    grade: Grade;
  };
}
