
import { useState } from "react";
import { Bell, Book, Calendar, Check, Info, X } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Mock notifications data
const mockNotifications = [
  {
    id: "n1",
    type: "due_soon",
    title: "Book due soon",
    message: "Your loan for 'The Great Gatsby' is due in 2 days.",
    date: "2025-04-03T10:30:00Z",
    read: false,
  },
  {
    id: "n2",
    type: "overdue",
    title: "Overdue notice",
    message: "Your loan for '1984' is now overdue. Please return it as soon as possible to avoid additional fees.",
    date: "2025-04-01T15:45:00Z",
    read: true,
  },
  {
    id: "n3",
    type: "available",
    title: "Book available",
    message: "Good news! 'Dune' is now available for pickup. Your reservation will be held for 3 days.",
    date: "2025-03-29T09:15:00Z",
    read: true,
  },
  {
    id: "n4",
    type: "event",
    title: "Upcoming event",
    message: "Author signing event: Join us for a book signing with Margaret Atwood on April 15th.",
    date: "2025-03-25T14:20:00Z",
    read: false,
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "due_soon":
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case "overdue":
        return <Calendar className="h-5 w-5 text-red-500" />;
      case "available":
        return <Book className="h-5 w-5 text-green-500" />;
      case "event":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppLayout>
      <div className="container py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{notification.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {formatDate(notification.date)}
                          </p>
                        </div>
                        
                        {!notification.read && (
                          <Badge className="ml-2">New</Badge>
                        )}
                      </div>
                      
                      <p className="mt-2">{notification.message}</p>
                      
                      <div className="flex gap-2 mt-4 justify-end">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
              <h3 className="mt-4 text-lg font-medium">No notifications</h3>
              <p className="text-muted-foreground mt-1">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Notifications;
