"use client";

import Image from "next/image";
import React, { HTMLInputTypeAttribute } from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  DefaultValues,
  Path,
} from "react-hook-form";

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: HTMLInputTypeAttribute;
  required?: boolean | undefined;
  validate?: (value: T[keyof T], field: T) => boolean | undefined | string;
  loading?: boolean | undefined;
}

export interface FormSchema<T extends FieldValues> {
  fields: FormField<T>[];
}

export interface FormBuilderProps<T extends FieldValues = Record<string, any>> {
  btnName: string;
  defaultValues?: DefaultValues<T> | undefined;
  loading?: boolean | undefined;
  schema: FormSchema<T>;
  onSubmit: SubmitHandler<T>;
}

/**
 * @dev Note that this is a minimal example of dynamic form building
 * for input values only. This will not work for `select` field.
 */
const FormBuilder = <T extends FieldValues>({
  btnName = "Submit",
  defaultValues,
  loading,
  schema,
  onSubmit,
  ...props
}: FormBuilderProps<T>): React.ReactNode => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({ defaultValues });

  return (
    <form
      //@ts-ignore
      className={`flex flex-col gap-y-8 ${props.className}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      {schema.fields.map((field, index) => (
        <div key={index} className="flex flex-col">
          <label className="mb-1" htmlFor={field.label.toLowerCase()}>
            {field.label}
          </label>
          <input
            id={field.name as string}
            type={field.type}
            {...register(field.name, {
              required: field.required ? `${field.label} is required` : false,
              validate: field.validate,
            })}
          />
          {errors[field.name] && (
            <p className="text-red-500">
              {errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}
      <button className="btn btn-primary">
        {loading ? (
          <span className="flex justify-center items-center gap-x-4">
            <Image
              src="/images/spinner.svg"
              alt="Loading"
              width={25}
              height={25}
            />
            <>{btnName}</>
          </span>
        ) : (
          <>{btnName}</>
        )}
      </button>
    </form>
  );
};

export default FormBuilder;
