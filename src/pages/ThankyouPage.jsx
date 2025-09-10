import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ThankyouPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Thank You!</h1>
        <p className="text-gray-700">
          Your order has been placed successfully.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Redirecting to home page...
        </p>
      </div>
    </div>
  );
}
