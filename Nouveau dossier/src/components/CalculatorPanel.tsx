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

  const chartNumbers = useMemo(() => {
    const nums = results
      .map(r => parseFloat(String(r.value).replace(/[^0-9.-]/g, '')))
      .filter(n => !Number.isNaN(n) && Number.isFinite(n));
    if (!nums.length) return [12, 24, 18, 30, 22, 15];
    return nums.slice(0, 6);
  }, [results]);

  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Value',
        data: chartNumbers,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: 'Value',
        data: chartNumbers,
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderRadius: 6,
      },
    ],
  };

  const donutData = {
    labels: labels.slice(0, chartNumbers.length),
    datasets: [
      {
        data: chartNumbers,
        backgroundColor: ['#2563eb', '#3b82f6', '#10b981', '#6366f1', '#22c55e', '#0ea5e9'],
        borderWidth: 0,
      },
    ],
  };

  const radarData = {
    labels,
    datasets: [
      {
        label: 'Score',
        data: chartNumbers,
        backgroundColor: 'rgba(37,99,235,0.2)',
        borderColor: '#2563eb',
        pointBackgroundColor: '#2563eb',
      },
    ],
  };

  const lineOptions = { responsive: true, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(0,0,0,0.06)' } }, x: { grid: { display: false } } } };
  const barOptions = { responsive: true, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(0,0,0,0.06)' } }, x: { grid: { display: false } } } };
  const donutOptions = { responsive: true, plugins: { legend: { display: false }, tooltip: { enabled: true } } };
  const radarOptions = { responsive: true, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { r: { angleLines: { color: 'rgba(0,0,0,0.08)' }, grid: { color: 'rgba(0,0,0,0.08)' }, ticks: { display: false } } } };

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

              {/* Charts (interactive) */}
              <div className="grid md:grid-cols-2 gap-3 pt-2">
                <ChartCard title="Trend" dark={dark}>
                  <Line data={lineData} options={lineOptions} height={120} />
                </ChartCard>
                <ChartCard title="Bars" dark={dark}>
                  <Bar data={barData} options={barOptions} height={120} />
                </ChartCard>
                <ChartCard title="Donut" dark={dark}>
                  <Doughnut data={donutData} options={donutOptions} height={140} />
                </ChartCard>
                <ChartCard title="Radar" dark={dark}>
                  <Radar data={radarData} options={radarOptions} height={140} />
                </ChartCard>
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
