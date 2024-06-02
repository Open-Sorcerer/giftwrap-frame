import { USDCABI, baseContractAddress, baseUSDC } from "@/constants";
import { TransactionTargetResponse, getFrameMessage } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData, parseUnits } from "viem";
import { base } from "viem/chains";

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json();

  const frameMessage = await getFrameMessage(json);

  if (!frameMessage) {
    throw new Error("No frame message");
  }

  const amt = parseUnits(frameMessage.inputText?.toString() ?? "1", 6);

  const calldata = encodeFunctionData({
    abi: USDCABI,
    functionName: "approve",
    args: [baseContractAddress, amt],
  });

  return NextResponse.json({
    chainId: `eip155:${base.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: USDCABI as Abi,
      to: baseUSDC as `0x${string}`,
      data: calldata,
    },
  });
}
