
import React from "react";
import { BookMarked, BookCheck, AlertCircle, BookOpen } from "lucide-react";

interface StatsProps {
  activeLoansCount: number;
  returnedLoansCount: number;
  overdueLoansCount: number;
  totalLoansCount: number;
}

const DashboardStats: React.FC<StatsProps> = ({
  activeLoansCount,
  returnedLoansCount,
  overdueLoansCount,
  totalLoansCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mr-4">
            <BookMarked className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Loans</p>
            <h3 className="text-2xl font-bold">{activeLoansCount}</h3>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mr-4">
            <BookCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Books Returned</p>
            <h3 className="text-2xl font-bold">{returnedLoansCount}</h3>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mr-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Overdue Books</p>
            <h3 className="text-2xl font-bold">{overdueLoansCount}</h3>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mr-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Borrowed</p>
            <h3 className="text-2xl font-bold">{totalLoansCount}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
