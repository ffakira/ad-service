"use client";

import { useState, useEffect } from "react";
import Modal, { ModalOptions } from "@/components/Modal/Modal";
import FormBuilder, { FormSchema } from "@/components/FormBuilder/FormBuilder";
import { SubmitHandler } from "react-hook-form";

type RedeemNft = {
  _id: string;
  recipientAddress: string;
  redeemCode: string;
  isClaimed: boolean;
};

type RedeemNftInputs = {
  recipientAddress: string;
};

export default function NftPage({ params }: { params: { address: string } }) {
  const [listRedeemNft, setListRedeemNft] = useState<RedeemNft[]>([]);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [recipientAddress, setRecipientAddress] = useState<string | undefined>(
    undefined
  );
  const [modal, setModal] = useState<ModalOptions | undefined>(undefined);
  const [airdropId, setAirdropId] = useState<string | undefined>(undefined);

  const fetchAllNft = async () => {
    const req = await fetch(`/api/redeem/${params.address}`, {
      method: "GET",
      credentials: "include",
    });
    const { data } = await req.json();
    const formatData: RedeemNft[] = data.nft.map((redeemNft: RedeemNft) => ({
      _id: redeemNft._id,
      recipientAddress: redeemNft.recipientAddress,
      redeemCode: redeemNft.redeemCode,
      isClaimed: redeemNft.isClaimed,
    }));
    setListRedeemNft(formatData);
  };

  const formSchema: FormSchema<RedeemNftInputs> = {
    fields: [
      {
        name: "recipientAddress",
        label: "Recipient Address",
        type: "text",
        required: true,
      },
    ],
  };

  const defaultValues: RedeemNftInputs = {
    recipientAddress:
      recipientAddress ?? "0x0000000000000000000000000000000000000000",
  };

  const onSubmit: SubmitHandler<RedeemNftInputs> = async (
    data: RedeemNftInputs
  ): Promise<void> => {
    setSubmitLoading(true);
    try {
      const req = await fetch(`/api/redeem/${params.address}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientAddress: data.recipientAddress,
          airdropId,
        }),
      });
      if (req.status === 200) {
        const resp = await req.json();
        console.log(resp);
        /** @dev Update the table again */
        await fetchAllNft();
        /** @dev Close the modal after the data been updated */
        handleCloseModal();
      } else {
        console.error("[admin.nft[address]@onSubmit]:", req.status);
      }
    } catch (err) {
      console.error("[admin.nft[address]@onSubmit]:", (err as Error).message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseModal = (): void => {
    setAirdropId(undefined);
    setRecipientAddress(undefined);
    setModal(undefined);
  };

  const handleEditButton = (redeemNftId: string, recipientAddress: string) => {
    setAirdropId(redeemNftId);
    setRecipientAddress(recipientAddress);
    setModal(ModalOptions.EDIT_REDEEM_CODE);
  };

  useEffect(() => {
    fetchAllNft();
  }, []);

  return (
    <>
      <section>
        <h1>NFT Information</h1>
        <p>{params.address}</p>
        <table>
          <thead>
            <tr>
              <th>Recipient Addr</th>
              <th>Code</th>
              <th>Redeemed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listRedeemNft.length === 0 ? (
              <tr>
                <td className="font-bold text-center" colSpan={4}>
                  No Data Found :(
                </td>
              </tr>
            ) : (
              <>
                {listRedeemNft.map((redeemNft: RedeemNft) => (
                  <tr key={redeemNft._id}>
                    <td>
                      {redeemNft.recipientAddress.slice(0, 5).toUpperCase()}...
                      {redeemNft.recipientAddress.slice(36, 42).toUpperCase()}
                    </td>
                    <td>{redeemNft.redeemCode}</td>
                    <td>{redeemNft.isClaimed ? "Yes" : "No"}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleEditButton(
                            redeemNft._id,
                            redeemNft.recipientAddress
                          )
                        }
                        className="btn btn-primary"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </section>
      {modal === ModalOptions.EDIT_REDEEM_CODE ? (
        <Modal handleClose={handleCloseModal}>
          <div className="flex flex-col items-center py-12 px-8 gap-y-4">
            <h4>Edit Recipient Address</h4>
            <FormBuilder
              className="w-full"
              btnName="Save"
              loading={submitLoading}
              defaultValues={defaultValues}
              schema={formSchema}
              onSubmit={onSubmit}
            />
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
}
