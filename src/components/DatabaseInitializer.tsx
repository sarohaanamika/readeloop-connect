
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { checkIfDatabaseIsSeeded, seedDatabase } from "@/utils/seedDatabase";

// This component seeds the database with initial data if it's empty
const DatabaseInitializer: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsInitializing(true);
        setError(null);
        
        console.log("Checking if database is seeded...");
        // Check if database is already seeded
        const isSeeded = await checkIfDatabaseIsSeeded();
        
        if (!isSeeded) {
          console.log("Database is empty. Seeding with initial data...");
          toast.info("Initializing database with sample data...");
          
          const result = await seedDatabase();
          
          if (result.success) {
            console.log("Database seeded successfully!");
            toast.success("Database initialized with sample data");
          } else {
            console.error("Failed to seed database:", result.error);
            setError(`Failed to seed database: ${result.error}`);
            toast.error("Failed to initialize database. Check console for details.");
          }
        } else {
          console.log("Database already has data, skipping seeding.");
        }
        
        setInitialized(true);
      } catch (error) {
        console.error("Error initializing database:", error);
        setError(`Error initializing database: ${error instanceof Error ? error.message : String(error)}`);
        toast.error("Database initialization error. Check console for details.");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, []);

  // Display a more detailed error message if there's an error
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md max-w-md z-50">
        <div className="flex">
          <div className="py-1">
            <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
            </svg>
          </div>
          <div>
            <p className="font-bold">Database Error</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-1">Please check the console for more details or try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Display loading indicator when initializing
  if (isInitializing) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-md max-w-xs z-50">
        <p className="font-bold">Database</p>
        <p className="text-sm flex items-center">
          <span className="inline-block mr-2 h-3 w-3 bg-blue-500 rounded-full animate-pulse"></span>
          Initializing database...
        </p>
      </div>
    );
  }

  // This is a utility component that doesn't render anything under normal circumstances
  return null;
};

export default DatabaseInitializer;
