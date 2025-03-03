import { NextResponse } from "next/server";
import solc from "solc";

export async function POST(req) {
  try {
    const { code } = await req.json();
    console.log("🔹 Solidity Code Received:\n", code);

    // ✅ Compile Solidity Code
    const input = {
      language: "Solidity",
      sources: { "Contract.sol": { content: code } },
      settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } },
    };

    const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
    console.log("🔹 Compilation Output:\n", compiled);

    // ✅ Extract ABI & Bytecode
    const contractName = Object.keys(compiled.contracts["Contract.sol"])[0];
    const compiledContract = compiled.contracts["Contract.sol"][contractName];

    if (!compiledContract) {
      console.error("❌ Compilation failed. No contract output.");
      return NextResponse.json({ error: "Compilation failed." }, { status: 400 });
    }

    console.log("✅ ABI Extracted:\n", compiledContract.abi);
    console.log("✅ Bytecode Extracted:\n", compiledContract.evm.bytecode.object);

    return NextResponse.json({
      abi: compiledContract.abi,
      bytecode: compiledContract.evm.bytecode.object,
    });
  } catch (error) {
    console.error("❌ Compilation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
