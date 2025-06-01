// To parse this data:
//
//   import { Convert, PerformanceAssesmentModel } from "./file";
//
//   const PerformanceAssesmentModel = Convert.toPerformanceAssesmentModel(json);

export interface PerformanceAssesmentModel {
  status?: string;
  message?: string;
  data?: PerformanceAssesment;
}

export interface PerformanceAssesment {
  id?: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toPerformanceAssesmentModel(
    json: string
  ): PerformanceAssesmentModel {
    return JSON.parse(json);
  }

  public static PerformanceAssesmentModelToJson(
    value: PerformanceAssesmentModel
  ): string {
    return JSON.stringify(value);
  }
}
