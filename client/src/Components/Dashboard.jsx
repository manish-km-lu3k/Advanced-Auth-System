import { useState, useEffect } from 'react';

export default function SecurityDashboard() {
    const [stats, setStats] = useState({});
    const [recentAttempts, setRecentAttempts] = useState([]);

    useEffect(() => {
        fetchSecurityData();
        const interval = setInterval(fetchSecurityData, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchSecurityData = async () => {
        const token = localStorage.getItem('token');

        const statsRes = await fetch('http://localhost:5000/api/admin/security-stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        setStats(statsData);

        const attemptsRes = await fetch('http://localhost:5000/api/admin/recent-attempts', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const attemptsData = await attemptsRes.json();
        setRecentAttempts(attemptsData);
    };

    return (
        <div className="security-dashboard">
            <h1>Security Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Logins (24h)</h3>
                    <div className="stat-value">{stats.totalLogins || 0}</div>
                </div>

                <div className="stat-card">
                    <h3>Failed Attempts (24h)</h3>
                    <div className="stat-value danger">{stats.failedAttempts || 0}</div>
                </div>

                <div className="stat-card">
                    <h3>Suspicious Activity</h3>
                    <div className="stat-value warning">{stats.suspiciousActivity || 0}</div>
                </div>

                <div className="stat-card">
                    <h3>2FA Enabled Users</h3>
                    <div className="stat-value">{stats.twoFactorUsers || 0}</div>
                </div>
            </div>

            <div className="recent-attempts">
                <h2>Recent Login Attempts</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>User</th>
                            <th>Status</th>
                            <th>IP</th>
                            <th>Location</th>
                            <th>Device</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentAttempts.map((attempt, i) => (
                            <tr key={i} className={attempt.success ? 'success' : 'failed'}>
                                <td>{new Date(attempt.timestamp).toLocaleString()}</td>
                                <td>{attempt.user?.email}</td>
                                <td>{attempt.success ? '✓ Success' : '✗ Failed'}</td>
                                <td>{attempt.ip}</td>
                                <td>{attempt.location?.city}, {attempt.location?.country}</td>
                                <td>{attempt.device?.browser} on {attempt.device?.os}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}