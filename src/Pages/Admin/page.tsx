import { useNavigate } from "react-router-dom"
import { useState } from "react"
import gwLogo from '@/assets/gw_logo.png'
import { Spinner } from "@/components/ui/spinner"
import { createSession } from "@/utils/session"

export default function Admin() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [codeInput, setCodeInput] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (codeInput == "1061") {
            createSession()
            navigate("/getcode", { replace: true })
        } else {
            alert("Wrong code. Please try again.")
        }

        setIsLoading(false)
        setCodeInput("")
    }

    return (
        <main className="flex flex-col justify-center items-center min-h-screen space-y-4">
            <img src={gwLogo} alt="gwLogo" className='h-32 w-auto' />
            <p className="text-xl mb-8">Admin Page</p>
            <div>
                <input type="password" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder='Enter passcode' className='border rounded-sm px-2 py-1' required/>
                <button onClick={handleSubmit} className='m-2 border rounded-sm p-1 cursor-pointer hover:bg-gray-100 transition'>
                     {isLoading ? <Spinner className="h-4 w-auto text-gray-600" /> : "Submit"}
                </button>
            </div>

        </main>
    )
}