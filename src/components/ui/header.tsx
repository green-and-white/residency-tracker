import gwHorizontalBlack from '@/assets/gwlogo_horizontal_black.svg'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [currentTime, setCurrentTime] = useState<{ time: string }>({ time: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime({
        time: now.toLocaleTimeString("en-PH", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
        })
      });
    };

    updateDateTime(); // initialize immediately
    const timer = setInterval(updateDateTime, 1000); // update every second

    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="h-24 w-full px-8 border-b-2 border-gray-300 flex items-center justify-between bg-white">
      <img
        src={gwHorizontalBlack}
        alt="gwHorizontalBlack"
        className="cursor-pointer h-11 w-auto"
        onClick={()=>navigate(-1)} // returns to previous page 
      />
      <span className="text-2xl font-bold">
        {currentTime.time}
      </span>
      <span className="text-lg text-gray-700">
        {new Date().toLocaleDateString("en-PH", {
          month: "long",
          day: "numeric",
          year: "numeric"
        })}
      </span>
    </div>
  );
}