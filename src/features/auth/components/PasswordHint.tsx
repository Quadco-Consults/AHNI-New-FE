import validatePassword from "utils/validate-password";

type PropsType = {
    password: string;
};

export default function PasswordHint(props: PropsType) {
    const { password } = props;

    const { isMinLength, hasSpecialChar, hasUpperCase, hasNumber } =
        validatePassword(password);

    return (
        <div className="self-stretch">
            <p className="text-[12px] font-medium">Password must contain</p>

            <ul className="text-[12px] space-y-3 mt-3 list-disc pl-3">
                <li className={`${isMinLength && "text-green-500"}`}>
                    8 characters
                </li>
                <li className={`${hasSpecialChar && "text-green-500"}`}>
                    At least 1 special character
                </li>
                <li className={`${hasUpperCase && "text-green-500"}`}>
                    At least 1 capital letter
                </li>
                <li className={`${hasNumber && "text-green-500"}`}>
                    At least 1 number
                </li>
            </ul>
        </div>
    );
}