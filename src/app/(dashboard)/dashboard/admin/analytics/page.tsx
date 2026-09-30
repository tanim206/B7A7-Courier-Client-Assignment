"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAnalytics } from "@/hooks";

//  NO CHART LIBRARY IS INSTALLED, SO THE TREND IS DRAWN WITH
//  PLAIN BARS. THIS KEEPS THE PAGE FAST AND ACCESSIBLE

const formatDay = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

export default function AdminAnalyticsPage() {
  const { data, isPending, isError } = useAdminAnalytics();

  const analytics = data?.data;
  const daily = analytics?.daily ?? [];
  const maxShipments = Math.max(1, ...daily.map((day) => day.shipments));
  const maxRevenue = Math.max(1, ...daily.map((day) => day.revenue));

  const totalShipments = daily.reduce((sum, day) => sum + day.shipments, 0);
  const totalRevenue = daily.reduce((sum, day) => sum + day.revenue, 0);

  const maxStatus = Math.max(
    1,
    ...(analytics?.shipmentsByStatus ?? []).map((row) => row.count),
  );

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          The last 14 days of shipment volume, revenue and hub throughput.
        </p>
      </header>

      {isError && (
        <p className="text-sm text-destructive">
          Analytics could not be loaded. Please refresh and try again.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Card size="sm">
          <CardContent>
            <p className="text-xs text-muted-foreground">Shipments (14 days)</p>
            {isPending ? (
              <Skeleton className="mt-2 h-7 w-20" />
            ) : (
              <p className="mt-1 text-2xl font-semibold">{totalShipments}</p>
            )}
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent>
            <p className="text-xs text-muted-foreground">Revenue (14 days)</p>
            {isPending ? (
              <Skeleton className="mt-2 h-7 w-24" />
            ) : (
              <p className="mt-1 text-2xl font-semibold">
                {totalRevenue.toFixed(2)} BDT
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/*  DAILY VOLUME  */}

      <Card>
        <CardHeader>
          <CardTitle>Daily Shipments</CardTitle>
          <CardDescription>Parcels created per day.</CardDescription>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <div className="flex h-40 items-end gap-1">
              {daily.map((day) => (
                <Skeleton key={day.date} className="flex-1" />
              ))}
            </div>
          ) : (
            <div
              className="flex h-40 items-end gap-1"
              role="img"
              aria-label="Bar chart of shipments created per day"
            >
              {daily.map((day) => (
                <div
                  key={day.date}
                  className="group relative flex flex-1 flex-col items-center justify-end"
                  title={`${formatDay(day.date)}: ${day.shipments} shipments`}
                >
                  <div
                    className="w-full rounded-t bg-primary/80 transition-colors group-hover:bg-primary"
                    style={{
                      height: `${Math.max((day.shipments / maxShipments) * 100, day.shipments ? 4 : 1)}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{daily.length ? formatDay(daily[0].date) : ""}</span>
            <span>
              {daily.length ? formatDay(daily[daily.length - 1].date) : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      {/*  DAILY REVENUE  */}

      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
          <CardDescription>Paid bKash transactions per day.</CardDescription>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <div className="flex h-40 items-end gap-1">
              {daily.map((day) => (
                <Skeleton key={day.date} className="flex-1" />
              ))}
            </div>
          ) : (
            <div
              className="flex h-40 items-end gap-1"
              role="img"
              aria-label="Bar chart of revenue collected per day"
            >
              {daily.map((day) => (
                <div
                  key={day.date}
                  className="group relative flex flex-1 flex-col items-center justify-end"
                  title={`${formatDay(day.date)}: ${day.revenue} BDT`}
                >
                  <div
                    className="w-full rounded-t bg-emerald-500/80 transition-colors group-hover:bg-emerald-500"
                    style={{
                      height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue ? 4 : 1)}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/*  STATUS MIX  */}

      <Card>
        <CardHeader>
          <CardTitle>Shipments By Status</CardTitle>
          <CardDescription>All time.</CardDescription>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <div className="space-y-2">
              {[0, 1, 2].map((row) => (
                <Skeleton key={row} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          ) : analytics?.shipmentsByStatus.length ? (
            <ul className="space-y-2">
              {analytics.shipmentsByStatus.map((row) => (
                <li key={row.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{row.status}</span>
                    <span className="text-muted-foreground">{row.count}</span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(row.count / maxStatus) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No shipment data yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/*  TOP HUBS  */}

      <Card>
        <CardHeader>
          <CardTitle>Top Destination Hubs</CardTitle>
          <CardDescription>
            Ranked by delivered shipments.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <div className="space-y-2">
              {[0, 1, 2].map((row) => (
                <Skeleton key={row} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : analytics?.topDestinationHubs.length ? (
            <ul className="divide-y">
              {analytics.topDestinationHubs.map((hub) => (
                <li
                  key={hub.hubId}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{hub.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {hub.city} &middot; {hub.delivered} delivered
                    </p>
                  </div>

                  <span className="text-sm font-medium whitespace-nowrap">
                    {hub.revenue} BDT
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No delivered shipments yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
