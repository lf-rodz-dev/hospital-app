import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const InvoiceCardSkeleton = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium">
          <Skeleton className="h-9 w-full" />
        </CardTitle>
        <div>
          <Skeleton className="h-9 w-9" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-rows-2 gap-1">
          <Skeleton className="h-12 pb-2" />
          <Skeleton className="h-5" />
        </div>
      </CardContent>
    </Card>
  );
};