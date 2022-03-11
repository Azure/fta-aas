import React from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend
} from "recharts";
import { IChecklistDocument } from "../../model/IChecklistDocument";

interface Ft3asRadarChartProps {
    checklistDoc: IChecklistDocument;
}
export default function IFt3asRadarChart(props: Ft3asRadarChartProps) {

    const defaultStatus = props.checklistDoc.status[0].name;
    const data = props.checklistDoc.categories.map(c => {
        const categoryItems = props.checklistDoc.items.filter(i => i.category === c.name);
        const notVerified = categoryItems.filter(i => i.status === undefined || i.status.name === defaultStatus).length;
        const verified = categoryItems.length - notVerified;
        const fullMark = Math.max(notVerified, verified);
        return {
            category: c.name,
            notVerified: notVerified,
            verified: verified,
            fullMark: fullMark
        }
    });

    return (
        <RadarChart
            cx={300}
            cy={250}
            outerRadius={150}
            width={500}
            height={500}
            data={data}        >
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis />
            <Radar
                name="Verified"
                dataKey="verified"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
            />
            <Radar name="NotVerified" dataKey="notVerified" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend />
        </RadarChart>);

}