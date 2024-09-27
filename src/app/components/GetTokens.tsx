"use client";
import { getTokenMetadata, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"; 
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import React, { useState } from "react";

interface Tokens {
    mint: string;
    amount: number;
    name: any,
    symbol: any,
    uri: any,
}

const GetTokens: React.FC = () => {
    const [tokenData, setTokenData] = useState<Tokens[] | null>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null)
    const connection = new Connection(clusterApiUrl("devnet"));

    async function fetchTokensByOwner() {
        if(!publicKey) throw new Error("please Provide publicKey")
        try {
            console.log("Fetching tokens for wallet");
            const ownerPublicKey = new PublicKey(publicKey);
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                ownerPublicKey,
                {
                    programId: TOKEN_2022_PROGRAM_ID, 
                }
            );

            console.log("Token accounts found:", tokenAccounts.value.length);
            const tokens: Tokens[] = await Promise.all(
                tokenAccounts.value.map(async (tokenAccountInfo: any) => {
                    const tokenInfo = tokenAccountInfo.account.data.parsed.info;
                    const mintAddress = tokenInfo.mint;
                    const tokenAmount = parseFloat(tokenInfo.tokenAmount.uiAmount) || 0;

                    const metadata = await getTokenMetadata(connection,new PublicKey(mintAddress));
                    const tokenName = metadata?.name || "Unknown";
                    const tokenSymbol = metadata?.symbol || "N/A";
                    const tokenUri = metadata?.uri || "";

                    console.log("uri: ", tokenUri);

                    return {
                        mint: mintAddress,
                        amount: tokenAmount,
                        name: tokenName,
                        symbol: tokenSymbol,
                        uri: tokenUri
                    };
            }));

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
                            <div className="flex border rounded-lg border-gray-400 p-3 m-2">
                                <div className="w-40 truncate">
                                    <a href={value.uri} target="_blank" rel="noopener noreferrer" className="flex items-center">{value.uri}</a>
                                </div>
                                <div className="ml-4">
                                    <a href={value.mint} className="text-base font-bold">Token Name: {value.name}</a>
                                    <p className="text-base font-semibold">Token Amount: {value.amount} {value.symbol}</p>
                                </div>
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
