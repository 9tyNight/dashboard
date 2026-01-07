import React, { useState, useEffect, useRef } from 'react';
import {
    Search, LayoutDashboard, Users, Briefcase,
    CreditCard, Settings, MessageSquare, Link,
    CheckCircle, FileText, Calendar, Download,
    MoreVertical, ChevronDown, ChevronRight,
    ArrowUpRight, ArrowDownRight, Play,
    Edit2, Trash2, ChevronUp, User, Zap, Home,
    UserPlus, LogOut, Layers, ArrowLeft, ArrowRight
} from 'lucide-react';
import {
    LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

// --- Configuration & Data ---

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, active: true },
    { label: 'Internal User Management', icon: Users, subItems: ['Overview', 'Notifications', 'Analytics', 'Reports'] },
    { label: 'Business Management', icon: Briefcase, subItems: ['Overview', 'Notifications', 'Analytics', 'Reports'] },
    { label: 'Subscription & Billing', icon: CreditCard, subItems: ['Overview', 'Notifications', 'Analytics', 'Reports'] },
    { label: 'System config', icon: Settings, subItems: ['Overview', 'Notifications', 'Analytics', 'Reports'] },
    { label: 'Maintenance & Support', icon: FileText, subItems: ['Overview', 'Notifications', 'Analytics', 'Reports'] },
    { label: 'Communication Mgmt', icon: MessageSquare, badge: '10', subItems: ['Overview', 'Notifications', 'Analytics', 'Reports'] },
    { label: 'Marketplace & Integrations', icon: Link, subItems: ['Overview', 'Notifications', 'Analytics', 'Reports'] },
    { label: 'Manage Approvals', icon: CheckCircle, badge: '10', subItems: ['Overview', 'Notifications', 'Analytics', 'Reports'] },
    { label: 'My Tickets', icon: FileText, badge: '10', subItems: ['Overview', 'Notifications', 'Analytics', 'Reports'] },
];

const statsData = [
    { label: 'Total Active Restaurants', value: '1,600', trend: '841', isUp: true },
    { label: 'Net Revenue (MTD)', value: '1,096.30 KWD', trend: '$841', isUp: true },
    { label: 'Active Terminals', value: '1,415', trend: '841', isUp: true },
    { label: 'Active WhatsApp Users', value: '778', trend: '841', isUp: true },
    { label: 'New Signups', value: '32', trend: '3', isUp: true },
    { label: 'Suspended Businesses', value: '4', trend: '234', isUp: false },
    { label: 'Downgrades', value: '3', trend: '1', isUp: true },
    { label: 'Avg. Uptime', value: '99.96%', trend: '841', isUp: true },
    { label: 'Open Support Tickets', value: '31', status: null },
    { label: 'System Health Status', value: 'Good', status: 'Good' },
    { label: 'Avg. Response Time', value: '2h 11m', status: null },
    { label: 'Total Pending Approvals', value: '10', status: null },
];

const pieData = [
    { name: 'Standard', value: 85, color: '#84cc16' },
    { name: 'Pro', value: 230, color: '#a855f7' },
    { name: 'Enterprise', value: 190, color: '#e9d5ff' },
];

const revenueData = [
    { name: 'Jan', value: 100000 }, { name: 'Feb', value: 120000 },
    { name: 'Mar', value: 110000 }, { name: 'Apr', value: 130000 },
    { name: 'May', value: 140000 }, { name: 'Jun', value: 135000 },
    { name: 'Jul', value: 165750 }, { name: 'Aug', value: 150000 },
    { name: 'Sep', value: 170000 }, { name: 'Oct', value: 160000 },
    { name: 'Nov', value: 180000 }, { name: 'Dec', value: 190000 },
];

const healthData = [
    { value: 60 }, { value: 65 }, { value: 62 }, { value: 68 }, { value: 70 },
    { value: 72 }, { value: 75 }, { value: 73 }, { value: 78 }, { value: 80 }
];

