"use client";
import { signOut } from "next-auth/react";
export function LogoutButton(){return <button className="button secondary" onClick={()=>void signOut({callbackUrl:"/"})}>Sign out</button>}
