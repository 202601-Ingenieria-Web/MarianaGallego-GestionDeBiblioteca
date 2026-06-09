"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SaldoDiario } from "./actions";

type SaldosGraficaProps = {
  datos: SaldoDiario[];
  cargando?: boolean;
  libroNombre: string;
};

export function SaldosGrafica({
  datos,
  cargando,
  libroNombre,
}: SaldosGraficaProps) {
  if (cargando) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500">
        Cargando gráfica...
      </div>
    );
  }

  if (datos.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500">
        No hay datos suficientes para mostrar la gráfica.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">
        Evolución de saldo diario — {libroNombre}
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={datos} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="fecha"
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "13px",
            }}
            formatter={(value) => [`${value} unidades`, "Saldo"]}
          />
          <Line
            type="monotone"
            dataKey="saldo"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ fill: "#4f46e5", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
