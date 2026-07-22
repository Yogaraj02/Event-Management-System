import { useState, useEffect } from "react";
import { reportService } from "../../services/reportService";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../hooks/useToast";

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reportService.getEventStats();
        setData(res);
      } catch {
        showToast("Failed to load reports", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [showToast]);

  if (loading) return <LoadingSpinner message="Generating Reports..." />;

  return (
    <div className="container">
      <h1 className="page-title">Reports & Analytics</h1>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: "30px" }}>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-details">
            <h3>{data?.totalEvents || 0}</h3>
            <p>Total Events</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-details">
            <h3>{data?.totalRegistrations || 0}</h3>
            <p>Total Registrations</p>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: "15px", color: "#333", fontSize: "1.2rem" }}>
        Event Occupancy & Registration Report
      </h2>

      {!data?.eventStats || data.eventStats.length === 0 ? (
        <EmptyState title="No event stats available" message="Create events to see analytics." />
      ) : (
        <div className="table-responsive card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Category</th>
                <th>Event Date</th>
                <th>Total Seats</th>
                <th>Registered Count</th>
                <th>Occupancy Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.eventStats.map((event) => (
                <tr key={event.id}>
                  <td><strong>{event.title}</strong></td>
                  <td><span className="badge">{event.category}</span></td>
                  <td>{event.date}</td>
                  <td>{event.totalSeats}</td>
                  <td>
                    <strong>{event.registeredCount}</strong>
                  </td>
                  <td>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: event.occupancyRate,
                          backgroundColor:
                            parseFloat(event.occupancyRate) >= 90
                              ? "#d93025"
                              : parseFloat(event.occupancyRate) >= 50
                              ? "#f9ab00"
                              : "#1a73e8",
                        }}
                      ></div>
                      <span className="progress-text">{event.occupancyRate}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
