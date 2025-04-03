
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { checkIfDatabaseIsSeeded, seedDatabase } from "@/utils/seedDatabase";

// This component seeds the database with initial data if it's empty
const DatabaseInitializer: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsInitializing(true);
        
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
            toast.error("Failed to initialize database");
          }
        } else {
          console.log("Database already has data, skipping seeding.");
        }
        
        setInitialized(true);
      } catch (error) {
        console.error("Error initializing database:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, []);

  return null; // This is a utility component and doesn't render anything
};

export default DatabaseInitializer;
