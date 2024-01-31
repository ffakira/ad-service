"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Modal, { ModalOptions } from "@/components/Modal/Modal";
import FormBuilder, { FormSchema } from "@/components/FormBuilder/FormBuilder";
import { SubmitHandler } from "react-hook-form";
import Link from "next/link";

type RedeemInputs = {
  nftAddress: string;
  chain: string;
  quantity: number;
};

type StatsCardProps = {
  isLoading: boolean;
  value: number;
  description: React.ReactNode;
};

type Nft = {
  address: string;
  chain: string;
  _id: string;
};

const StatsCard: React.FC<StatsCardProps> = ({
  isLoading,
  value,
  description,
}): React.ReactNode => (
  <div className="flex flex-col items-center w-1/3 bg-blue-500/20 p-4 rounded-lg">
    <p className="font-bold text-3xl text-blue-900">
      {isLoading ? (
        <Image src="/images/spinner.svg" alt="Loading" width={25} height={25} />
      ) : (
        <>{value}</>
      )}
    </p>
    <p className="uppercase text-blue-900 text-xs md:text-sm">{description}</p>
  </div>
);

export default function AdminDashboard(): React.ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [nftAddress, setNftAddress] = useState<string | undefined>(undefined);
  const [listNft, setListNft] = useState<Nft[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [modal, setModal] = useState<ModalOptions | undefined>(undefined);

  const formSchema: FormSchema<RedeemInputs> = {
    fields: [
      {
        name: "nftAddress",
        label: "NFT Address",
        type: "text",
        required: true,
      },
      { name: "chain", label: "Chain", type: "text", required: true },
      { name: "quantity", label: "Quantity", type: "number", required: true },
    ],
  };

  const defaultValues: RedeemInputs = {
    nftAddress: "",
    chain: "Ethereum Mainnet",
    quantity: 0,
  };

  const onSubmit: SubmitHandler<RedeemInputs> = async (
    data: RedeemInputs
  ): Promise<void> => {
    try {
      setSubmitLoading(true);
      const req = await fetch("/api/airdrop/redeem", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nftAddress: data.nftAddress,
          quantity: data.quantity,
          chain: data.chain,
        }),
      });
      await getAllNfts();
    } catch (err) {
      console.error("[admin.dashboard@onSubmit]:", (err as Error).message);
    } finally {
      setSubmitLoading(false);
      handleCloseModal();
    }
  };

  const handleCloseModal = (): void => {
    if (modal === ModalOptions.DELETE_NFT_CONFIRMATION) {
      setNftAddress(undefined);
    }

    setModal(undefined);
  };

  const handleGenerateButton = () => {
    setModal(ModalOptions.GENERATE_REDEEM_CODE);
  };

  const handleDeleteButton = (nftAddress: string) => {
    setModal(ModalOptions.DELETE_NFT_CONFIRMATION);
    setNftAddress(nftAddress);
  };

  const getTotalUsers = async () => {
    setLoading(true);
    try {
      const req = await fetch("/api/auth/all");
      if (req.status === 200) {
        const { data } = await req.json();
        setTotalUsers(data.totalUsers);
      } else {
        setTotalUsers(0);
      }
    } catch (err) {
      console.error("[admin.dashboard@getTotalUsers]:", (err as Error).message);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const getAllNfts = async () => {
    setLoading(true);
    try {
      const req = await fetch("/api/nft", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (req.status === 200) {
        const { data } = await req.json();
        const formatData: Nft[] = data.map((val: Nft) => ({
          address: val.address,
          chain: val.chain,
          _id: val._id,
        }));
        setListNft(formatData);
      } else {
        setListNft([]);
      }
    } catch (err) {
      console.error("[admin.dashboard@getAllNfts]:", (err as Error).message);
      setListNft([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteNft = async () => {
    try {
      setLoading(true);
      const req = await fetch(`/api/nft/${nftAddress}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      /**
       * @dev If delete is succesful, updates the table again,
       * to cause a re-render
       */
      if (req.status === 200) {
        await getAllNfts();
        handleCloseModal();
      }
    } catch (err) {
      console.error("[admin.dashboard@deleteNft]:", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTotalUsers();
    getAllNfts();
  }, []);

  return (
    <>
      <section>
        <h1>Admin Dashboard</h1>
        <div className="flex flex-col shadow-lg p-8">
          <div className="flex items-center justify-between w-full">
            <h4>Generate Reedem Code</h4>
            <div onClick={handleGenerateButton} className="btn btn-primary">
              Generate
            </div>
          </div>
          <hr className="my-4" />
          <h5 className="mb-4">Statistics</h5>
          <div className="flex gap-x-4">
            <StatsCard
              description="Total Users"
              value={totalUsers}
              isLoading={loading}
            />
            <StatsCard
              description="Total Codes"
              value={0}
              isLoading={loading}
            />
            <StatsCard
              description="Redeem Codes"
              value={0}
              isLoading={loading}
            />
          </div>
        </div>
        <h3 className="mt-10 mb-5">Search Results</h3>
        <div className="flex mb-10 gap-4 w-full">
          <input placeholder="NFT Address" />
          <div>
            <button className="btn btn-primary">Search</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th className="text-sm md:text-base">NFT Addr.</th>
              <th className="hidden md:table-cell">Chain</th>
              <th className="text-sm md:text-base">Quantity</th>
              <th className="hidden sm:table-cell">Redeem</th>
              <th className="text-sm md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listNft.length === 0 ? (
              <tr>
                <td className="font-bold text-center text-blue-900" colSpan={5}>
                  No Data Found :(
                </td>
              </tr>
            ) : (
              <>
                {listNft.map((nft: Nft) => (
                  <tr key={nft._id}>
                    <td className="underline cursor-pointer">
                      <Link href={`/admin/nft/${nft.address}`}>
                        {nft.address.slice(0, 5).toUpperCase()}...
                        {nft.address.slice(36, 42).toUpperCase()}
                      </Link>
                    </td>
                    <td className="hidden md:table-cell">{nft.chain}</td>
                    <td className="text-sm md:text-base">0</td>
                    <td className="hidden sm:table-cell">0/100</td>
                    <td>
                      <button
                        onClick={() => handleDeleteButton(nft.address)}
                        className="btn btn-danger"
                      >
                        <Image
                          aria-label="Delete"
                          src="/images/rubbish.svg"
                          alt="Delete"
                          width={25}
                          height={25}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </section>
      {modal === ModalOptions.GENERATE_REDEEM_CODE ? (
        <Modal handleClose={handleCloseModal}>
          <div className="flex flex-col items-center py-12 px-8 gap-y-4">
            <h4>Generate New Codes</h4>
            <div className="w-full">
              <FormBuilder
                btnName="Generate Code"
                loading={submitLoading}
                defaultValues={defaultValues}
                schema={formSchema}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      {modal === ModalOptions.DELETE_NFT_CONFIRMATION ? (
        <Modal handleClose={handleCloseModal}>
          <div className="flex flex-col items-center py-12 px-8 gap-y-4">
            <h4>Are you sure to delete?</h4>
            <p>Note that this action is not reverseable.</p>
            <div className="flex gap-x-4">
              <button onClick={handleCloseModal} className="btn btn-primary">
                Cancel
              </button>
              <button onClick={deleteNft} className="btn btn-danger">
                {loading ? (
                  <span className="flex justify-center items-center gap-x-4">
                    <Image
                      src="/images/spinner.svg"
                      alt="Loading"
                      width={25}
                      height={25}
                    />
                    <>Delete</>
                  </span>
                ) : (
                  <>Delete</>
                )}
              </button>
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
}
