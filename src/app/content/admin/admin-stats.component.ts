import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LightDark, MagmaInput, MagmaInputSelect } from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { getWeek } from 'date-fns';
import { EChartsCoreOption } from 'echarts';
import { LineChart, ThemeRiverChart } from 'echarts/charts';
import {
    GridComponent,
    LegendComponent,
    TimelineComponent,
    TitleComponent,
    TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import 'echarts/theme/dark-blue.js';
import 'echarts/theme/vintage.js';
import { Select2Data } from 'ng-select2-component';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import {
    PeriodStatsResult,
    StatsResultClassementDate,
    StatsResultClassementMonth,
    StatsResultClassementWeek,
    StatsResultUserDate,
    StatsResultUserMonth,
    StatsResultUserWeek,
} from 'src/app/interface/interface';
import { APIStatsService } from 'src/app/services/api.stats.service';

echarts.use([
    LineChart,
    TimelineComponent,
    TitleComponent,
    GridComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    ThemeRiverChart,
]);

@Component({
    selector: 'admin-stats',
    templateUrl: './admin-stats.component.html',
    styleUrls: ['./admin-stats.component.scss'],
    imports: [NgxEchartsDirective, TranslocoPipe, FormsModule, MagmaInput, MagmaInputSelect],
    providers: [provideEchartsCore({ echarts })],
})
export class AdminStatsComponent {
    stats = inject(APIStatsService);
    lightDark = inject(LightDark);
    translate = inject(TranslocoService);

    chartOptionUser?: EChartsCoreOption;
    chartOptionClassement?: EChartsCoreOption;

    period: Select2Data = [
        { value: 'day', label: 'day' },
        { value: 'week', label: 'week' },
        { value: 'month', label: 'month' },
    ];
    selectedPeriod: PeriodStatsResult = 'day';

    constructor() {
        this.init();
    }

    init() {
        this.getUserStats();
        this.getClassementStats();
    }

    update(period: PeriodStatsResult) {
        this.selectedPeriod = period;
        this.init();
    }

    getUserStats() {
        this.stats
            .getStats<
                StatsResultUserDate | StatsResultUserWeek | StatsResultUserMonth
            >({ target: 'user', period: this.selectedPeriod })
            .then(data => {
                let stats = data.stats;
                let dataX: any;
                const defaultData = {
                    count: 0,
                    validated: 0,
                    deleted: 0,
                };

                if (this.selectedPeriod === 'month') {
                    stats = this.completeMissingMonths<StatsResultUserMonth>(
                        stats as StatsResultUserMonth[],
                        defaultData,
                    );
                    dataX = (stats as StatsResultUserMonth[]).map(e => `${e.year}-${e.month}`);
                } else if (this.selectedPeriod === 'week') {
                    stats = this.completeMissingWeeks<StatsResultUserWeek>(stats as StatsResultUserWeek[], defaultData);
                    dataX = (stats as StatsResultUserWeek[]).map(e => `${e.year}-${e.week}`);
                } else {
                    stats = this.completeMissingDates<StatsResultUserDate>(stats as StatsResultUserDate[], defaultData);
                    dataX = (stats as StatsResultUserDate[]).map(e => e.date);
                }

                const totalLg = this.translate.translate('admin.user.total');
                const deletedLg = this.translate.translate('admin.user.deleted');
                const validatedLg = this.translate.translate('admin.user.validated');

                this.chartOptionUser = {
                    darkMode: this.lightDark.currentTheme() === 'dark',
                    title: {
                        text: this.translate.translate('admin.user.' + this.selectedPeriod),
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: [totalLg, deletedLg, validatedLg],
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: dataX,
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [
                        {
                            name: totalLg,
                            type: 'line',
                            stack: totalLg,
                            data: stats.map(e => e.count),
                        },
                        {
                            name: deletedLg,
                            type: 'line',
                            stack: deletedLg,
                            data: stats.map(e => e.deleted),
                        },
                        {
                            name: validatedLg,
                            type: 'line',
                            stack: validatedLg,
                            data: stats.map(e => e.validated),
                        },
                    ],
                };
            });
    }

    getClassementStats() {
        this.stats
            .getStats<
                StatsResultClassementDate | StatsResultClassementWeek | StatsResultClassementMonth
            >({ target: 'classement', period: this.selectedPeriod })
            .then(data => {
                let stats = data.stats;
                let dataX: any;
                const defaultData = { count: 0, deleted: 0, hide: 0, parent: 0 };

                if (this.selectedPeriod === 'month') {
                    stats = this.completeMissingMonths<StatsResultClassementMonth>(
                        stats as StatsResultClassementMonth[],
                        defaultData,
                    );
                    dataX = (stats as StatsResultClassementMonth[]).map(e => `${e.year}-${e.month}`);
                } else if (this.selectedPeriod === 'week') {
                    stats = this.completeMissingWeeks<StatsResultClassementWeek>(
                        stats as StatsResultClassementWeek[],
                        defaultData,
                    );
                    dataX = (stats as StatsResultClassementWeek[]).map(e => `${e.year}-${e.week}`);
                } else {
                    stats = this.completeMissingDates<StatsResultClassementDate>(
                        stats as StatsResultClassementDate[],
                        defaultData,
                    );
                    dataX = (stats as StatsResultClassementDate[]).map(e => e.date);
                }

                const totalLg = this.translate.translate('admin.classement.total');
                const deletedLg = this.translate.translate('admin.classement.deleted');
                const hideLg = this.translate.translate('admin.classement.hide');
                const parentLg = this.translate.translate('admin.classement.parent');

                this.chartOptionClassement = {
                    darkMode: this.lightDark.currentTheme() === 'dark',
                    title: {
                        text: this.translate.translate('admin.classement.' + this.selectedPeriod),
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: [totalLg, deletedLg, hideLg, parentLg],
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: dataX,
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [
                        {
                            name: totalLg,
                            type: 'line',
                            stack: totalLg,
                            data: stats.map(e => e.count),
                        },
                        {
                            name: deletedLg,
                            type: 'line',
                            stack: deletedLg,
                            data: stats.map(e => e.deleted),
                        },
                        {
                            name: hideLg,
                            type: 'line',
                            stack: hideLg,
                            data: stats.map(e => e.hide),
                        },
                        {
                            name: parentLg,
                            type: 'line',
                            stack: parentLg,
                            data: stats.map(e => e.parent),
                        },
                    ],
                };
            });
    }

    private completeMissingDates<T extends StatsResultUserDate | StatsResultClassementDate>(
        data: T[],
        defaultData: any,
    ) {
        if (data.length === 0) {
            return data;
        }

        const result: T[] = [];

        const date = new Date();
        date.setFullYear(new Date().getFullYear() - 1);
        let currentDate = date;
        let nextIndex = 0;
        const endDate = new Date();

        while (currentDate <= endDate) {
            const [currentDateStr] = currentDate.toISOString().split('T');

            if (nextIndex < data.length && currentDateStr === data[nextIndex].date) {
                result.push(data[nextIndex++]);
            } else {
                result.push({
                    date: currentDateStr,
                    ...defaultData,
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }
        return result;
    }

    private completeMissingWeeks<T extends StatsResultUserWeek | StatsResultClassementWeek>(
        data: T[],
        defaultData: any,
    ): T[] {
        if (data.length === 0) return data;

        const result: T[] = [];
        const start = new Date();
        start.setFullYear(start.getFullYear() - 1);
        let currentYear = start.getFullYear();
        let currentWeek = getWeek(start, { weekStartsOn: 1, firstWeekContainsDate: 4 }); // ISO week
        let nextIndex = 0;

        const yearLimit = new Date().getFullYear();
        const weekLimit = getWeek(new Date(), { weekStartsOn: 1, firstWeekContainsDate: 4 }); // ISO week

        while (currentYear < yearLimit || (currentYear === yearLimit && currentWeek <= weekLimit)) {
            if (
                nextIndex < data.length &&
                currentYear === data[nextIndex].year &&
                currentWeek === data[nextIndex].week
            ) {
                result.push(data[nextIndex++]);
            } else {
                result.push({
                    year: currentYear,
                    week: currentWeek,
                    ...defaultData,
                });
            }

            if (currentWeek === 52) {
                // Assuming 52 weeks in a year
                currentWeek = 1;
                currentYear++;
            } else {
                currentWeek++;
            }
        }

        return result;
    }

    private completeMissingMonths<T extends StatsResultUserMonth | StatsResultClassementMonth>(
        data: T[],
        defaultData: any,
    ): T[] {
        if (data.length === 0) return data;

        const result: T[] = [];
        let currentYear = new Date().getFullYear() - 1;
        let currentMonth = new Date().getMonth() + 1;
        let nextIndex = 0;

        const yearLimit = new Date().getFullYear();
        const monthLimit = new Date().getMonth() + 1;

        while (currentYear < yearLimit || (currentYear === yearLimit && currentMonth <= monthLimit)) {
            if (
                nextIndex < data.length &&
                currentYear === data[nextIndex].year &&
                currentMonth === data[nextIndex].month
            ) {
                result.push(data[nextIndex++]);
            } else {
                result.push({
                    year: currentYear,
                    month: currentMonth,
                    ...defaultData,
                });
            }

            if (currentMonth === 12) {
                currentMonth = 1;
                currentYear++;
            } else {
                currentMonth++;
            }
        }

        return result;
    }
}
