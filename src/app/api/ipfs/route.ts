import { NextResponse } from "next/server";
import { MAX_UPLOAD_BYTES } from "@/app/lib/constants";
import {
  guardApiRequest,
  readBodyWithLimit,
} from "@/app/lib/helpers/apiGuards";
// import FormData from 'form-data';

const auth = "Bearer " + process.env.IPFS_ADD_KEY;

export async function POST(req: Request) {
  try {
    const blocked = guardApiRequest(req, "ipfs");
    if (blocked) return blocked;

    const contentLength = req.headers.get("content-length") || "";
    if (
      !/^\d+$/.test(contentLength) ||
      Number(contentLength) > MAX_UPLOAD_BYTES
    ) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const bytes = await readBodyWithLimit(req, MAX_UPLOAD_BYTES);
    if (!bytes) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const contentType = req.headers.get("content-type") || "";
    let body;

    if (contentType.includes("application/json")) {
      const blob = new Blob(
        [JSON.stringify(JSON.parse(new TextDecoder().decode(bytes)))],
        {
          type: "application/json",
        }
      );

      body = new FormData();
      body.append("file", blob, "file.json");
    } else {
      body = new FormData();
      body.append(
        "file",
        new Blob([bytes], { type: contentType }),
        "file.png"
      );
    }
    const response = await fetch("https://cdn.digitalax.xyz/api/v0/add", {
      method: "POST",
      headers: {
        authorization: auth,
      },
      body,
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from IPFS:", errorText);
      throw new Error("Failed to upload to IPFS");
    }
    const data = await response.json();
    const cid = data?.Hash;

    const res = NextResponse.json({ cid });
    return res;
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
