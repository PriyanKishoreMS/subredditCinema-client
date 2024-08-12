import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Cell, Label, Pie, PieChart, Tooltip } from "recharts";

interface PieChartProps {
	data: {
		option_id: number;
		count: number;
		text: string;
	}[];
	questionText: string;
	responseCount: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const QuestionPieChart: React.FC<PieChartProps> = ({
	data,
	responseCount,
}) => {
	return (
		<Card className='w-full justify-between flex md:flex-row flex-col items-center'>
			<CardContent>
				<div>
					{data.map((option, index) => (
						<div
							key={option.option_id}
							className='flex items-center space-x-4 justify-between'
						>
							<div className='flex items-center'>
								<div
									className='w-4 h-4 rounded-full'
									style={{
										backgroundColor: COLORS[index % COLORS.length],
									}}
								/>
								<p className='ml-2'>{option.text}</p>
							</div>
							<p>{option.count}</p>
						</div>
					))}
				</div>
			</CardContent>
			<CardContent>
				<PieChart width={200} height={200}>
					<Pie
						data={data}
						cx={100}
						cy={100}
						innerRadius={50}
						paddingAngle={0}
						strokeWidth={0}
						dataKey='count'
						nameKey='text'
						labelLine={false}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
						<Label
							content={({ viewBox }) => {
								if (viewBox && "cx" in viewBox && "cy" in viewBox) {
									return (
										<text
											x={viewBox.cx}
											y={viewBox.cy}
											textAnchor='middle'
											dominantBaseline='middle'
										>
											<tspan
												x={viewBox.cx}
												y={viewBox.cy}
												className='fill-foreground text-3xl font-bold'
											>
												{responseCount}
											</tspan>
											<tspan
												x={viewBox.cx}
												y={(viewBox.cy || 0) + 24}
												className='fill-muted-foreground text-sm'
											>
												Responses
											</tspan>
										</text>
									);
								}
							}}
						/>
					</Pie>
					<Tooltip />
				</PieChart>
			</CardContent>
		</Card>
	);
};
