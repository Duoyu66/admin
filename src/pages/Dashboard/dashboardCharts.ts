import type { NameValue } from '@/api/dashboard';
import { appColors } from '@/config/theme';
import type { ThemePalette } from '@/config/theme-presets';

const CHART_SERIES = (p: ThemePalette) => [
  p.primary,
  appColors.info,
  appColors.success,
  appColors.warning,
  p.primaryActive,
  '#9254de',
];

export function hasNumericChartData(list?: NameValue[]) {
  return list?.some((d) => d.value > 0 && !String(d.name).includes('暂无')) ?? false;
}

function baseAxis(p: ThemePalette) {
  return {
    labelFill: p.textSecondary,
    labelFontSize: 12,
    lineStroke: p.border,
    gridStroke: p.borderSecondary,
    gridLineDash: [4, 4] as [number, number],
  };
}

export function buildLineChartConfig(data: NameValue[], p: ThemePalette) {
  return {
    data,
    xField: 'name',
    yField: 'value',
    height: 300,
    smooth: true,
    shapeField: 'smooth',
    color: p.primary,
    point: {
      size: 3,
      shape: 'circle',
      style: { fill: p.bgContainer, stroke: p.primary, lineWidth: 2 },
    },
    area: {
      style: {
        fill: `linear-gradient(180deg, color-mix(in srgb, ${p.primary} 28%, transparent) 0%, color-mix(in srgb, ${p.primary} 2%, transparent) 100%)`,
      },
    },
    axis: {
      x: { title: false, ...baseAxis(p), tick: false },
      y: {
        title: false,
        ...baseAxis(p),
        grid: true,
        tickFilter: (_: unknown, i: number) => i % 1 === 0,
      },
    },
    scale: {
      y: { nice: true, tickCount: 5 },
    },
    tooltip: {
      title: (d: { name: string }) => d.name,
    },
    animation: { appear: { animation: 'wave-in', duration: 800 } },
  };
}

export function buildPieChartConfig(data: NameValue[], p: ThemePalette) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return {
    data,
    angleField: 'value',
    colorField: 'name',
    height: 300,
    radius: 0.9,
    innerRadius: 0.68,
    color: [appColors.success, p.textTertiary],
    legend: {
      color: {
        position: 'bottom',
        layout: { justifyContent: 'center' },
        itemLabelFill: p.textSecondary,
      },
    },
    label: false,
    statistic: {
      title: {
        content: '用户总数',
        style: { fontSize: 13, fill: p.textSecondary },
      },
      content: {
        content: String(total),
        style: { fontSize: 28, fontWeight: 600, fill: p.text },
      },
    },
    tooltip: {
      title: (d: { name: string }) => d.name,
    },
    animation: { appear: { animation: 'fade-in', duration: 600 } },
  };
}

export function buildColumnChartConfig(data: NameValue[], p: ThemePalette, colorIndex = 0) {
  const color = CHART_SERIES(p)[colorIndex];
  return {
    data,
    xField: 'name',
    yField: 'value',
    height: 280,
    color,
    style: {
      radiusTopLeft: 8,
      radiusTopRight: 8,
      fill: `linear-gradient(180deg, ${color} 0%, color-mix(in srgb, ${color} 55%, ${p.bgContainer}) 100%)`,
    },
    label: {
      position: 'top' as const,
      style: { fill: p.textSecondary, fontSize: 12 },
    },
    axis: {
      x: { title: false, ...baseAxis(p), tick: false },
      y: { title: false, ...baseAxis(p), grid: true },
    },
    scale: {
      y: { nice: true },
    },
    tooltip: {
      title: (d: { name: string }) => d.name,
    },
    animation: { appear: { animation: 'grow-in-y', duration: 700 } },
  };
}
