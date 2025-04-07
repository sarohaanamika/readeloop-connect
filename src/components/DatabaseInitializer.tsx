
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

  // Display a minimal error message if there's an error
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md max-w-xs">
        <p className="font-bold">Database Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // This is a utility component that doesn't render anything under normal circumstances
  return null;
};

export default DatabaseInitializer;
