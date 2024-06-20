import { z } from "zod";
import { zfd } from "zod-form-data";

export const numericSchema = (label: string, isZFD = true) => {
  const zz = z.coerce
    .number({
      coerce: true,
      required_error: `${label} is required.`,
      invalid_type_error: `${label} is invalid.`,
    })
    .min(1, { message: `Invalid ${label}.` });
  return isZFD ? zfd.numeric(zz) : zz;
};

export const dateSchema = (label: string, isZFD = true) => {
  const zz = z.coerce.date({
    coerce: true,
    required_error: `${label} is required.`,
    invalid_type_error: `${label} is invalid.`,
  });
  return isZFD ? zfd.text(zz) : zz;
};

export const textSchema = (label: string, isZFD = true) => {
  const zz = z.string({
    required_error: `${label} is required.`,
  });
  return isZFD ? zfd.text(zz) : zz;
};

export const requiredError = (label: string) => {
  return {
    required_error: `${label} is required.`,
  };
};
