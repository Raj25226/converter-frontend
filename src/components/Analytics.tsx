"use client";

import { useEffect, useState } from "react";
import { TrendingUp, FileCheck, Users, Globe } from "lucide-react";

interface AnalyticsData {
	totalVisits: number;
	totalConversions: number;
	uniqueVisitors: number;
	conversionRate: number;
}

export default function Analytics() {
	const [analytics, setAnalytics] = useState<AnalyticsData>({
		totalVisits: 0,
		totalConversions: 0,
		uniqueVisitors: 0,
		conversionRate: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Track page visit
		trackVisit();

		// Fetch analytics data
		fetchAnalytics();
	}, []);

	const trackVisit = async () => {
		try {
			await fetch("/api/analytics/track-visit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					page: window.location.pathname,
					timestamp: new Date().toISOString(),
				}),
			});
		} catch (error) {
			console.error("Error tracking visit:", error);
		}
	};

	const fetchAnalytics = async () => {
		try {
			const response = await fetch("/api/analytics/stats");
			const data = await response.json();

			if (data.status === "success") {
				setAnalytics(data.data);
			}
		} catch (error) {
			console.error("Error fetching analytics:", error);
		} finally {
			setLoading(false);
		}
	};

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + "K";
		}
		return num.toString();
	};

	const stats = [
		{
			icon: Globe,
			label: "Total Visits",
			value: formatNumber(analytics.totalVisits),
			color: "text-blue-600",
			bgColor: "bg-blue-100",
		},
		{
			icon: FileCheck,
			label: "Files Converted",
			value: formatNumber(analytics.totalConversions),
			color: "text-green-600",
			bgColor: "bg-green-100",
		},
		{
			icon: Users,
			label: "Unique Visitors",
			value: formatNumber(analytics.uniqueVisitors),
			color: "text-purple-600",
			bgColor: "bg-purple-100",
		},
		{
			icon: TrendingUp,
			label: "Conversion Rate",
			value: analytics.conversionRate.toFixed(1) + "%",
			color: "text-orange-600",
			bgColor: "bg-orange-100",
		},
	];

	if (loading) {
		return (
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="card p-6 bg-gray-100 h-24"
					></div>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
			{stats.map((stat, index) => {
				const Icon = stat.icon;
				return (
					<div
						key={index}
						className="card p-4 md:p-6 hover:shadow-xl transition-all duration-300 group"
					>
						<div className="flex items-center justify-between mb-3">
							<div
								className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
							>
								<Icon
									className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`}
								/>
							</div>
						</div>
						<div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
							{stat.value}
						</div>
						<div className="text-xs md:text-sm text-gray-600">
							{stat.label}
						</div>
					</div>
				);
			})}
		</div>
	);
}

// Helper function to track conversions (export for use in FileConverter component)
export const trackConversion = async (converterType: string) => {
	try {
		await fetch("/api/analytics/track-conversion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				converterType,
				timestamp: new Date().toISOString(),
			}),
		});
	} catch (error) {
		console.error("Error tracking conversion:", error);
	}
};