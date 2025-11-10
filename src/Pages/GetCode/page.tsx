import gwLogo from '@/assets/gw_logo.png'
import { useEffect, useState, useCallback } from "react"
import { getLoginCode, createLoginCode } from "@/services/loginCodeService";
import { Spinner } from '@/components/ui/spinner';

export default function GetCode() {
    const [loginCode, setLoginCode] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isResending, setIsResending] = useState(false);

    const fetchCode = useCallback(async () => {
        setIsLoading(true);
        const data = await getLoginCode();
        if (data) {
            setLoginCode(data[0].code);
        }
        setIsLoading(false);
    }, []);
    
    useEffect(() => {
        fetchCode();
    }, [fetchCode]);

    const handleResend = async () => {
        try {
        setIsResending(true)
        await createLoginCode()
        await fetchCode()
        } catch (err) {
        console.error(err);
        alert("Failed to resend login code")
        } finally {
            setIsResending(false)
        }
    };

    return (
        <main className="flex flex-col justify-center items-center min-h-screen">
            <img src={gwLogo} alt="gwLogo" className='h-32 w-auto' />
            {isLoading ? <Spinner className="h-5 w-5 text-gray-600" /> : <p>Login code: {loginCode}</p>}
            <div className='flex flex-col items-center mt-10'>
                <button
                onClick={handleResend}
                disabled={isResending}
                className={`m-2 border rounded-sm px-3 py-2 transition ${isResending ? "opacity-50 cursor-not-allowed text-gray-400": "cursor-pointer hover:bg-gray-100 text-black"}`}
                >
                Get a new code
                </button>
            </div>
        </main>
    )
}