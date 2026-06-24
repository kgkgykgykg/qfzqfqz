import { useState, useMemo } from 'react';
import { calcExamples } from '../data/examples';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
);

interface CalculatorField {
  id: string;
  label: string;
  unit: string;
}

interface CalculatorResult {
  label: string;
  value: string;
  highlight?: boolean;
}

interface CalculatorDef {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  fields: CalculatorField[];
  calculate: (values: Record<string, number>) => CalculatorResult[];
}

interface Props {
  calculator: CalculatorDef;
  onBack: () => void;
  dark: boolean;
}

function ChartCard({ title, children, dark }: { title: string; children: React.ReactNode; dark: boolean }) {
  return (
    <div className={`${dark ? 'card' : 'card-light'} p-4 rounded-xl h-full`}>
      <p className={`text-xs font-medium mb-2 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>{title}</p>
      <div className="h-full">{children}</div>
    </div>
  );
}

export default function CalculatorPanel({ calculator, onBack, dark }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<CalculatorResult[]>([]);
  const [calculated, setCalculated] = useState(false);

  const examples = calcExamples[calculator.id] || [];

  const handleChange = (id: string, value: string) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const calculate = (customValues?: Record<string, string>) => {
    const vals = customValues || values;
    const numericValues: Record<string, number> = {};
    calculator.fields.forEach(f => {
      numericValues[f.id] = parseFloat(vals[f.id] || '0') || 0;
    });
    const res = calculator.calculate(numericValues);
    setResults(res);
    setCalculated(true);
  };

  const parsedInputs = useMemo(() => {
    const res: Record<string, number> = {};
    calculator.fields.forEach(f => {
      res[f.id] = parseFloat(values[f.id] || '0') || 0;
    });
    return res;
  }, [values, calculator]);

  const textColor = dark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(71, 85, 105, 0.9)';
  const gridColor = dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  const customCharts = useMemo(() => {
    const id = calculator.id;
    const v = parsedInputs;

    // Custom data construction for each calculator type
    if (id === 'profit-margin') {
      const sp = v.sellingPrice || 100;
      const pc = v.productCost || 30;
      const sc = v.shippingCost || 10;
      const ac = v.adsCost || 20;
      const oc = v.otherCosts || 5;
      const tc = pc + sc + ac + oc;
      const profit = sp - tc;
      
      const sensitivityLabels = ['-20% Price', '-10% Price', 'Target Price', '+10% Price', '+20% Price'];
      const sensitivityData = [
        (sp * 0.8) - tc,
        (sp * 0.9) - tc,
        profit,
        (sp * 1.1) - tc,
        (sp * 1.2) - tc
      ];

      return {
        chart1: {
          type: 'doughnut' as const,
          title: 'Unit Cost & Net Profit Share Distribution',
          data: {
            labels: ['Product Cost', 'Shipping Fees', 'Ad Spend / Sale', 'Operating Cost', 'Net Unit Profit'],
            datasets: [{
              data: [pc, sc, ac, oc, profit > 0 ? profit : 0],
              backgroundColor: ['#6366f1', '#3b82f6', '#f59e0b', '#ef4444', '#10b981'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'bottom' as const, labels: { color: textColor, font: { size: 10 } } },
              tooltip: { enabled: true }
            }
          }
        },
        chart2: {
          type: 'bar' as const,
          title: 'Profit Sensitivity Analysis (Selling Price Adjustment)',
          data: {
            labels: sensitivityLabels,
            datasets: [{
              label: 'Unit Net Profit ($)',
              data: sensitivityData,
              backgroundColor: sensitivityData.map(val => val >= 0 ? 'rgba(16, 185, 129, 0.85)' : 'rgba(239, 68, 68, 0.85)'),
              borderRadius: 6,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true }
            },
            scales: {
              y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
              x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } }
            }
          }
        }
      };
    }

    if (id === 'roas') {
      const sp = v.sellingPrice || 100;
      const pc = v.productCost || 25;
      const sc = v.shippingCost || 10;
      const margin = sp - (pc + sc);
      
      const rates = [0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.04, 0.05];
      const rateLabels = ['0.5% CR', '1.0% CR', '1.5% CR', '2.0% CR', '2.5% CR', '3.0% CR', '4.0% CR', '5.0% CR'];
      const maxCpcs = rates.map(rate => rate * Math.max(0, margin));

      const roasTiers = ['1.5x ROAS', '2.0x ROAS', 'Break-even', '3.0x ROAS', '4.0x ROAS'];
      const profitPerUnit = [1.5, 2.0, sp / Math.max(1, margin), 3.0, 4.0].map(roasValue => {
        const adCost = sp / roasValue;
        return margin - adCost;
      });

      return {
        chart1: {
          type: 'line' as const,
          title: 'Max Acquisition Cost (Max CPC) vs. Store Conversion Rate',
          data: {
            labels: rateLabels,
            datasets: [{
              label: 'Max Bid Cap ($)',
              data: maxCpcs,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.35,
              fill: true,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true }
            },
            scales: {
              y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
              x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } }
            }
          }
        },
        chart2: {
          type: 'bar' as const,
          title: 'Profit per Unit Scaling under different ad spend ROAS run-rates',
          data: {
            labels: roasTiers,
            datasets: [{
              label: 'Net Profits per sale ($)',
              data: profitPerUnit,
              backgroundColor: profitPerUnit.map(p => p >= 0 ? 'rgba(16, 185, 129, 0.85)' : 'rgba(239, 68, 68, 0.85)'),
              borderRadius: 6,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true }
            },
            scales: {
              y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
              x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } }
            }
          }
        }
      };
    }

    if (id === 'roi') {
      const investment = v.investment || 10000;
      const revenue = v.revenue || 15000;
      const profit = revenue - investment;

      return {
        chart1: {
          type: 'doughnut' as const,
          title: 'Total Revenue Distribution Share (Capital Return)',
          data: {
            labels: ['Total Capital Cost', 'Net Business Returns'],
            datasets: [{
              data: [investment, profit > 0 ? profit : 0],
              backgroundColor: ['#64748b', '#10b981'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'bottom' as const, labels: { color: textColor, font: { size: 10 } } },
              tooltip: { enabled: true }
            }
          }
        },
        chart2: {
          type: 'bar' as const,
          title: 'Capital Input, Gross Volume and Profit Overview',
          data: {
            labels: ['Total Investment', 'Total Revenue', 'Net Returns'],
            datasets: [{
              data: [investment, revenue, profit],
              backgroundColor: ['#475569', '#3b82f6', profit >= 0 ? 'rgba(16, 185, 129, 0.85)' : 'rgba(239, 68, 68, 0.85)'],
              borderRadius: 6,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true }
            },
            scales: {
              y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
              x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } }
            }
          }
        }
      };
    }

    if (id === 'ltv') {
      const aov = v.avgOrderValue || 80;
      const freq = v.purchaseFrequency || 3;
      const lifespan = v.customerLifespan || 4;
      const margin = (v.profitMargin || 60) / 100;
      const ltvVal = aov * freq * lifespan;
      const ltvProfit = ltvVal * margin;
      const ltvCost = ltvVal - ltvProfit;

      const yearsArray = Array.from({ length: Math.max(3, Math.min(6, Math.ceil(lifespan) || 4)) }, (_, i) => i + 1);
      const ltvTimeline = yearsArray.map(year => aov * freq * year);
      const cumulativeLabels = yearsArray.map(year => `Year ${year}`);

      return {
        chart1: {
          type: 'line' as const,
          title: 'Cumulative Customer Purchase Value Timeline',
          data: {
            labels: cumulativeLabels,
            datasets: [{
              label: 'Cumulative Customer LTV ($)',
              data: ltvTimeline,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.35,
              fill: true,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true }
            },
            scales: {
              y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
              x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } }
            }
          }
        },
        chart2: {
          type: 'doughnut' as const,
          title: 'Lifetime Profit Generation vs. Delivery Costs',
          data: {
            labels: ['Net Margin Contribution', 'Fulfillment & Service Costs'],
            datasets: [{
              data: [ltvProfit, ltvCost],
              backgroundColor: ['#10b981', '#6366f1'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'bottom' as const, labels: { color: textColor, font: { size: 10 } } },
              tooltip: { enabled: true }
            }
          }
        }
      };
    }

    // Default: 'ecom-profit' or general fallback
    const rev = v.monthlyRevenue || 50000;
    const cg = v.cogs || 15000;
    const sh = v.shipping || 5000;
    const mk = v.marketing || 12000;
    const oh = v.overhead || 8000;
    const totalCosts = cg + sh + mk + oh;
    const ecomProfitVal = rev - totalCosts;

    return {
      chart1: {
        type: 'doughnut' as const,
        title: 'Monthly Cash Flow Breakdown Share',
        data: {
          labels: ['COGS Costs', 'Fulfillment Costs', 'Marketing Ads', 'Operating Overheads', 'Net Income Profit'],
          datasets: [{
            data: [cg, sh, mk, oh, ecomProfitVal > 0 ? ecomProfitVal : 0],
            backgroundColor: ['#6366f1', '#3b82f6', '#f59e0b', '#64748b', '#10b981'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom' as const, labels: { color: textColor, font: { size: 10 } } },
            tooltip: { enabled: true }
          }
        }
      },
      chart2: {
        type: 'bar' as const,
        title: 'Monthly Profit and Loss Overview Ratio',
        data: {
          labels: ['Monthly Store Revenue', 'Combined Expenses', 'Net Monthly Income'],
          datasets: [{
            data: [rev, totalCosts, ecomProfitVal],
            backgroundColor: ['#3b82f6', '#ef4444', ecomProfitVal >= 0 ? 'rgba(16, 185, 129, 0.85)' : 'rgba(239, 68, 68, 0.85)'],
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          },
          scales: {
            y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
            x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } }
          }
        }
      }
    };
  }, [parsedInputs, calculator.id, dark, textColor, gridColor]);

  const loadExample = (exValues: Record<string, string>) => {
    setValues(exValues);
    setTimeout(() => {
      const numericValues: Record<string, number> = {};
      calculator.fields.forEach(f => {
        numericValues[f.id] = parseFloat(exValues[f.id] || '0') || 0;
      });
      const res = calculator.calculate(numericValues);
      setResults(res);
      setCalculated(true);
    }, 100);
  };

  const reset = () => {
    setValues({});
    setResults([]);
    setCalculated(false);
  };


  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className={`p-2.5 rounded-xl transition-all ${dark ? 'btn-ghost' : 'btn-ghost-light'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className={`font-display text-2xl font-semibold ${dark ? 'text-text' : 'text-text-light'}`}>
            {calculator.name}
          </h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
            {calculator.desc}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
          <div className="flex items-center justify-between mb-5">
            <label className={`text-sm font-medium ${dark ? 'text-text' : 'text-text-light'}`}>
              Input Values
            </label>
          </div>

          <div className="space-y-4 mb-5">
            {calculator.fields.map((field) => (
              <div key={field.id}>
                <label className={`block text-xs font-medium mb-2 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={values[field.id] || ''}
                    onChange={e => handleChange(field.id, e.target.value)}
                    placeholder="0"
                    className={`w-full px-4 py-3 rounded-xl text-sm pr-14 ${dark ? 'input' : 'input-light'}`}
                  />
                  <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium ${dark ? 'text-text-subtle' : 'text-text-subtle-light'}`}>
                    {field.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Example chips */}
          {examples.length > 0 && (
            <div className="mb-5">
              <p className={`text-xs font-medium mb-3 ${dark ? 'text-text-subtle' : 'text-text-subtle-light'}`}>
                Quick examples
              </p>
              <div className="flex flex-wrap gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex.title}
                    onClick={() => loadExample(ex.values)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all hover:scale-[1.02] ${
                      dark ? 'chip' : 'chip-light'
                    }`}
                  >
                    {ex.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => calculate()}
              className="flex-1 btn-primary px-5 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate
            </button>
            <button
              onClick={reset}
              className={`px-4 py-3 rounded-xl transition-all ${dark ? 'btn-secondary' : 'btn-secondary-light'}`}
              title="Reset"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
          <div className="flex items-center justify-between mb-5">
            <label className={`text-sm font-medium ${dark ? 'text-text' : 'text-text-light'}`}>
              Results
            </label>
          </div>

          {calculated && results.length > 0 ? (
            <div className="space-y-3 stagger-children">
              {results.map((result) => (
                <div
                  key={result.label}
                  className={`p-5 rounded-xl ${
                    result.highlight
                      ? 'bg-success/10 border border-success/20'
                      : dark ? 'bg-bg border border-border' : 'bg-bg-subtle-light border border-border-light'
                  }`}
                >
                  <p className={`text-xs font-medium mb-1 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                    {result.label}
                  </p>
                  <p className={`text-3xl font-bold font-display ${
                    result.highlight ? 'text-success' : dark ? 'text-text' : 'text-text-light'
                  }`}>
                    {result.value}
                  </p>
                </div>
              ))}

              {/* Custom styled, real functional graphics */}
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div className={`${dark ? 'card' : 'card-light'} p-4 rounded-xl flex flex-col justify-between`} style={{ minHeight: '340px' }}>
                  <div className="mb-2">
                    <p className={`text-xs font-semibold ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                      {customCharts.chart1.title}
                    </p>
                  </div>
                  <div className="flex-1 relative" style={{ minHeight: '260px' }}>
                    {customCharts.chart1.type === 'doughnut' ? (
                      <Doughnut data={customCharts.chart1.data} options={customCharts.chart1.options} />
                    ) : customCharts.chart1.type === 'line' ? (
                      <Line data={customCharts.chart1.data} options={customCharts.chart1.options} />
                    ) : (
                      <Bar data={customCharts.chart1.data} options={customCharts.chart1.options} />
                    )}
                  </div>
                </div>

                <div className={`${dark ? 'card' : 'card-light'} p-4 rounded-xl flex flex-col justify-between`} style={{ minHeight: '340px' }}>
                  <div className="mb-2">
                    <p className={`text-xs font-semibold ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                      {customCharts.chart2.title}
                    </p>
                  </div>
                  <div className="flex-1 relative" style={{ minHeight: '260px' }}>
                    {customCharts.chart2.type === 'doughnut' ? (
                      <Doughnut data={customCharts.chart2.data} options={customCharts.chart2.options} />
                    ) : customCharts.chart2.type === 'line' ? (
                      <Line data={customCharts.chart2.data} options={customCharts.chart2.options} />
                    ) : (
                      <Bar data={customCharts.chart2.data} options={customCharts.chart2.options} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl p-12 flex items-center justify-center ${dark ? 'bg-bg border border-border' : 'bg-bg-subtle-light border border-border-light'}`}>
              <div className={`text-center ${dark ? 'text-text-subtle' : 'text-text-subtle-light'}`}>
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${dark ? 'bg-bg-subtle' : 'bg-bg-muted-light'}`}>
                  <svg className="w-6 h-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium mb-1">No results yet</p>
                <p className="text-xs opacity-60">Enter values or click an example</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
