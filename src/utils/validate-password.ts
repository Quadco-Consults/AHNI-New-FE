import { z } from "zod";

export default function validatePassword(password: string) {
    const isMinLength = z.string().min(8);
    const hasSpecialChar = z.string().regex(/[@$!%*?&]/);
    const hasUpperCase = z.string().regex(/[A-Z]/);
    const hasNumber = z.string().regex(/[0-9]/);

    return {
        isMinLength: isMinLength.safeParse(password).success,
        hasSpecialChar: hasSpecialChar.safeParse(password).success,
        hasUpperCase: hasUpperCase.safeParse(password).success,
        hasNumber: hasNumber.safeParse(password).success,
    };
}
