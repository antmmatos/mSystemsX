import bcrypt from "bcryptjs";

async function saltAndHashPassword(password: string) {
    if (!password) throw new Error("Erro interno A01");
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

async function verifyPassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

export { saltAndHashPassword, verifyPassword };
