import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {  AlertCircle } from 'lucide-react';
import Link from 'next/link';



export const Error = () => {
    return(
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-2 text-center">
        </CardHeader>
        
        <CardContent className="text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <div className="space-y-4 text-center">
  <h2 className="text-2xl font-semibold text-destructive">Application Not Found</h2>
  <p className="text-muted-foreground">
    We couldn&#39;t find the application you&#39;re looking for. This might be because:
  </p>
  <ul className="text-sm justify-start items-center text-muted-foreground list-disc list-inside">
    <li>The application has been deleted</li>
    <li>The URL might be incorrect</li>
    <li>You don&#39;t have permission to view this application</li>
  </ul>
  </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button 
           asChild
            className="w-full max-w-xs"
          >
             <Link href="/application/10">Back to Applications</Link>
            
          </Button>
        </CardFooter>
      </Card>
    </div>
    );
}

export default Error;
