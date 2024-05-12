import { FC, useEffect } from 'react';
import '../styles/card.css';
import { Visit } from '../types/visit';
import { useStudents } from '../providers/StudentsProvider';
import { BarChart } from '@mui/x-charts/BarChart';
import { NumberLiteralType } from 'typescript';

type GroupVisitsProps = {
    groupId: string;
    visits: Visit[];
    visitPlan: number;
}

const chartSetting = {
    xAxis: [
        {
            label: 'Semester visit plan',
            max: 100,
        },
    ],
    xAxisWidth: 2000,
    height: 400,
};
const dataset = [
    {
        visit: 65,
        student: 'Elvira Sabirova',
    },
    {
        visit: 55,
        student: 'Mikhail Smirnov',
    },
    {
        visit: 12,
        student: 'Third student',
    },
    {
        visit: 29,
        student: 'Fifth student',
    },
    {
        visit: 1,
        student: 'Sixth student',
    },
];

const GroupVisits: FC<GroupVisitsProps> = ({ groupId, visits, visitPlan }) => {
    const { getStudentsByGroup } = useStudents();

    useEffect(() => {
        getStudentsByGroup(groupId)
            .then((students) => {
                console.log(groupId, visitPlan, visits, students);
            })
    }, [groupId]);

    const getColor = (percent: number, start: number, end: number): string => {
        const a = percent / 100,
            b = (end - start) * a,
            c = b + start;

        return 'hsl(' + c + ', 100%, 50%)';
    }

    return (
        <BarChart
            margin={{ left: 100 }}
            dataset={dataset}
            yAxis={[{ scaleType: 'band', dataKey: 'student', colorMap: { type: 'ordinal', colors: dataset.map((set) => getColor((set.visit / 0.65) , 0, 120)) } }]}
            series={[{ dataKey: 'visit', label: 'Discipline visits' }]}
            layout="horizontal"
            xAxis={[
                {
                    label: 'Semester visit plan',
                    max: 65,
                },
            ]}
            height={400}
        />
    );
};

export default GroupVisits;