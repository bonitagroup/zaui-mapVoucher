import { ReactNode } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface ContainerLayoutProps {
    title: string;
    children?: ReactNode;
    showBack?: boolean;
}

export default function ContainerLayout({
    title,
    children,
    showBack = true,
}: ContainerLayoutProps) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* AppBar */}
            <header className="bg-red-600 text-white shadow-md">
                <div className="flex items-center gap-3 px-4 py-3 mt-10">
                    {showBack && (
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-red-500 transition"
                        >
                            <IoArrowBack size={22} />
                        </button>
                    )}
                    <h1 className="text-lg font-semibold truncate">{title}</h1>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
