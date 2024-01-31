"use client";

import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import FormBuilder, { FormSchema } from "@/components/FormBuilder/FormBuilder";

type RedeemInputs = {
  nftAddress: string;
  recipientAddress: string;
  redeemCode: string;
};

export default function Dashboard(): React.ReactNode {
  const [loading, setLoading] = useState<boolean>(false);

  const formSchema: FormSchema<RedeemInputs> = {
    fields: [
      {
        name: "nftAddress",
        label: "NFT Address",
        type: "text",
        required: true,
      },
      {
        name: "recipientAddress",
        label: "Wallet Address",
        type: "text",
        required: true,
      },
      {
        name: "redeemCode",
        label: "Redeem Code",
        type: "text",
        required: true,
      },
    ],
  };

  const defaultValues: RedeemInputs = {
    nftAddress: "",
    recipientAddress: "",
    redeemCode: "",
  };

  const onSubmit: SubmitHandler<RedeemInputs> = async (
    data: RedeemInputs
  ): Promise<void> => {
    try {
      setLoading(true);
      console.log(data);
    } catch (err) {
      console.error("[dashboard@onSubmit]:", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Dashboard</h1>
      <div className="w-full md:w-[600px] shadow-2xl p-8 rounded-lg">
        <FormBuilder
          btnName="Claim"
          loading={loading}
          defaultValues={defaultValues}
          schema={formSchema}
          onSubmit={onSubmit}
        />
      </div>
    </section>
  );
}
