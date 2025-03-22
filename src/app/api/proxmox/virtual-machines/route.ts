import axios from "axios";
import https from "https";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await axios.get(
            "http://" +
                process.env.PUBLIC_PROXMOX_HOST +
                "/api2/json/cluster/resources?type=vm",
            {
                method: "GET",
                headers: {
                    Authorization: `PVEAPIToken=root@pam!main=6eb0b005-5f1f-4543-9451-026fbdff075d`,
                    "Content-Type": "application/json",
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false,
                }),
            }
        );
        const data = await response.data.data;
        return NextResponse.json({
            success: true,
            list: data,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error fetching data from Proxmox API",
        });
    }
}
