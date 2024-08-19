'use client'
import React from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";

export default function Navbar({ handleToggle }: { handleToggle: () => void }) {
    return (
        
        <nav className="fixed bg-white inset-x-0 top-0 z-50 w-full h-16 shadow-lg flex items-center justify-between px-4">
            <div className="flex  justify-center text-center gap-3 text-xl font-semibold">
                <div className="cursor-pointer items-center justify-center flex" onClick={handleToggle}><FaBars /></div>
                <Link href='/' className="text-2xl font-semibold text-center">TestiBoost</Link>
            </div>

        </nav>
        
    );
}