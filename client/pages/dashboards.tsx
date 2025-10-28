import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function PatientDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(()=>{
    if(!user) return;
    // fetch patient record by user id
    fetch(`/api/patients/by-user/${user.id}`).then(async (r)=>{
      if(r.ok){ const patient = await r.json();
        fetch(`/api/appointments?role=patient&patientId=${patient._id}`).then(async pr=>{ if(pr.ok){ setAppointments(await pr.json()); }});
      }
    });
  },[user]);

  return (
    <AppLayout>
      <section className="container py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patient Dashboard</h1>
            <p className="text-muted-foreground mt-2">Search doctors, book appointments, manage your history. Detailed UI coming next.</p>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Signed in as {user?.name}</div>
            <div className="mt-2"><Button variant="outline" onClick={logout}>Logout</Button></div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Your upcoming appointments</h3>
          {appointments.length===0? <div className="text-sm text-muted-foreground">No appointments</div> : (
            <ul className="space-y-3">
              {appointments.map(a=> (
                <li key={a._id} className="rounded-md border bg-card p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.reason || 'Consultation'}</div>
                    <div className="text-sm text-muted-foreground">{new Date(a.start).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{a.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppLayout>
  );
}

export function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ today: 0, noShows: 0, avgMins: 25 });

  useEffect(() => {
    if (!user) return;
    // fetch doctor record for this user
    fetch(`/api/doctors/by-user/${user.id}`).then(async (r) => {
      if (r.ok) {
        const doc = await r.json();
        setDoctorId(doc._id);
      }
    });
  }, [user]);

  useEffect(() => {
    if (!doctorId) return;
    fetch(`/api/appointments?role=doctor&doctorId=${doctorId}`).then(async (r) => {
      if (r.ok) {
        const items = await r.json();
        setAppointments(items);
        const today = items.filter((a:any)=>{
          const d = new Date(a.start);
          const now = new Date();
          return d.toDateString() === now.toDateString();
        }).length;
        setStats((s)=>({ ...s, today }));
      }
    });
  }, [doctorId]);

  return (
    <AppLayout>
      <section className="container py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage availability, review schedule, and analytics.</p>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Signed in as Dr. {user?.name}</div>
            <div className="mt-2"><Button variant="outline" onClick={logout}>Logout</Button></div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-md border bg-card p-4">
            <div className="text-sm text-muted-foreground">Today's appointments</div>
            <div className="text-2xl font-bold mt-2">{stats.today}</div>
          </div>
          <div className="rounded-md border bg-card p-4">
            <div className="text-sm text-muted-foreground">No-shows (30d)</div>
            <div className="text-2xl font-bold mt-2">{stats.noShows}</div>
          </div>
          <div className="rounded-md border bg-card p-4">
            <div className="text-sm text-muted-foreground">Avg appointment</div>
            <div className="text-2xl font-bold mt-2">{stats.avgMins}m</div>
          </div>
        </div>

        <div className="mt-8 rounded-md border bg-card p-4">
          <h3 className="font-semibold">Quick actions</h3>
          <div className="mt-3 flex gap-2">
            <Button>Bulk upload slots</Button>
            <Button variant="ghost">Block time</Button>
            <Button variant="outline">View analytics</Button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Upcoming appointments</h3>
          {appointments.length === 0 ? (
            <div className="text-sm text-muted-foreground">No upcoming appointments</div>
          ) : (
            <ul className="space-y-3">
              {appointments.map((a:any) => (
                <li key={a._id} className="rounded-md border bg-card p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.reason || 'Consultation'}</div>
                    <div className="text-sm text-muted-foreground">{new Date(a.start).toLocaleString()} — {new Date(a.end).toLocaleTimeString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${a.status==='confirmed' ? 'text-primary' : 'text-muted-foreground'}`}>{a.status}</div>
                    <div className="mt-2">
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppLayout>
  );
}

export function AdminDashboard() {
  const { user, logout } = useAuth();
  return (
    <AppLayout>
      <section className="container py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage users, clinics, and audit logs. Detailed UI coming next.</p>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Signed in as {user?.name}</div>
            <div className="mt-2"><Button variant="outline" onClick={logout}>Logout</Button></div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
