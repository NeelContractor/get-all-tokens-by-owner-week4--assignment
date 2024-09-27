"use client";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"; // Use TOKEN_PROGRAM_ID instead of TOKEN_2022_PROGRAM_ID for now
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";

interface Tokens {
    mint: string;
    amount: number;
}

const GetTokens: React.FC = () => {
    const [tokenData, setTokenData] = useState<Tokens[] | null>(null);
    const [publicKey,setPublicKey] = useState<string | null>(null)
    const connection = new Connection(clusterApiUrl("devnet"));

    // Fetch tokens owned by the wallet
    async function fetchTokensByOwner() {
        if(!publicKey) throw new Error("please Provide publicKey")
        try {
            console.log("Fetching tokens for wallet");
            const ownerPublicKey = new PublicKey(publicKey);
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                ownerPublicKey,
                {
                    programId: TOKEN_2022_PROGRAM_ID, // Try TOKEN_PROGRAM_ID
                }
            );

            console.log("Token accounts found:", tokenAccounts.value.length);
            const tokens: Tokens[] = tokenAccounts.value.map((tokenAccountInfo: any) => {
                const tokenInfo = tokenAccountInfo.account.data.parsed.info;
                const mintAddress = tokenInfo.mint;
                const tokenAmount = parseFloat(tokenInfo.tokenAmount.uiAmount) || 0;

                console.log("mintaddress ===",mintAddress);

                connection.get

                return {
                    mint: mintAddress,
                    amount: tokenAmount,
                };
            });

            setTokenData(tokens);
        } catch (error) {
            console.error("Error fetching tokens:", error);
        }
    }

    return (
        <div className="grid border rounded-lg drop-shadow-md p-10">
            <div className="flex justify-center">
                <input 
                    type="text" 
                    className="border rounded-lg text-base font-semibold p-2 mb-3 outline-none w-8/12" 
                    placeholder="Enter your PublicKey here."
                    onChange={(e) => setPublicKey(e.target.value)}
                />
            </div>
            <div className="flex justify-center">
                <button 
                    className="border bg-blue-600 text-base font-semibold rounded-lg p-3"
                    onClick={fetchTokensByOwner}
                >Get Tokens</button>
            </div>
            <div className="grid justify-center ">
                {tokenData?.length ? (
                    tokenData.map((value, index) => (
                        <React.Fragment key={index}>
                            <div className="border rounded-lg border-gray-400 p-3 m-2">
                                <p className="text-lg font-bold">Token Mint Address: {value.mint}</p>
                                <p className="text-base font-bold">- Token Mint Amount: {value.amount}</p>
                            </div>
                            <br />
                        </React.Fragment>
                    ))
                ) : (
                    <p className="font-bold text-base text-slate-400 m-2">No tokens found for this wallet.</p>
                )}
            </div>
        </div>
    );
};

export default GetTokens;
