import { Phone, Calendar, TrendingUp } from "lucide-react";

export default function DashboardMockup() {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-2xl shadow-black/50">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <div className="h-3 w-3 rounded-full bg-[#28C840]" />
        <div className="ml-4 flex-1 rounded-md bg-surface px-3 py-1 text-xs text-text-muted">
          dashboard.dartercalls.com
        </div>
      </div>

      {/* Dashboard content */}
      <div className="grid gap-4 p-6 lg:grid-cols-[1fr_280px]">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatBlock label="Total Calls Handled" value="1,248" />
          <StatBlock label="Appointments Booked" value="342" />
          <StatBlock label="Patient ROI" value="12.4x" />
          <StatBlock label="Revenue Generated" value="$86.2K" highlight />
        </div>

        {/* Activity feed */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-text-primary">
            Live Activity Feed
          </p>
          <div className="mt-4 space-y-4">
            <ActivityItem
              text="New Appointment Scheduled"
              detail="Patient #29481 handled by Darter AI"
            />
            <ActivityItem
              text="Follow-Up Call Completed"
              detail="Patient #18204 rescheduled for Tuesday"
            />
            <ActivityItem
              text="New Appointment Scheduled"
              detail="Patient #31056 handled by Darter AI"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs text-text-muted">{label}</p>
      <p
        className={`mt-2 text-2xl font-bold sm:text-3xl ${
          highlight ? "text-accent-400" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ActivityItem({ text, detail }: { text: string; detail: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-400/10">
        <Phone className="h-3.5 w-3.5 text-accent-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{text}</p>
        <p className="text-xs text-text-muted">{detail}</p>
      </div>
    </div>
  );
}
