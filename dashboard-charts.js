document.addEventListener('DOMContentLoaded', function () {
    const commonOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    // Citizen Dashboard Charts
    const citizenReportsCtx = document.getElementById('citizenReportsChart');
    if (citizenReportsCtx) {
        new Chart(citizenReportsCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'My Reports',
                    data: [2, 5, 3, 8, 4, 6, 9, 7, 4, 2, 5, 3],
                    backgroundColor: 'rgba(14, 165, 233, 0.7)',
                    borderRadius: 4,
                    barThickness: 12
                }]
            },
            options: commonOptions
        });
    }

    const citizenStatusCtx = document.getElementById('citizenStatusChart');
    if (citizenStatusCtx) {
        new Chart(citizenStatusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Resolved', 'Investigating', 'Pending'],
                datasets: [{
                    data: [12, 5, 3],
                    backgroundColor: [
                        '#10b981', // Emerald
                        '#f59e0b', // Amber
                        '#6b7280'  // Gray
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            font: { family: "'Inter', sans-serif" }
                        }
                    }
                }
            }
        });
    }

    // Volunteer Dashboard Charts
    const volunteerTasksCtx = document.getElementById('volunteerTasksChart');
    if (volunteerTasksCtx) {
        new Chart(volunteerTasksCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
                datasets: [{
                    label: 'Tasks Completed',
                    data: [4, 7, 5, 12, 8, 15, 10, 18],
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: commonOptions
        });
    }

    // Admin Dashboard Charts
    const adminReportsCtx = document.getElementById('adminReportsChart');
    if (adminReportsCtx) {
        new Chart(adminReportsCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'New Reports',
                    data: [12, 19, 15, 25, 22, 10, 8],
                    backgroundColor: '#0ea5e9',
                    borderRadius: 4
                }, {
                    label: 'Resolved',
                    data: [10, 15, 12, 20, 18, 8, 5],
                    backgroundColor: '#10b981',
                    borderRadius: 4
                }, {
                    label: 'Pending',
                    data: [5, 4, 6, 8, 10, 4, 3],
                    backgroundColor: '#f59e0b',
                    borderRadius: 4
                }]
            },
            options: commonOptions
        });
    }

    const adminIssuesCtx = document.getElementById('adminIssuesChart');
    if (adminIssuesCtx) {
        new Chart(adminIssuesCtx, {
            type: 'pie',
            data: {
                labels: ['Leakage', 'Contamination', 'Shortage', 'Quality', 'Other'],
                datasets: [{
                    data: [35, 20, 15, 25, 5],
                    backgroundColor: [
                        '#3b82f6', // Blue
                        '#ef4444', // Red
                        '#f59e0b', // Amber
                        '#10b981', // Emerald
                        '#6b7280'  // Gray
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            font: { family: "'Inter', sans-serif" }
                        }
                    }
                }
            }
        });
    }

    // New Citizen Charts
    const citizenQualityCtx = document.getElementById('citizenQualityChart');
    if (citizenQualityCtx) {
        new Chart(citizenQualityCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'pH Level',
                    data: [7.1, 7.2, 7.0, 6.9, 7.1, 7.2],
                    borderColor: '#0ea5e9',
                    tension: 0.4
                }, {
                    label: 'Turbidity',
                    data: [2.5, 2.8, 3.0, 2.2, 2.1, 1.9],
                    borderColor: '#f59e0b',
                    tension: 0.4
                }]
            },
            options: commonOptions
        });
    }

    const citizenActivityCtx = document.getElementById('citizenActivityChart');
    if (citizenActivityCtx) {
        new Chart(citizenActivityCtx, {
            type: 'radar',
            data: {
                labels: ['Reports', 'Verifications', 'Cleanups', 'Comments', 'Shares'],
                datasets: [{
                    label: 'My Activity',
                    data: [65, 59, 90, 81, 56],
                    fill: true,
                    backgroundColor: 'rgba(14, 165, 233, 0.2)',
                    borderColor: '#0ea5e9',
                    pointBackgroundColor: '#0ea5e9'
                }]
            },
            options: { ...commonOptions, scales: { r: { angleLines: { display: false }, suggestedMin: 0, suggestedMax: 100 } } }
        });
    }

    // New Volunteer Charts
    const volunteerDistanceChartCtx = document.getElementById('volunteerDistanceChart');
    if (volunteerDistanceChartCtx) {
        new Chart(volunteerDistanceChartCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Distance (km)',
                    data: [5, 8, 12, 7, 4, 15, 3],
                    backgroundColor: '#10b981',
                    borderRadius: 4
                }]
            },
            options: commonOptions
        });
    }

    const volunteerEquipmentCtx = document.getElementById('volunteerEquipmentChart');
    if (volunteerEquipmentCtx) {
        new Chart(volunteerEquipmentCtx, {
            type: 'polarArea',
            data: {
                labels: ['pH Kit', 'Gloves', 'Sample Bottles', 'Safety Vest', 'Map'],
                datasets: [{
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: [
                        '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
                    ]
                }]
            },
            options: { ...commonOptions, scales: {} }
        });
    }

    // New Admin Charts
    const adminBudgetCtx = document.getElementById('adminBudgetChart');
    if (adminBudgetCtx) {
        new Chart(adminBudgetCtx, {
            type: 'doughnut',
            data: {
                labels: ['Equipment', 'Personnel', 'Logistics', 'Marketing', 'Reserve'],
                datasets: [{
                    data: [35, 25, 20, 10, 10],
                    backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#dc2626', '#64748b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    }

    const adminResponseCtx = document.getElementById('adminResponseChart');
    if (adminResponseCtx) {
        new Chart(adminResponseCtx, {
            type: 'line',
            data: {
                labels: ['0h', '2h', '4h', '6h', '8h', '10h', '12h', '24h+'],
                datasets: [{
                    label: 'Response Volume',
                    data: [12, 19, 3, 5, 2, 3, 10, 5],
                    fill: true,
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderColor: '#f59e0b',
                    tension: 0.4
                }]
            },
            options: commonOptions
        });
    }

    // New Community Growth Chart (Admin)
    const userGrowthCtx = document.getElementById('userGrowthChart');
    if (userGrowthCtx) {
        new Chart(userGrowthCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Members',
                    data: [400, 800, 600, 1200, 1500, 1800],
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: commonOptions
        });
    }

    // New Volunteer Impact Chart
    const volunteerImpactCtx = document.getElementById('volunteerImpactChart');
    if (volunteerImpactCtx) {
        new Chart(volunteerImpactCtx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Reports Verified',
                    data: [5, 8, 12, 7],
                    backgroundColor: '#10b981',
                    borderRadius: 4
                }, {
                    label: 'Cleanups',
                    data: [2, 1, 3, 2],
                    backgroundColor: '#a855f7',
                    borderRadius: 4
                }]
            },
            options: commonOptions
        });
    }
});
