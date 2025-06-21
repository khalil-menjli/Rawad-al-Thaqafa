import useAuthStore from "@/store/useAuthStore";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

const Home = () => {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.log("Auth check error:", error);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [checkAuth]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return null; // or a loading spinner component
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
};

export default Home;