import fs from "fs";

export const readFromJson = async (parameter: string): Promise<any> => {
    try {
        return await fs.promises.readFile(parameter, "utf-8")
    } catch (error: any) {
        return null;
    }
};

export const writeToJson = async (
    parameter: string,
    value: any
): Promise<void> => {
    try {
        fs.writeFileSync(
            parameter,
            value,
            "utf-8"
        );
    } catch (error: any) {
        return;
    }
};