const tableData = [
    { id: 1, title: 'Monthly Summary', tenant: 'Acme Corp', freq: 'Monthly', nextRun: '03 Sept 2025 11:30 AM', status: 'Scheduled' },
    { id: 2, title: 'Weekly Update', tenant: 'Acme Corp', freq: 'Weekly', nextRun: '04 Sept 2025 01:15 PM', status: 'Completed' },
    { id: 3, title: 'Weekly Review', tenant: 'Stark Indf', freq: 'Weekly', nextRun: '05 Sept 2025 09:45 AM', status: 'In Progress' },
    { id: 4, title: 'Daily Report', tenant: 'Pizza hut', freq: 'Daily', nextRun: '05 Sept 2025 09:45 AM', status: 'Pending' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false, subItems = [], badge }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasSub = subItems.length > 0;

    const handleClick = () => {
        if (hasSub) setIsOpen(!isOpen);
    };

    return (
        <div className="mb-1">
            <div
                onClick={handleClick}
                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer select-none transition-colors
        ${active ? 'bg-lime-50 text-lime-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    {badge && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{badge}</span>}
                    {hasSub && (isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
            </div>
            {hasSub && isOpen && (
                <div className="mt-1 ml-9 space-y-1">
                    {subItems.map((subItem, index) => (
                        <div key={index} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 cursor-pointer rounded-md hover:bg-gray-50">
                            {subItem}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, trend, isUp, status }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between h-32">
        <span className="text-xs font-semibold text-gray-500">{label}</span>
        <div className="flex items-end justify-between mt-2">
            <div className="flex flex-col">
                {status === 'Good' ? (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full w-max mt-2">● Good</span>
                ) : (
                    <span className="text-2xl font-bold text-gray-900">{value}</span>
                )}
            </div>
        </div>
        {trend && (
            <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-gray-500">Trend</span>
                {isUp ? <ArrowUpRight size={14} className="text-green-500" /> : <ArrowDownRight size={14} className="text-red-500" />}
                <span className={`text-xs font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>{trend}</span>
            </div>
        )}
    </div>
);

// --- Dropdown Menu Component ---
const ChartMenu = ({ isOpen, onClose }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="absolute right-0 top-8 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
        >
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center text-lg font-medium">Z</div>
                <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-gray-900 truncate">Zia Danka</p>
                    <p className="text-xs text-gray-500 truncate">ziadanka2003@gmail.com</p>
                </div>
            </div>
            <div className="py-1">
                <MenuItem icon={User} label="View profile" />
                <MenuItem icon={Settings} label="Settings" />
                <MenuItem icon={Zap} label="Keyboard shortcuts" />
            </div>
            <div className="border-t border-gray-100 py-1">
                <MenuItem icon={Home} label="Company profile" />
                <MenuItem icon={Users} label="Team" />
                <MenuItem icon={UserPlus} label="Invite colleagues" />
                <MenuItem icon={Layers} label="Changelog" />
            </div>
            <div className="border-t border-gray-100 py-1">
                <MenuItem icon={LogOut} label="Log out" />
            </div>
        </div>
    );
};

const MenuItem = ({ icon: Icon, label }) => (
    <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-700 group">
        <div className="flex items-center gap-2.5">
            <Icon size={16} className="text-gray-400 group-hover:text-gray-600" />
            <span className="text-sm font-medium">{label}</span>
        </div>
    </div>
);

export default function Dashboard() {
    const [activeMenu, setActiveMenu] = useState(null);

    // Search States
    const [sidebarSearch, setSidebarSearch] = useState('');
    const [tableSearch, setTableSearch] = useState('');

    const toggleMenu = (id) => {
        setActiveMenu(activeMenu === id ? null : id);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 overflow-y-auto custom-scrollbar">
                <div className="p-6 sticky top-0 bg-white z-10">
                    <h1 className="text-xl font-black tracking-widest text-gray-900 uppercase">Ordenaire</h1>
                </div>

                <div className="px-4 pb-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={sidebarSearch}
                            onChange={(e) => setSidebarSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <nav className="flex-1 px-4 pb-6">
                    {navItems.map((item, index) => (
                        <SidebarItem key={index} {...item} />
                    ))}

                    <div className="mt-8 border-t border-gray-100 pt-4">
                        <SidebarItem icon={Settings} label="Settings" />
                    </div>
                </nav>

                {/* Sidebar Footer User Profile */}
                <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                            Z
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">Zia Danka</p>
                            <p className="text-xs text-gray-500 truncate" title="ziadanka2003@gmail.com">ziadanka2003@gmail.com</p>
                        </div>
                        <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <LayoutDashboard size={14} /> <span>/</span> <span>Dashboard</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Ordenaire Dashboard</h2>

                    <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                        <div className="flex gap-6">
                            <button className="text-lime-600 border-b-2 border-lime-600 pb-2 text-sm font-medium">Dashboard</button>
                        </div>
                        <div className="flex gap-3 mb-2">
                            <button className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-700 shadow-sm">
                                <Calendar size={16} /> Date-range
                            </button>
                            <button className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-3 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                <Download size={16} /> Reports page
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {statsData.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Charts Section 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Plan Distribution */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm lg:col-span-1 relative">
                        <div className="flex justify-between items-center mb-4 relative z-20">
                            <h3 className="text-sm font-bold text-gray-900">Plan Distribution</h3>
                            <div className="relative">
                                <button
                                    onClick={() => toggleMenu('plan')}
                                    className={`p-1 rounded-full hover:bg-gray-100 ${activeMenu === 'plan' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                                >
                                    <MoreVertical size={18} />
                                </button>
                                <ChartMenu isOpen={activeMenu === 'plan'} onClose={() => setActiveMenu(null)} />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-4">March 2020</div>

                        <div className="h-48 z-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={0}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(value, entry) => <span className="text-xs text-gray-600 ml-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm lg:col-span-2 relative">
                        <div className="flex justify-between items-start mb-4 relative z-20">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500">Revenue</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-2xl font-bold text-gray-900">165,750.23 KWD</span>
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <ArrowUpRight size={12} /> 2.4%
                                    </span>
                                </div>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => toggleMenu('revenue')}
                                    className={`p-1 rounded-full hover:bg-gray-100 ${activeMenu === 'revenue' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                                >
                                    <MoreVertical size={18} />
                                </button>
                                <ChartMenu isOpen={activeMenu === 'revenue'} onClose={() => setActiveMenu(null)} />
                            </div>
                        </div>

                        <div className="h-48 z-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        labelStyle={{ color: '#666' }}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#84cc16" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Charts Section 2 (Health & Tickets) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* System Health */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-gray-900">System Health</h3>
                            <div className="flex gap-2">
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">45 ms</span>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">● Good</span>
                            </div>
                        </div>
                        <div className="h-24 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={healthData}>
                                    <Line type="monotone" dataKey="value" stroke="#84cc16" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-right text-xs text-gray-400 mt-2">last 24 Hours</div>
                    </div>

                    {/* Support Tickets */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900">Support Tickets</h3>
                        <p className="text-xs text-gray-500 mb-4">Total Open: 31</p>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium text-gray-700">High</span>
                                    <span className="text-gray-500">9 (30%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium text-gray-700">Medium</span>
                                    <span className="text-gray-500">12 (40%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium text-gray-700">Low</span>
                                    <span className="text-gray-500">9 (30%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-lime-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Scheduled Reports Table */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="font-bold text-gray-900">Upcoming Scheduled Reports</h3>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search @Noah"
                                    value={tableSearch}
                                    onChange={(e) => setTableSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent w-64"
                                />
                            </div>
                            <button className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50">
                                <Calendar size={16} /> Date
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Report Title</th>
                                    <th className="px-6 py-3">Tenant</th>
                                    <th className="px-6 py-3">Frequency</th>
                                    <th className="px-6 py-3">Next Run <ArrowDownRight size={12} className="inline ml-1" /></th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tableData.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{row.title}</td>
                                        <td className="px-6 py-4 text-gray-600">{row.tenant}</td>
                                        <td className="px-6 py-4 text-gray-600">{row.freq}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div>{row.nextRun.split(' ')[0] + ' ' + row.nextRun.split(' ')[1] + ' ' + row.nextRun.split(' ')[2]}</div>
                                            <div className="text-xs text-gray-400">{row.nextRun.split(' ').slice(3).join(' ')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1.5
                                ${row.status === 'Scheduled' ? 'bg-pink-50 text-pink-700 border-pink-200' : ''}
                                ${row.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                ${row.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                ${row.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                             `}>
                                                <span className={`w-1.5 h-1.5 rounded-full 
                                  ${row.status === 'Scheduled' ? 'bg-pink-500' : ''}
                                  ${row.status === 'Completed' ? 'bg-green-500' : ''}
                                  ${row.status === 'In Progress' ? 'bg-blue-500' : ''}
                                  ${row.status === 'Pending' ? 'bg-orange-500' : ''}
                                `}></span>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <button className="flex items-center gap-2 text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50">
                                                <Play size={14} /> Run Now
                                            </button>
                                            <button className="p-2 text-gray-400 border border-gray-300 rounded-lg hover:text-gray-600 hover:bg-gray-50">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 border border-gray-300 rounded-lg hover:text-red-500 hover:bg-gray-50">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                        <button className="border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-500">
                            <ArrowLeft size={16} />
                        </button>

                        <div className="flex gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-900 font-medium">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600">3</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600">4</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600">5</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600">6</button>
                        </div>

                        <button className="border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-500">
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}