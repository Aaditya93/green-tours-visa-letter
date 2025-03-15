import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
  } from '@/components/ui/card';
  import { Skeleton } from '@/components/ui/skeleton';
  import { TbPresentationAnalytics } from "react-icons/tb";  

  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  import { Separator } from "@/components/ui/separator";
  import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar";
  import AppSidebar from "@/components/app-sidebar";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return(
        <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Report</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card className="w-full rounded-lg">
      
          <CardHeader className=" border-b p-4 sm:p-3 bg-primary rounded-t-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                      <CardTitle className="flex items-center text-xl font-bold text-center sm:text-left text-primary-foreground">
                        <TbPresentationAnalytics className="mr-2 w-8 h-8 text-primary-foreground" />
                        Report
                      </CardTitle>
                    </div>
                  </CardHeader>
        <CardContent className='p-0 rounded-none '>
   
          <Skeleton className="h-80 w-full p-0 pl-0 pr-0 mb-2" />
          <div className='grid grid-cols-2 gap-2 mb-2'>
          <Skeleton className="h-80 w-full p-0 pl-0 pr-0" />
          <Skeleton className="h-80 w-full p-0 pl-0 pr-0" />

          </div>
          <div className='grid grid-cols-2 gap-2 '>
          <Skeleton className="h-80 w-full p-0 pl-0 pr-0" />
          <Skeleton className="h-80 w-full p-0 pl-0 pr-0" />

          </div>
        
          

        </CardContent>
        </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
       
  }
