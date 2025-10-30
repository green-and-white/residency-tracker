import { useTimeIn } from "../../hooks/useTimeIn"

export default function Residency() {
    const { handleTimeIn, isLoading, error } = useTimeIn();
    const currentTimestamp = new Date();  
  
    return (
        <>
            <p>This is where staffers time-in and time-out</p>
            {/* For Testing */}
            <button 
              className="border p-2" 
              onClick={async () => {
                await handleTimeIn(20250001, currentTimestamp, "core");
              }}
            >Time-in</button> 
            
            { !isLoading &&
              <p>Logged time-in at {currentTimestamp.toISOString()}</p>
            }
            {error && <p>{error}</p>} 
        
        </>
    )
}
