type TProps = {
    children: React.ReactNode;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    multiple?: boolean;
};

export default function Upload({
    children,
    onChange,
    multiple = false,
}: TProps) {
    return (
        <div className="inline-block relative">
            {children}
            <input
                type="file"
                multiple={multiple}
                className="absolute w-full h-full left-0 top-0 right-0 bottom-0 cursor-pointer opacity-0"
                onChange={onChange}
            />
        </div>
    );
}
