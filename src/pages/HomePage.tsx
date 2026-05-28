import { useState, useMemo, useEffect } from "react";
import type { JobApplication, JobStatus, ViewType, SortType } from "../types";
import { getJobs, createJob, updateJob, deleteJob } from "../api/jobs";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import "./HomePage.css";

const filterStatuses: Array<JobStatus | "All"> = [
  "All",
  "Submitted",
  "In Progress",
  "Accepted",
  "Rejected",
  "Ghosted",
];

const statusOrder: Record<JobStatus, number> = {
  Submitted: 0,
  "In Progress": 1,
  Accepted: 2,
  Rejected: 3,
  Ghosted: 4,
};

export default function HomePage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<JobStatus | "All">("All");
  const [view, setView] = useState<ViewType>("card");
  const [sortBy, setSortBy] = useState<SortType>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    let cancelled = false;
    getJobs()
      .then((data) => {
        if (!cancelled) {
          setJobs(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load jobs");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const sortedAndFiltered = useMemo(() => {
    const filtered =
      filter === "All" ? [...jobs] : jobs.filter((j) => j.status === filter);

    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateDiff =
          new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime();
        return sortDir === "asc" ? dateDiff : -dateDiff;
      }
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return sortDir === "asc" ? statusDiff : -statusDiff;
      const dateDiff =
        new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime();
      return sortDir === "asc" ? dateDiff : -dateDiff;
    });

    return filtered;
  }, [jobs, filter, sortBy, sortDir]);

  const handleAdd = async (job: JobApplication) => {
    await createJob(job);
    setRefreshKey((k) => k + 1);
    setShowForm(false);
  };

  const handleUpdate = async (id: string, updates: Partial<JobApplication>) => {
    await updateJob(id, updates);
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = async (id: string) => {
    await deleteJob(id);
    setRefreshKey((k) => k + 1);
  };

  const toggleSortDir = () =>
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));

  return (
    <>
      <header className="app-header">
        <h1>Job Application Tracker</h1>
        <button
          type="button"
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
          + Add Job
        </button>
      </header>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button type="button" onClick={() => setRefreshKey((k) => k + 1)}>
            Retry
          </button>
        </div>
      )}

      {showForm && (
        <JobForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      <div className="toolbar">
        <div className="filters">
          {filterStatuses.map((status) => (
            <button
              key={status}
              type="button"
              className={`filter-btn ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status}
              {status !== "All" && (
                <span className="filter-count">
                  {jobs.filter((j) => j.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="controls">
          <div className="sort-control">
            <label htmlFor="sort-select">Sort by</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
            >
              <option value="date">Date Applied</option>
              <option value="status">Status</option>
            </select>
            <button
              type="button"
              className="sort-dir-btn"
              onClick={toggleSortDir}
              aria-label={
                sortDir === "asc" ? "Sort ascending" : "Sort descending"
              }
            >
              {sortDir === "asc" ? "↑" : "↓"}
            </button>
          </div>

          <div className="view-toggle">
            <button
              type="button"
              className={`view-btn ${view === "card" ? "active" : ""}`}
              onClick={() => setView("card")}
              aria-label="Card view"
            >
              ⊞
            </button>
            <button
              type="button"
              className={`view-btn ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
              aria-label="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="loading-state">Loading applications…</p>
      ) : (
        <div className={view === "card" ? "job-grid" : "job-list"}>
          {sortedAndFiltered.length === 0 ? (
            <p className="empty-state">
              No applications found. Add one to get started!
            </p>
          ) : (
            sortedAndFiltered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                layout={view}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}
