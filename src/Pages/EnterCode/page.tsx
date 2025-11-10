import gwLogo from '@/assets/gw_logo.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyLoginCode } from '@/services/loginCodeService'
import { Spinner } from '@/components/ui/spinner'
import { createSession } from '@/utils/session'

export default function EnterCode() {
    const [codeInput, setCodeInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // const [resendCooldown, setResendCooldown] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
        const isValid = await verifyLoginCode(Number(codeInput));

        if (isValid) {
            createSession()
            navigate("/residency", { replace: true });
        } else {
            alert("Invalid login code");
        }
        } catch (err) {
            console.error(err);
            alert("Error verifying code");
        } finally {
            setIsLoading(false);
            setCodeInput("");
        }
    };

    // const handleResend = async () => {
    //     try {
    //     await createLoginCode();
    //     setResendCooldown(10);
    //     } catch (err) {
    //     console.error(err);
    //     alert("Failed to resend login code");
    //     }
    // };

//     useEffect(() => {
//     if (resendCooldown <= 0) return;
//     const timer = setInterval(() => {
//       setResendCooldown((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [resendCooldown]);

    return (
        <main className='flex flex-col justify-center items-center min-h-screen space-y-4'>
            <img src={gwLogo} alt="gwLogo" className='h-32 w-auto' />
            <div>
                <input type="password" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder='Enter code here' className='border rounded-sm px-2 py-1' required/>
                <button onClick={handleSubmit} className='m-2 border rounded-sm p-1 cursor-pointer hover:bg-gray-100 transition'>
                     {isLoading ? <Spinner className="h-4 w-auto text-gray-600" /> : "Submit"}
                </button>
            </div>
            {/* <div className='flex flex-col items-center mt-20'>
                <p>Didn't receive it?</p>
                <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className='m-2 border rounded-sm px-3 py-2 cursor-pointer hover:bg-gray-100 transition'
                >
                {resendCooldown > 0
                    ? `Regenerate in ${resendCooldown}s`
                    : "Get a new code"}
                </button>
            </div> */}
        </main>
    )
}
