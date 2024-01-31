"use client";

import style from "./style.module.scss";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthCtx } from "@/contexts/AuthContext";

interface NavbarProps {
  connectSid: {
    name: string;
    value: string;
  };
}

export default function Navbar({ connectSid }) {
  const { isAuth, setIsAuth, setUsername, setIsAdmin } = useAuthCtx();

  const handleLogoutButton = async () => {
    try {
      const req = await fetch("/api/auth/logout", {
        method: "DELETE",
        credentials: "include",
        headers: {
          Cookie: `${connectSid.name}=${connectSid.value}`,
        },
      });
      setIsAuth(false);
      setIsUsername("");
      setIsAdmin(false);

      window.location.href = "/login";
    } catch (err) {
      console.error("[Navbnar@handleLogoutButton]:", (err as Error).message);
    }
  };

  return (
    <nav className={style.navbar}>
      <div className={style.container}>
        <span>
          <Link href="/">NFT Airdrop</Link>
        </span>
        {isAuth ? (
          <div
            onClick={handleLogoutButton}
            role="button"
            className="btn btn-danger"
          >
            Logout
          </div>
        ) : (
          <Link className="btn btn-primary" href="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
