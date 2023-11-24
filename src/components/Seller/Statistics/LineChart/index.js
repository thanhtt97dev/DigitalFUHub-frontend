import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card, DatePicker, Select, Space, Spin } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { ORDER_COMPLAINT, ORDER_CONFIRMED, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_REFUNDED, ORDER_SELLER_VIOLATES, ORDER_WAIT_CONFIRMATION, RESPONSE_CODE_SUCCESS, STATISTIC_BY_MONTH, STATISTIC_BY_YEAR } from '../../../../constants';
import { getStatisticSales } from '~/api/statistic';
import dayjs from 'dayjs';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: '',
        },
    },
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
        },
        y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
export function LineChart() {
    const [typeSearch, setTypeSearch] = useState(STATISTIC_BY_YEAR);
    const [dateSelected, setDateSelected] = useState(dayjs())
    const [typeOrders, setTypeOrders] = useState(ORDER_CONFIRMED)
    const [dataStatistic, setDataStatistic] = useState([])
    const [loading, setLoading] = useState(false);
    const labelsChartRef = useRef([]);
    const dataChart = useMemo(() => {
        if (typeSearch === STATISTIC_BY_MONTH) {
            let dayOfMonth = [];
            for (let i = 1; i <= dataStatistic.length; i++) {
                dayOfMonth.push(`${i}/${dateSelected.month() + 1}`);
            }
            labelsChartRef.current = dayOfMonth;
        } else {
            labelsChartRef.current = labels;
        }
        return {
            labels: labelsChartRef.current,
            datasets: [
                {
                    label: 'Doanh thu (bao gồm phí dịch vụ)',
                    data: dataStatistic.map((value, index) => value.revenue),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Tổng số đơn hàng',
                    data: dataStatistic.map((value, index) => value.totalOrders),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        }
    }, [typeSearch, dateSelected, dataStatistic])
    useEffect(() => {
        const data = typeSearch === STATISTIC_BY_YEAR
            ?
            {
                month: 0,
                year: dateSelected.year(),
                typeOrders
            }
            :
            {
                month: dateSelected.month() + 1,
                year: dateSelected.year(),
                typeOrders
            }
        setLoading(true);
        getStatisticSales(data)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    const { dataStatistics } = res.data.result;
                    console.log(dataStatistics);
                    setDataStatistic(dataStatistics)
                } else {
                    setDataStatistic([])
                }
            })
            .catch(err => {
                setDataStatistic([])
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            })
    }, [typeSearch, dateSelected, typeOrders])
    const handleSelectTypeSearch = (value) => {
        setTypeSearch(value);
        setDateSelected(dayjs())
    }
    const handleSelectTypeOrders = (value) => {
        setTypeOrders(value);
        setDateSelected(dayjs())
    }
    const handleSelectDate = (value, dateString) => {
        setDateSelected(value ? value : dayjs())
    }

    return (<Card>
        <Spin spinning={loading}>
            <Space >
                <Space wrap={true}>
                    <div style={{ marginInlineEnd: '1em' }}>Khung thời gian</div>
                    <Select style={{ width: '8em' }} onChange={handleSelectTypeSearch} value={typeSearch}>
                        <Select.Option value={STATISTIC_BY_MONTH}>Theo tháng</Select.Option>
                        <Select.Option value={STATISTIC_BY_YEAR}>Theo năm</Select.Option>
                    </Select>
                    {typeSearch === STATISTIC_BY_MONTH ?
                        <DatePicker onChange={handleSelectDate} locale={locale} value={dateSelected} picker="month" />
                        :
                        <DatePicker onChange={handleSelectDate} locale={locale} value={dateSelected} picker="year" />
                    }
                    <Space style={{ marginInlineStart: '5em' }}>
                        <div style={{ marginInlineEnd: '1em' }}>Loại đơn hàng</div>
                        <Select style={{ width: '12em' }} onChange={handleSelectTypeOrders} value={typeOrders}>
                            <Select.Option value={ORDER_WAIT_CONFIRMATION}>Chờ xác nhận</Select.Option>
                            <Select.Option value={ORDER_CONFIRMED}>Đã xác nhận</Select.Option>
                            <Select.Option value={ORDER_COMPLAINT}>Khiếu nại</Select.Option>
                            <Select.Option value={ORDER_REJECT_COMPLAINT}>Từ chối khiếu nại</Select.Option>
                            <Select.Option value={ORDER_DISPUTE}>Tranh chấp</Select.Option>
                            <Select.Option value={ORDER_SELLER_REFUNDED}>Hoàn trả tiền</Select.Option>
                            <Select.Option value={ORDER_SELLER_VIOLATES}>Người bán vi phạm</Select.Option>
                        </Select>
                    </Space>
                </Space>
            </Space>
            <Line options={options} data={dataChart} />
        </Spin>
    </Card >);
}