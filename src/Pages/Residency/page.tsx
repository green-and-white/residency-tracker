import { useState } from "react";
import { useTimeIn } from "../../hooks/useTimeIn"
import { useTimeOut } from "../../hooks/useTimeOut";

export default function Residency() {
    const { handleTimeIn, isLoading, error } = useTimeIn();
    const { handleTimeOut } = useTimeOut();
    const currentTimestamp = new Date();  
    const [isTimedOut, setIsTimedOut] = useState(false);

    return (
        <>
            <p>This is where staffers time-in and time-out</p>
            
            {/* For Testing */}
            <div className="flex gap-2">
                <button 
                  className={`border p-2 ${!isTimedOut && "bg-gray-300 cursor-not-allowed line-through"}`}
                  disabled={!isTimedOut}
                  onClick={async () => {
                    await handleTimeIn(20250001, currentTimestamp, "core");
                    setIsTimedOut(false)
                  }}
                >Time in</button>  

                <button
                  className={`border p-2 ${isTimedOut && "bg-gray-300 cursor-not-allowed line-through"}`}
                  disabled={isTimedOut}
                  onClick={async () => {
                    await handleTimeOut(20250001, currentTimestamp); 
                    setIsTimedOut(true);
                    // Note: check supabase to check reflection!
                  }} 
                >Time out</button> 
            </div> 
            
            { !isLoading &&
              <p>Logged time-in at {currentTimestamp.toISOString()}</p>
            }
            { error && <p>{error}</p> }  
            { isTimedOut && <p>Logged time out at {currentTimestamp.toISOString()}</p>}
        </>
    )
}
